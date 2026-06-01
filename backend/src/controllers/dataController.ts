import { Request, Response } from 'express';
import * as fs from 'fs';
import * as readline from 'readline';
import csvParser from 'csv-parser';
import { APIResponse } from '../types';
import dataSourceService from '../services/dataSourceService';
import aiQueryService from '../services/aiQueryService';

// Subir archivo(s) de datos
export const uploadData = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'No se proporcionó archivo',
      } as APIResponse);
      return;
    }

    // Procesar el archivo en segundo plano para archivos grandes
    dataSourceService.processFile(req.file.path)
      .then((result) => {
        if (!result.success) {
          console.error('Background processing errors:', result.errors);
        } else {
          console.log(`File processed in background: ${req.file.path} -> tables: ${result.tables.map((t) => t.name).join(', ')}`);
        }
      })
      .catch((err) => {
        console.error('Error processing file in background:', err);
      });

    // Responder inmediatamente para no bloquear la subida de archivos grandes
    const catalog = dataSourceService.getCatalog();
    res.status(202).json({
      success: true,
      data: {
        message: 'Archivo recibido. Procesando en segundo plano',
        filePath: req.file.path,
        catalog,
      },
    } as APIResponse);
  } catch (error) {
    console.error('Error uploading data:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error al subir archivo',
    } as APIResponse);
  }
};

// Obtener catálogo completo
export const getCatalog = async (req: Request, res: Response): Promise<void> => {
  try {
    const catalog = dataSourceService.getCatalog();

    res.json({
      success: true,
      data: catalog,
    } as APIResponse);
  } catch (error) {
    console.error('Error getting catalog:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener catálogo',
    } as APIResponse);
  }
};

// Obtener detalles de tabla específica
export const getTable = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tableName } = req.params;
    const table = dataSourceService.getTable(tableName);

    if (!table) {
      res.status(404).json({
        success: false,
        error: `Tabla "${tableName}" no encontrada`,
      } as APIResponse);
      return;
    }

    res.json({
      success: true,
      data: table,
    } as APIResponse);
  } catch (error) {
    console.error('Error getting table:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener tabla',
    } as APIResponse);
  }
};

// Obtener vista previa de datos de tabla
export const getTablePreview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tableName } = req.params;
    const { limit = '10', offset = '0' } = req.query;

    const table = dataSourceService.getTable(tableName);

    if (!table) {
      res.status(404).json({
        success: false,
        error: `Tabla "${tableName}" no encontrada`,
      } as APIResponse);
      return;
    }

    const limitNum = Math.min(parseInt(limit as string) || 10, 10000);
    const offsetNum = parseInt(offset as string) || 0;

    // Para offset=0, usar muestras en caché
    let rows = table.samples.slice(0, limitNum);

    // Para offset > 0, leer desde el archivo
    if (offsetNum > 0 && fs.existsSync(table.filePath)) {
      rows = await readFileLines(table.filePath, offsetNum, limitNum, table.source);
    }

    res.json({
      success: true,
      data: {
        tableName: table.name,
        columns: table.columns.map((c) => ({ name: c.name, type: c.type })),
        rows,
        pagination: {
          offset: offsetNum,
          limit: limitNum,
          total: table.rowCount,
          hasMore: offsetNum + limitNum < table.rowCount,
        },
      },
    } as APIResponse);
  } catch (error) {
    console.error('Error getting table preview:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener vista previa',
    } as APIResponse);
  }
};

// Función auxiliar para leer líneas específicas de un archivo
async function readFileLines(
  filePath: string,
  offset: number,
  limit: number,
  source: string
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const rows: any[] = [];
    let currentLine = 0;

    if (source === 'csv') {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row: any) => {
          if (currentLine >= offset && rows.length < limit) {
            rows.push(row);
          }
          currentLine++;
        })
        .on('end', () => resolve(rows))
        .on('error', reject);
    } else {
      // Para JSON/NDJSON
      const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
      });

      rl.on('line', (line) => {
        try {
          if (currentLine >= offset && rows.length < limit && line.trim()) {
            const row = JSON.parse(line);
            rows.push(row);
          }
          currentLine++;
        } catch (e) {
          // Ignorar líneas inválidas
        }
      });

      rl.on('close', () => resolve(rows));
      rl.on('error', reject);
    }
  });
}

// Procesar consulta con IA
export const queryData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Se requiere "prompt" en el cuerpo de la solicitud',
      } as APIResponse);
      return;
    }

    const catalog = dataSourceService.getCatalog();

    if (catalog.tables.length === 0) {
      res.status(400).json({
        success: false,
        error: 'No hay datos cargados. Por favor, sube un archivo primero.',
      } as APIResponse);
      return;
    }

    const response = await aiQueryService.processQuery(prompt, catalog);

    res.json({
      success: true,
      data: response,
    } as APIResponse);
  } catch (error) {
    console.error('Error querying data:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error procesando consulta',
    } as APIResponse);
  }
};

// Limpiar catálogo
export const clearData = async (req: Request, res: Response): Promise<void> => {
  try {
    dataSourceService.clearCatalog();

    res.json({
      success: true,
      data: { message: 'Catálogo limpiado exitosamente' },
    } as APIResponse);
  } catch (error) {
    console.error('Error clearing data:', error);
    res.status(500).json({
      success: false,
      error: 'Error al limpiar catálogo',
    } as APIResponse);
  }
};
