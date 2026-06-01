import * as fs from 'fs';
import * as readline from 'readline';
import { Table, Column } from '../../types/data';
import { v4 as uuidv4 } from 'uuid';

export class JSONHandler {
  async parse(filePath: string): Promise<Table[]> {
    try {
      // Intentar parsear como JSON completo primero (pequeños archivos)
      const stats = fs.statSync(filePath);
      const fileSizeInMB = stats.size / (1024 * 1024);

      // Si el archivo es pequeño (<100MB), usar parse normal
      if (fileSizeInMB < 100) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        return this.parseJSONStructure(data, filePath);
      }

      // Para archivos grandes, asumir NDJSON (newline-delimited JSON)
      return this.parseNDJSON(filePath);
    } catch (error) {
      console.error('Error parsing JSON file:', error);
      throw new Error('Error al procesar archivo JSON. Asegúrate de que es JSON válido o NDJSON.');
    }
  }

  private parseJSONStructure(data: any, filePath: string): Table[] {
    const tables: Table[] = [];

    // Si es un array, tratarlo como una tabla
    if (Array.isArray(data)) {
      if (data.length > 0) {
        tables.push(this.createTableFromArray(data, 'data', filePath));
      }
    }
    // Si es un objeto con múltiples arrays (cada propiedad = tabla)
    else if (typeof data === 'object' && data !== null) {
      Object.entries(data).forEach(([tableName, tableData]) => {
        if (Array.isArray(tableData) && tableData.length > 0) {
          tables.push(this.createTableFromArray(tableData, tableName, filePath));
        }
      });
    }

    return tables;
  }

  private async parseNDJSON(filePath: string): Promise<Table[]> {
    return new Promise((resolve, reject) => {
      const rows: any[] = [];
      let rowCount = 0;
      const SAMPLE_SIZE = 10000;

      const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
      });

      rl.on('line', (line) => {
        try {
          if (line.trim()) {
            const row = JSON.parse(line);
            rowCount++;

            if (rows.length < SAMPLE_SIZE) {
              rows.push(row);
            }
          }
        } catch (e) {
          // Ignorar líneas inválidas
        }
      });

      rl.on('close', () => {
        if (rows.length === 0) {
          reject(new Error('No se encontraron filas válidas en el archivo NDJSON'));
          return;
        }

        const table = this.createTableFromArray(rows, 'data', filePath, rowCount);
        resolve([table]);
      });

      rl.on('error', reject);
    });
  }

  private createTableFromArray(
    data: any[],
    tableName: string,
    filePath: string,
    totalRows?: number
  ): Table {
    const columns: Column[] = Object.keys(data[0]).map((colName) => ({
      name: colName,
      type: this.inferType(data.map((row) => row[colName])),
      nullable: data.some((row) => !row[colName]),
    }));

    return {
      id: uuidv4(),
      name: tableName,
      source: 'json',
      filePath,
      columns,
      rowCount: totalRows ?? data.length,
      samples: data.slice(0, 5),
      metadata: { isArray: true, totalAnalyzed: data.length },
    };
  }

  private inferType(values: any[]): Column['type'] {
    if (values.length === 0) return 'unknown';

    const nonEmpty = values.filter((v) => v !== null && v !== undefined);
    if (nonEmpty.length === 0) return 'unknown';

    const sample = nonEmpty[0];

    if (typeof sample === 'number') return 'number';
    if (typeof sample === 'boolean') return 'boolean';
    if (sample instanceof Date) return 'date';
    if (typeof sample === 'string' && this.isDate(sample)) return 'date';

    return 'string';
  }

  private isDate(value: string): boolean {
    const datePatterns = [/^\d{4}-\d{2}-\d{2}/, /^\d{2}\/\d{2}\/\d{4}/, /^\d{1,2}-\d{1,2}-\d{4}/];
    return datePatterns.some((pattern) => pattern.test(value));
  }
}
