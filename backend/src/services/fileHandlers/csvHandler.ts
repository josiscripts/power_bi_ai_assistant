import * as fs from 'fs';
import csvParser from 'csv-parser';
import { Table, Column } from '../../types/data';
import { v4 as uuidv4 } from 'uuid';

export class CSVHandler {
  async parse(filePath: string): Promise<Table> {
    return new Promise((resolve, reject) => {
      const rows: any[] = [];
      const columns = new Map<string, Set<any>>();
      let rowCount = 0;
      const SAMPLE_SIZE = 10000; // Solo analizar primeras 10K filas para tipos

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row: any) => {
          rowCount++;

          // Solo almacenar primeras 10K filas para análisis
          if (rows.length < SAMPLE_SIZE) {
            rows.push(row);

            // Rastrear tipos de datos
            Object.keys(row).forEach((key) => {
              if (!columns.has(key)) {
                columns.set(key, new Set());
              }
              if (row[key] !== '' && row[key] !== null && row[key] !== undefined) {
                columns.get(key)?.add(row[key]);
              }
            });
          }
        })
        .on('end', () => {
          // Construir estructura de columnas
          const tableColumns: Column[] = Array.from(columns.entries()).map(([name, values]) => ({
            name,
            type: this.inferType(Array.from(values)),
            nullable: rows.some((r) => !r[name]),
          }));

          // Crear tabla
          const table: Table = {
            id: uuidv4(),
            name: this.getTableNameFromPath(filePath),
            source: 'csv',
            filePath,
            columns: tableColumns,
            rowCount, // Total de filas (sin cargar todas en memoria)
            samples: rows.slice(0, 5),
            metadata: { filePath, totalAnalyzed: rows.length },
          };

          resolve(table);
        })
        .on('error', reject);
    });
  }

  // Inferir tipo de dato de los valores
  private inferType(values: any[]): Column['type'] {
    if (values.length === 0) return 'unknown';

    const sample = values[0];
    if (typeof sample === 'number') return 'number';
    if (typeof sample === 'boolean') return 'boolean';

    // Intentar detectar fecha
    if (this.isDate(sample)) return 'date';

    return 'string';
  }

  // Verificar si es una fecha
  private isDate(value: string): boolean {
    if (!value || typeof value !== 'string') return false;
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}/, // YYYY-MM-DD
      /^\d{2}\/\d{2}\/\d{4}/, // MM/DD/YYYY
      /^\d{1,2}-\d{1,2}-\d{4}/, // DD-MM-YYYY
    ];
    return datePatterns.some((pattern) => pattern.test(value));
  }

  // Extraer nombre de tabla del nombre de archivo
  private getTableNameFromPath(filePath: string): string {
    const fileName = filePath.split('/').pop() || 'data';
    return fileName.replace(/\.[^/.]+$/, '');
  }
}
