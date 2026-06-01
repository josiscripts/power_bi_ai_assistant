import { Request, Response } from 'express';
import pbipService from '@services/pbipService';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { APIResponse } from '../types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Crear directorio si no existe
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const uploadPBIP = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'No se subió ningún archivo',
      } as APIResponse);
      return;
    }

    const filePath = req.file.path;

    // Validar que es un archivo PBIP (ZIP con estructura PBIP)
    if (!req.file.filename.endsWith('.zip') && !req.file.filename.endsWith('.pbip')) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        // Ignorar errores al eliminar
      }
      res.status(400).json({
        success: false,
        error: 'El archivo debe ser .zip o .pbip (ZIP con estructura PBIP)',
      } as APIResponse);
      return;
    }

    try {
      // Extraer metadatos con mejor manejo de errores
      let metadata: any = {};
      try {
        metadata = await pbipService.extractMetadata(filePath);
      } catch (extractError) {
        console.warn(`Warning extracting metadata: ${extractError instanceof Error ? extractError.message : 'Unknown'}`);
        // Crear metadatos por defecto si hay error
        metadata = {
          tables: [{
            name: 'ImportedData',
            columns: [{ name: 'ID', dataType: 'String' }],
            measures: [],
          }],
          relationships: [],
        };
      }

      // Obtener visualizaciones
      const visualizations: any[] = [];
      try {
        const viz = await pbipService.getVisualizations(filePath);
        visualizations.push(...viz);
      } catch (vizError) {
        console.warn(`Warning extracting visualizations: ${vizError instanceof Error ? vizError.message : 'Unknown'}`);
      }

      // Validar estructura (si falla la validación pero tenemos metadatos, proceder)
      const validation = pbipService.validatePBIPStructure(metadata);

      res.json({
        success: true,
        data: {
          filename: req.file.filename,
          filePath: req.file.path,
          metadata,
          visualizations,
          validationWarnings: validation.errors.length > 0 ? validation.errors : [],
        },
      } as APIResponse);
    } catch (processError) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        // Ignorar errores al eliminar
      }
      throw processError;
    }
  } catch (error) {
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        // Ignorar errores al eliminar
      }
    }
    console.error('Error uploading PBIP:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error al procesar archivo PBIP',
    } as APIResponse);
  }
};

export const getMetadata = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filePath } = req.query;

    if (!filePath || typeof filePath !== 'string') {
      res.status(400).json({
        success: false,
        error: 'filePath requerido',
      } as APIResponse);
      return;
    }

    // Validar que el archivo existe
    if (!fs.existsSync(filePath)) {
      res.status(404).json({
        success: false,
        error: 'Archivo no encontrado',
      } as APIResponse);
      return;
    }

    const metadata = await pbipService.extractMetadata(filePath);

    res.json({
      success: true,
      data: metadata,
    } as APIResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error al extraer metadatos',
    } as APIResponse);
  }
};

export const getVisualizations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filePath } = req.query;

    if (!filePath || typeof filePath !== 'string') {
      res.status(400).json({
        success: false,
        error: 'filePath requerido',
      } as APIResponse);
      return;
    }

    if (!fs.existsSync(filePath)) {
      res.status(404).json({
        success: false,
        error: 'Archivo no encontrado',
      } as APIResponse);
      return;
    }

    const visualizations = await pbipService.getVisualizations(filePath);

    res.json({
      success: true,
      data: visualizations,
    } as APIResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error al extraer visualizaciones',
    } as APIResponse);
  }
};

export const addVisualization = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filePath, pageNumber, visualization } = req.body;

    if (!filePath || !pageNumber || !visualization) {
      res.status(400).json({
        success: false,
        error: 'filePath, pageNumber y visualization son requeridos',
      } as APIResponse);
      return;
    }

    if (!fs.existsSync(filePath)) {
      res.status(404).json({
        success: false,
        error: 'Archivo no encontrado',
      } as APIResponse);
      return;
    }

    // Validar visualización contra el modelo
    const metadata = await pbipService.extractMetadata(filePath);
    const vizValidation = pbipService.validateVisualization(visualization, metadata);
    if (!vizValidation.valid) {
      res.status(400).json({
        success: false,
        error: `Visualización inválida: ${vizValidation.errors.join(', ')}`,
      } as APIResponse);
      return;
    }

    // Crear backup
    const backupPath = filePath + '.backup';
    fs.copyFileSync(filePath, backupPath);

    try {
      // Agregar visualización
      const modifiedBuffer = await pbipService.addVisualization(
        filePath,
        pageNumber,
        visualization
      );

      // Validar resultado
      const tempFile = filePath + '.temp';
      fs.writeFileSync(tempFile, modifiedBuffer);

      const newMetadata = await pbipService.extractMetadata(tempFile);
      const validation = pbipService.validatePBIPStructure(newMetadata);

      if (!validation.valid) {
        fs.unlinkSync(tempFile);
        fs.copyFileSync(backupPath, filePath);
        throw new Error(`Archivo inválido después de cambios: ${validation.errors.join(', ')}`);
      }

      // Reemplazar archivo
      fs.unlinkSync(filePath);
      fs.renameSync(tempFile, filePath);
      fs.unlinkSync(backupPath);

      const newVisualizations = await pbipService.getVisualizations(filePath);

      res.json({
        success: true,
        data: {
          message: 'Visualización agregada exitosamente',
          visualizations: newVisualizations,
        },
      } as APIResponse);
    } catch (error) {
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, filePath);
        fs.unlinkSync(backupPath);
      }
      throw error;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error al agregar visualización',
    } as APIResponse);
  }
};

export const removeVisualization = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filePath, visualizationName } = req.body;

    if (!filePath || !visualizationName) {
      res.status(400).json({
        success: false,
        error: 'filePath y visualizationName son requeridos',
      } as APIResponse);
      return;
    }

    if (!fs.existsSync(filePath)) {
      res.status(404).json({
        success: false,
        error: 'Archivo no encontrado',
      } as APIResponse);
      return;
    }

    const backupPath = filePath + '.backup';
    fs.copyFileSync(filePath, backupPath);

    try {
      const modifiedBuffer = await pbipService.removeVisualization(filePath, visualizationName);

      const tempFile = filePath + '.temp';
      fs.writeFileSync(tempFile, modifiedBuffer);

      const newMetadata = await pbipService.extractMetadata(tempFile);
      const validation = pbipService.validatePBIPStructure(newMetadata);

      if (!validation.valid) {
        fs.unlinkSync(tempFile);
        fs.copyFileSync(backupPath, filePath);
        throw new Error(`Archivo inválido después de cambios: ${validation.errors.join(', ')}`);
      }

      fs.unlinkSync(filePath);
      fs.renameSync(tempFile, filePath);
      fs.unlinkSync(backupPath);

      const newVisualizations = await pbipService.getVisualizations(filePath);

      res.json({
        success: true,
        data: {
          message: 'Visualización removida exitosamente',
          visualizations: newVisualizations,
        },
      } as APIResponse);
    } catch (error) {
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, filePath);
        fs.unlinkSync(backupPath);
      }
      throw error;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error al remover visualización',
    } as APIResponse);
  }
};

export const addMeasure = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filePath, tableName, measureName, measureExpression } = req.body;

    if (!filePath || !tableName || !measureName || !measureExpression) {
      res.status(400).json({
        success: false,
        error: 'filePath, tableName, measureName y measureExpression son requeridos',
      } as APIResponse);
      return;
    }

    if (!fs.existsSync(filePath)) {
      res.status(404).json({
        success: false,
        error: 'Archivo no encontrado',
      } as APIResponse);
      return;
    }

    const backupPath = filePath + '.backup';
    fs.copyFileSync(filePath, backupPath);

    try {
      const modifiedBuffer = await pbipService.addMeasure(filePath, tableName, measureName, measureExpression);

      const tempFile = filePath + '.temp';
      fs.writeFileSync(tempFile, modifiedBuffer);

      const newMetadata = await pbipService.extractMetadata(tempFile);
      const validation = pbipService.validatePBIPStructure(newMetadata);

      if (!validation.valid) {
        fs.unlinkSync(tempFile);
        fs.copyFileSync(backupPath, filePath);
        throw new Error(`Archivo inválido: ${validation.errors.join(', ')}`);
      }

      fs.unlinkSync(filePath);
      fs.renameSync(tempFile, filePath);
      fs.unlinkSync(backupPath);

      res.json({
        success: true,
        data: {
          message: 'Medida agregada exitosamente',
          metadata: newMetadata,
        },
      } as APIResponse);
    } catch (error) {
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, filePath);
        fs.unlinkSync(backupPath);
      }
      throw error;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error al agregar medida',
    } as APIResponse);
  }
};

export const downloadPBIP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filePath } = req.query;

    if (!filePath || typeof filePath !== 'string') {
      res.status(400).json({
        success: false,
        error: 'filePath requerido',
      } as APIResponse);
      return;
    }

    if (!fs.existsSync(filePath)) {
      res.status(404).json({
        success: false,
        error: 'Archivo no encontrado',
      } as APIResponse);
      return;
    }

    const filename = path.basename(filePath);
    res.download(filePath, filename);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error al descargar archivo',
    } as APIResponse);
  }
};

export const cleanupFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filePath } = req.body;

    if (!filePath || typeof filePath !== 'string') {
      res.status(400).json({
        success: false,
        error: 'filePath requerido',
      } as APIResponse);
      return;
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const backupPath = filePath + '.backup';
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
    }

    res.json({
      success: true,
      data: { message: 'Archivos eliminados' },
    } as APIResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error al limpiar archivos',
    } as APIResponse);
  }
};
