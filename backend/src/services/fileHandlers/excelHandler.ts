import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { Table, Column } from '../../types/data';
import { v4 as uuidv4 } from 'uuid';

export class ExcelHandler {
  async parse(filePath: string): Promise<Table[]> {
    try {
      // Validar tamaño del archivo
      const stats = fs.statSync(filePath);
      const fileSizeInMB = stats.size / (1024 * 1024);

      if (fileSizeInMB > 500) {
        throw new Error(
          `Archivo Excel muy grande (${fileSizeInMB.toFixed(2)}MB). ` +
          'Archivos Excel mayores a 500MB no son soportados. ' +
          'Por favor, usa el formato CSV para archivos grandes.'
        );
      }

      const workbook = XLSX.readFile(filePath);
      const tables: Table[] = [];

      // Procesar cada hoja como una tabla
      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet) as any[];

        if (data.length === 0) return;

        // Inferir tipos de columnas
        const columns: Column[] = Object.keys(data[0] as Record<string, unknown>).map((colName) => ({
          name: colName,
          type: this.inferType(data.map((row: any) => row[colName])),
          nullable: data.some((row: any) => !row[colName]),
        }));

        // Crear tabla
        const table: Table = {
          id: uuidv4(),
          name: sheetName,
          source: 'excel',
          filePath,
          columns,
          rowCount: data.length,
          samples: (data as any[]).slice(0, 5),
          metadata: { sheetName, filePath },
        };

        tables.push(table);
      });

      return tables;
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      throw new Error(error instanceof Error ? error.message : 'Error al procesar archivo Excel');
    }
  }

  // Inferir tipo de dato
  private inferType(values: any[]): Column['type'] {
    if (values.length === 0) return 'unknown';

    // Filtrar valores nulos/vacíos
    const nonEmpty = values.filter((v) => v !== null && v !== undefined && v !== '');
    if (nonEmpty.length === 0) return 'unknown';

    const sample = nonEmpty[0];

    if (typeof sample === 'number') return 'number';
    if (typeof sample === 'boolean') return 'boolean';
    if (sample instanceof Date) return 'date';
    if (typeof sample === 'string') {
      if (this.isDate(sample)) return 'date';
      if (this.isNumber(sample)) return 'number';
    }

    return 'string';
  }

  private isDate(value: string): boolean {
    const datePatterns = [/^\d{4}-\d{2}-\d{2}/, /^\d{2}\/\d{2}\/\d{4}/, /^\d{1,2}-\d{1,2}-\d{4}/];
    return datePatterns.some((pattern) => pattern.test(value));
  }

  private isNumber(value: string): boolean {
    return !isNaN(Number(value)) && value.trim() !== '';
  }
}
