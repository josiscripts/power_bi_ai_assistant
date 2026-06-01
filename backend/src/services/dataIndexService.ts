import { DataCatalog, Table } from '../types/data';
import { v4 as uuidv4 } from 'uuid';

class DataIndexService {
  private catalog: DataCatalog;

  constructor() {
    this.catalog = {
      id: uuidv4(),
      tables: [],
      uploadedAt: new Date(),
      fileCount: 0,
      totalRows: 0,
      metadata: {
        lastModified: new Date(),
        sourceFiles: [],
      },
    };
  }

  // Agregar tabla al catálogo
  addTable(table: Table): void {
    // Verificar que no exista tabla con mismo nombre
    const existingIndex = this.catalog.tables.findIndex((t) => t.name === table.name);
    if (existingIndex >= 0) {
      this.catalog.tables[existingIndex] = table;
    } else {
      this.catalog.tables.push(table);
    }

    // Actualizar metadatos
    this.updateMetadata();
  }

  // Obtener tabla por nombre
  getTable(name: string): Table | null {
    return this.catalog.tables.find((t) => t.name === name) || null;
  }

  // Obtener todas las tablas
  getTables(): Table[] {
    return this.catalog.tables;
  }

  // Obtener catálogo completo
  getCatalog(): DataCatalog {
    return this.catalog;
  }

  // Obtener contexto formateado para IA
  getContextForAI(): string {
    let context = 'CATÁLOGO DE DATOS DISPONIBLES:\n\n';

    this.catalog.tables.forEach((table, idx) => {
      context += `${idx + 1}. TABLA: "${table.name}"\n`;
      context += `   Filas: ${table.rowCount}\n`;
      context += `   Columnas: ${table.columns.map((c) => `${c.name} (${c.type})`).join(', ')}\n`;

      if (table.samples && table.samples.length > 0) {
        context += `   MUESTRAS DE DATOS:\n`;
        table.samples.forEach((row, rowIdx) => {
          context += `      Fila ${rowIdx + 1}: ${JSON.stringify(row)}\n`;
        });
      }
      context += '\n';
    });

    context += `TOTAL: ${this.catalog.tables.length} tablas, ${this.catalog.totalRows} filas`;
    return context;
  }

  // Limpiar catálogo
  clear(): void {
    this.catalog = {
      id: uuidv4(),
      tables: [],
      uploadedAt: new Date(),
      fileCount: 0,
      totalRows: 0,
      metadata: {
        lastModified: new Date(),
        sourceFiles: [],
      },
    };
  }

  // Actualizar metadatos del catálogo
  private updateMetadata(): void {
    this.catalog.totalRows = this.catalog.tables.reduce((sum, table) => sum + table.rowCount, 0);
    this.catalog.fileCount = new Set(this.catalog.tables.map((t) => t.source)).size;
    this.catalog.metadata.lastModified = new Date();
  }
}

export default new DataIndexService();
