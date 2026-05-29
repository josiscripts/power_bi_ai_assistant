import JSZip from 'jszip';
import * as fs from 'fs';

export interface PBIXTable {
  name: string;
  columns: PBIXColumn[];
  measures?: PBIXMeasure[];
}

export interface PBIXColumn {
  name: string;
  dataType: string;
  displayFolder?: string;
}

export interface PBIXMeasure {
  name: string;
  expression: string;
  displayFolder?: string;
}

export interface PBIXMetadata {
  tables: PBIXTable[];
  relationships: Array<{
    fromTable: string;
    fromColumn: string;
    toTable: string;
    toColumn: string;
  }>;
}

class PBIXService {
  async extractMetadata(filePath: string): Promise<PBIXMetadata> {
    try {
      const fileContent = fs.readFileSync(filePath);
      const zip = new JSZip();
      await zip.loadAsync(fileContent);

      // Leer el archivo de modelo
      const modelFile = zip.file('Model/metadata.json');
      if (!modelFile) {
        throw new Error('No se encontró metadata.json en el archivo .pbix');
      }

      const modelContent = await modelFile.async('string');
      const model = JSON.parse(modelContent);

      return this.parseModel(model);
    } catch (error) {
      throw new Error(`Error extrayendo metadatos: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parseModel(model: any): PBIXMetadata {
    const tables: PBIXTable[] = [];
    const relationships: any[] = [];

    // Extraer tablas y columnas
    if (model.tables) {
      for (const table of model.tables) {
        const pbiTable: PBIXTable = {
          name: table.name,
          columns: [],
          measures: [],
        };

        // Columnas
        if (table.columns) {
          for (const column of table.columns) {
            pbiTable.columns.push({
              name: column.name,
              dataType: column.dataType || 'Unknown',
              displayFolder: column.displayFolder,
            });
          }
        }

        // Medidas
        if (table.measures) {
          for (const measure of table.measures) {
            pbiTable.measures!.push({
              name: measure.name,
              expression: measure.expression || '',
              displayFolder: measure.displayFolder,
            });
          }
        }

        tables.push(pbiTable);
      }
    }

    // Extraer relaciones
    if (model.relationships) {
      for (const rel of model.relationships) {
        relationships.push({
          fromTable: rel.fromTable,
          fromColumn: rel.fromColumnName,
          toTable: rel.toTable,
          toColumn: rel.toColumnName,
        });
      }
    }

    return { tables, relationships };
  }

  async addMeasureToTable(filePath: string, tableName: string, measureName: string, measureExpression: string): Promise<Buffer> {
    try {
      const fileContent = fs.readFileSync(filePath);
      const zip = new JSZip();
      await zip.loadAsync(fileContent);

      // Leer modelo
      const modelFile = zip.file('Model/metadata.json');
      if (!modelFile) {
        throw new Error('No se encontró metadata.json');
      }

      const modelContent = await modelFile.async('string');
      const model = JSON.parse(modelContent);

      // Encontrar tabla y agregar medida
      const table = model.tables.find((t: any) => t.name === tableName);
      if (!table) {
        throw new Error(`Tabla "${tableName}" no encontrada`);
      }

      if (!table.measures) {
        table.measures = [];
      }

      // Crear nueva medida
      const newMeasure = {
        name: measureName,
        expression: measureExpression,
        formatString: 'General',
        displayFolder: '_Medidas',
      };

      table.measures.push(newMeasure);

      // Guardar modelo modificado
      const updatedModelContent = JSON.stringify(model, null, 2);
      zip.file('Model/metadata.json', updatedModelContent);

      // Generar archivo .pbix modificado
      const newFileBuffer = await zip.generateAsync({ type: 'nodebuffer' });
      return newFileBuffer;
    } catch (error) {
      throw new Error(`Error al agregar medida: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async addVisualization(
    filePath: string,
    _pageName: string,
    _chartConfig: {
      name: string;
      type: string;
      dataFields: Array<{ field: string; table: string }>;
      visualOptions?: Record<string, any>;
    }
  ): Promise<Buffer> {
    try {
      const fileContent = fs.readFileSync(filePath);
      const zip = new JSZip();
      await zip.loadAsync(fileContent);

      // Nota: Agregar visualizaciones es más complejo y requiere
      // modificar tanto metadata.json como el layout de la página
      // Por ahora retornamos el archivo sin cambios como placeholder

      const newFileBuffer = await zip.generateAsync({ type: 'nodebuffer' });
      return newFileBuffer;
    } catch (error) {
      throw new Error(`Error al agregar visualización: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  validatePBIXStructure(metadata: PBIXMetadata): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!metadata.tables || metadata.tables.length === 0) {
      errors.push('El archivo no contiene tablas');
    }

    for (const table of metadata.tables) {
      if (!table.name) {
        errors.push('Una tabla no tiene nombre');
      }
      if (!table.columns || table.columns.length === 0) {
        errors.push(`Tabla "${table.name}" no tiene columnas`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export default new PBIXService();
