import { Request, Response } from 'express';
import pbixService, { PBIXMetadata } from '@services/pbixService';
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

export const uploadPBIX = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      } as APIResponse);
    }

    const filePath = req.file.path;

    // Validar que es un archivo .pbix
    if (!req.file.filename.endsWith('.pbix')) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        error: 'El archivo debe ser .pbix',
      } as APIResponse);
    }

    // Extraer metadatos
    const metadata = await pbixService.extractMetadata(filePath);

    // Validar estructura
    const validation = pbixService.validatePBIXStructure(metadata);
    if (!validation.valid) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        error: `Archivo inválido: ${validation.errors.join(', ')}`,
      } as APIResponse);
    }

    return res.json({
      success: true,
      data: {
        filename: req.file.filename,
        filePath: req.file.path,
        metadata,
      },
    } as APIResponse);
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error al procesar archivo',
    } as APIResponse);
  }
};

export const getMetadata = async (req: Request, res: Response) => {
  try {
    const { filePath } = req.query;

    if (!filePath || typeof filePath !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'filePath requerido',
      } as APIResponse);
    }

    // Validar que el archivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'Archivo no encontrado',
      } as APIResponse);
    }

    const metadata = await pbixService.extractMetadata(filePath);

    return res.json({
      success: true,
      data: metadata,
    } as APIResponse);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error al extraer metadatos',
    } as APIResponse);
  }
};

export const addMeasure = async (req: Request, res: Response) => {
  try {
    const { filePath, tableName, measureName, measureExpression } = req.body;

    if (!filePath || !tableName || !measureName || !measureExpression) {
      return res.status(400).json({
        success: false,
        error: 'filePath, tableName, measureName y measureExpression son requeridos',
      } as APIResponse);
    }

    // Validar archivo
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'Archivo no encontrado',
      } as APIResponse);
    }

    // Crear copia de backup
    const backupPath = filePath + '.backup';
    fs.copyFileSync(filePath, backupPath);

    try {
      // Agregar medida
      const modifiedBuffer = await pbixService.addMeasureToTable(filePath, tableName, measureName, measureExpression);

      // Validar resultado
      const tempFile = filePath + '.temp';
      fs.writeFileSync(tempFile, modifiedBuffer);

      const newMetadata = await pbixService.extractMetadata(tempFile);
      const validation = pbixService.validatePBIXStructure(newMetadata);

      if (!validation.valid) {
        fs.unlinkSync(tempFile);
        fs.copyFileSync(backupPath, filePath);
        throw new Error(`Archivo inválido después de cambios: ${validation.errors.join(', ')}`);
      }

      // Reemplazar archivo original
      fs.unlinkSync(filePath);
      fs.renameSync(tempFile, filePath);
      fs.unlinkSync(backupPath);

      return res.json({
        success: true,
        data: {
          message: 'Medida agregada exitosamente',
          metadata: newMetadata,
        },
      } as APIResponse);
    } catch (error) {
      // Restaurar backup si algo falló
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, filePath);
        fs.unlinkSync(backupPath);
      }
      throw error;
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error al agregar medida',
    } as APIResponse);
  }
};

export const downloadPBIX = async (req: Request, res: Response) => {
  try {
    const { filePath } = req.query;

    if (!filePath || typeof filePath !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'filePath requerido',
      } as APIResponse);
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'Archivo no encontrado',
      } as APIResponse);
    }

    const filename = path.basename(filePath);
    res.download(filePath, filename);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error al descargar archivo',
    } as APIResponse);
  }
};

export const cleanupFile = async (req: Request, res: Response) => {
  try {
    const { filePath } = req.body;

    if (!filePath || typeof filePath !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'filePath requerido',
      } as APIResponse);
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const backupPath = filePath + '.backup';
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
    }

    return res.json({
      success: true,
      data: { message: 'Archivos eliminados' },
    } as APIResponse);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error al limpiar archivos',
    } as APIResponse);
  }
};
