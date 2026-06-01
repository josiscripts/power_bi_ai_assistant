import { Request, Response } from 'express';
import pbipService from '@services/pbipService';
import relationshipAnalysisService from '@services/relationshipAnalysisService';
import * as fs from 'fs';
import * as path from 'path';
import type { APIResponse, RelationshipAction } from '../types';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

export const analyzeRelationships = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filePath } = req.body;

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

    try {
      // Obtener metadatos del archivo
      const metadata = await pbipService.extractMetadata(filePath);

      // Obtener muestras de datos
      const tableSamples = await pbipService.getTableSamples(filePath, 3);

      // Analizar relaciones con IA
      const actions = await relationshipAnalysisService.analyzeTableRelationships(metadata, tableSamples);

      res.json({
        success: true,
        data: {
          actions,
          metadata,
          summary: actions.length > 0 ? `Se detectaron ${actions.length} relaciones a reparar` : 'Sin relaciones faltantes detectadas',
        },
      } as APIResponse);
    } catch (analysisError) {
      console.error('Error in analysis:', analysisError);
      res.status(500).json({
        success: false,
        error: `Error analizando relaciones: ${analysisError instanceof Error ? analysisError.message : 'Unknown error'}`,
      } as APIResponse);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error procesando solicitud',
    } as APIResponse);
  }
};

export const autoRepair = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filePath, actions } = req.body;

    if (!filePath || typeof filePath !== 'string' || !Array.isArray(actions)) {
      res.status(400).json({
        success: false,
        error: 'filePath y actions requeridos',
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

    // Crear backup
    const backupPath = filePath + '.backup';
    fs.copyFileSync(filePath, backupPath);

    try {
      // Leer archivo original
      let buffer = fs.readFileSync(filePath);

      // Aplicar acciones en orden
      for (const action of actions as RelationshipAction[]) {
        try {
          // Escribir buffer a archivo temporal para procesar
          const tempInputPath = filePath + '.temp_input';
          fs.writeFileSync(tempInputPath, buffer);

          let modifiedBuffer: Buffer | null = null;

          if (action.type === 'RELACIONAR') {
            modifiedBuffer = await pbipService.addRelationship(
              tempInputPath,
              action.fromTable,
              action.fromColumn,
              action.toTable,
              action.toColumn
            );
          } else if (action.type === 'COMBINAR') {
            modifiedBuffer = await pbipService.combineTablesInPlace(
              tempInputPath,
              action.fromTable,
              action.toTable,
              action.joinKey || action.fromColumn
            );
          } else if (action.type === 'ANEXAR') {
            modifiedBuffer = await pbipService.appendTableRows(
              tempInputPath,
              action.fromTable,
              action.toTable,
              action.toTable
            );
          } else {
            throw new Error(`Tipo de acción desconocido: ${action.type}`);
          }

          if (modifiedBuffer) {
            buffer = Buffer.from(modifiedBuffer);
          }

          // Limpiar temp input
          if (fs.existsSync(tempInputPath)) {
            fs.unlinkSync(tempInputPath);
          }
        } catch (actionError) {
          console.error(`Error applying action ${action.type}:`, actionError);
          throw new Error(`Error en acción ${action.type}: ${actionError instanceof Error ? actionError.message : 'Unknown'}`);
        }
      }

      // Validar el ZIP modificado
      const tempValidatePath = filePath + '.temp_validate';
      fs.writeFileSync(tempValidatePath, buffer);

      try {
        const newMetadata = await pbipService.extractMetadata(tempValidatePath);
        const validation = pbipService.validatePBIPStructure(newMetadata);

        if (!validation.valid) {
          throw new Error(`Archivo inválido después de cambios: ${validation.errors.join(', ')}`);
        }

        // Generar nombre de archivo reparado con timestamp
        const timestamp = new Date().toISOString().replace(/[:\-T.]/g, '').substring(0, 14);
        const originalName = path.basename(filePath, path.extname(filePath));
        const repairPath = path.join(
          UPLOADS_DIR,
          `${originalName}_REPARADO_${timestamp}.zip`
        );

        // Guardar archivo reparado
        fs.writeFileSync(repairPath, buffer);

        // Cleanup
        if (fs.existsSync(tempValidatePath)) {
          fs.unlinkSync(tempValidatePath);
        }
        if (fs.existsSync(backupPath)) {
          fs.unlinkSync(backupPath);
        }

        res.json({
          success: true,
          data: {
            repairPath,
            fileName: path.basename(repairPath),
            summary: `${actions.length} acciones aplicadas exitosamente`,
            newMetadata,
          },
        } as APIResponse);
      } catch (validationError) {
        // Validation failed, restore from backup
        if (fs.existsSync(tempValidatePath)) {
          fs.unlinkSync(tempValidatePath);
        }
        throw validationError;
      }
    } catch (repairError) {
      // Restore from backup on any error
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, filePath);
        fs.unlinkSync(backupPath);
      }

      console.error('Error during repair:', repairError);
      res.status(500).json({
        success: false,
        error: `Error reparando archivo: ${repairError instanceof Error ? repairError.message : 'Unknown error'}`,
      } as APIResponse);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error procesando solicitud',
    } as APIResponse);
  }
};

export const downloadRepaired = async (req: Request, res: Response): Promise<void> => {
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
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
      }
      // Opcionalmente, limpiar el archivo después de descargarlo
      // fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error descargando archivo',
    } as APIResponse);
  }
};
