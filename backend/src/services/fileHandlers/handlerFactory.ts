import { Table } from '../../types/data';
import { CSVHandler } from './csvHandler';
import { ExcelHandler } from './excelHandler';
import { JSONHandler } from './jsonHandler';

export class FileHandlerFactory {
  private static csvHandler = new CSVHandler();
  private static excelHandler = new ExcelHandler();
  private static jsonHandler = new JSONHandler();

  // Detectar formato de archivo por extensión
  static getFormat(filename: string): 'csv' | 'excel' | 'json' | 'unknown' {
    const ext = filename.toLowerCase().split('.').pop();
    switch (ext) {
      case 'csv':
        return 'csv';
      case 'xlsx':
      case 'xls':
        return 'excel';
      case 'json':
        return 'json';
      default:
        return 'unknown';
    }
  }

  // Parsear archivo según su formato
  static async parse(filePath: string): Promise<Table[]> {
    const format = this.getFormat(filePath);

    switch (format) {
      case 'csv':
        return [await this.csvHandler.parse(filePath)];
      case 'excel':
        return await this.excelHandler.parse(filePath);
      case 'json':
        return await this.jsonHandler.parse(filePath);
      default:
        throw new Error(`Formato de archivo no soportado: ${format}`);
    }
  }
}
