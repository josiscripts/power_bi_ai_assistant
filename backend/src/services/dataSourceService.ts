import { FileHandlerFactory } from './fileHandlers/handlerFactory';
import { Table, ParsedData } from '../types/data';
import dataIndexService from './dataIndexService';

class DataSourceService {
  // Procesar archivo cargado
  async processFile(filePath: string): Promise<ParsedData> {
    try {
      // Parsear archivo según su formato
      const tables = await FileHandlerFactory.parse(filePath);

      if (tables.length === 0) {
        return {
          tables: [],
          success: false,
          errors: ['No se encontraron datos en el archivo'],
        };
      }

      // Agregar tablas al catálogo
      tables.forEach((table) => {
        dataIndexService.addTable(table);
      });

      return {
        tables,
        success: true,
      };
    } catch (error) {
      console.error('Error processing file:', error);
      return {
        tables: [],
        success: false,
        errors: [error instanceof Error ? error.message : 'Error al procesar archivo'],
      };
    }
  }

  // Obtener catálogo actual
  getCatalog() {
    return dataIndexService.getCatalog();
  }

  // Obtener tabla específica
  getTable(name: string): Table | null {
    return dataIndexService.getTable(name);
  }

  // Obtener contexto para IA
  getContextForAI(): string {
    return dataIndexService.getContextForAI();
  }

  // Limpiar catálogo
  clearCatalog(): void {
    dataIndexService.clear();
  }
}

export default new DataSourceService();
