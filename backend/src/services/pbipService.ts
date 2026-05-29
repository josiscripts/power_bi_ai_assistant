import JSZip from 'jszip';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export interface PBIPColumn {
  name: string;
  dataType: string;
  displayFolder?: string;
}

export interface PBIPMeasure {
  name: string;
  expression: string;
  displayFolder?: string;
}

export interface PBIPTable {
  name: string;
  columns: PBIPColumn[];
  measures?: PBIPMeasure[];
}

export interface PBIPMetadata {
  tables: PBIPTable[];
  relationships: Array<{
    fromTable: string;
    fromColumn: string;
    toTable: string;
    toColumn: string;
  }>;
}

export interface PBIPVisualization {
  name: string;
  id?: string;
  type: string;
  title?: string;
  position?: { x: number; y: number; width?: number; height?: number; z?: number; tabOrder?: number };
  dataBindings?: Array<{ field: string; table: string; aggregation?: string }>;
  pageId?: string;
  properties?: any;
}

class PBIPService {
  async extractMetadata(filePath: string): Promise<PBIPMetadata> {
    try {
      const fileContent = fs.readFileSync(filePath);
      const zip = new JSZip();
      await zip.loadAsync(fileContent);

      const tables: PBIPTable[] = [];

      // Buscar archivos TMDL para metadatos
      for (const [path, file] of Object.entries(zip.files)) {
        // Buscar model.tmdl en SemanticModel/definition/
        if (path.includes('SemanticModel') && path.includes('definition') && path.endsWith('model.tmdl') && !file.dir) {
          const content = await file.async('string');
          return this.parseTMDL(content);
        }

        // Buscar tablas en carpeta tables/
        if (path.includes('SemanticModel') && path.includes('definition/tables/') && path.endsWith('.tmdl') && !file.dir) {
          try {
            const content = await file.async('string');
            const tableName = path.split('/').pop()?.replace('.tmdl', '') || 'Unknown';
            const table = this.parseTMDLTable(tableName, content);
            if (table) {
              tables.push(table);
            }
          } catch (e) {
            // Ignorar tablas que no se puedan parsear
          }
        }
      }

      // Si no hay tablas, retornar metadatos vacíos
      if (tables.length === 0) {
        return { tables: [], relationships: [] };
      }

      return { tables, relationships: [] };
    } catch (error) {
      throw new Error(`Error extrayendo metadatos: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parseTMDL(content: string): PBIPMetadata {
    const tables: PBIPTable[] = [];
    
    // Búsqueda simple de tablas en TMDL
    const tableMatches = content.match(/table\s+(\w+)/g) || [];
    
    tableMatches.forEach(match => {
      const tableName = match.replace('table ', '').trim();
      tables.push({
        name: tableName,
        columns: [],
        measures: [],
      });
    });

    return { tables, relationships: [] };
  }

  private parseTMDLTable(tableName: string, content: string): PBIPTable | null {
    const columns: any[] = [];
    const measures: any[] = [];

    // Búsqueda simple de columnas en TMDL
    const columnMatches = content.match(/column\s+(\w+)/g) || [];
    columnMatches.forEach(match => {
      const colName = match.replace('column ', '').trim();
      columns.push({
        name: colName,
        dataType: 'String',
      });
    });

    // Búsqueda simple de medidas en TMDL
    const measureMatches = content.match(/measure\s+(\w+)/g) || [];
    measureMatches.forEach(match => {
      const measName = match.replace('measure ', '').trim();
      measures.push({
        name: measName,
        expression: '',
      });
    });

    return {
      name: tableName,
      columns,
      measures,
    };
  }

  async getVisualizations(filePath: string): Promise<PBIPVisualization[]> {
    try {
      const fileContent = fs.readFileSync(filePath);
      const zip = new JSZip();
      await zip.loadAsync(fileContent);

      const visualizations: PBIPVisualization[] = [];

      // Buscar páginas en estructura nueva: {ProjectName}.Report/definition/pages/
      let pagesFile = null;
      let pagesPath = '';

      // 1. Buscar pages.json
      for (const [path, file] of Object.entries(zip.files)) {
        if (path.includes('.Report/definition/pages.json') && !file.dir) {
          pagesFile = file;
          pagesPath = path.replace('/pages.json', '');
          break;
        }
      }

      if (!pagesFile) {
        // Fallback a estructura antigua
        for (const [path, file] of Object.entries(zip.files)) {
          if (path.includes('report/pages/') && path.endsWith('.json') && !file.dir) {
            try {
              const content = await file.async('string');
              const pageData = JSON.parse(content);

              if (pageData.visualizations) {
                visualizations.push(...pageData.visualizations);
              }
            } catch (e) {
              // Ignorar
            }
          }
        }
        return visualizations;
      }

      // Leer pages.json para obtener orden de páginas
      const pagesContent = await pagesFile.async('string');
      const pagesData = JSON.parse(pagesContent);
      const pageIds = pagesData.pageOrder || [];

      // Para cada página, buscar sus visuals
      for (const pageId of pageIds) {
        // Buscar visual.json dentro de {pageId}/visuals/{visualId}/visual.json
        const visualsPrefix = `${pagesPath}/${pageId}/visuals/`;

        for (const [path, file] of Object.entries(zip.files)) {
          if (path.startsWith(visualsPrefix) && path.endsWith('visual.json') && !file.dir) {
            try {
              const visualContent = await file.async('string');
              const visualData = JSON.parse(visualContent);

              visualizations.push({
                id: visualData.name,
                name: visualData.name,
                type: visualData.visual?.visualType || 'unknown',
                pageId: pageId,
                position: visualData.position,
                properties: visualData.visual?.objects || {},
              });
            } catch (e) {
              // Ignorar visuals que no se puedan parsear
            }
          }
        }
      }

      return visualizations;
    } catch (error) {
      throw new Error(`Error extrayendo visualizaciones: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parseModel(model: any): PBIPMetadata {
    const tables: PBIPTable[] = [];
    const relationships: any[] = [];

    // Extraer tablas y columnas
    if (model.tables) {
      for (const table of model.tables) {
        const pbipTable: PBIPTable = {
          name: table.name,
          columns: [],
          measures: [],
        };

        // Columnas
        if (table.columns) {
          for (const column of table.columns) {
            pbipTable.columns.push({
              name: column.name,
              dataType: column.dataType || 'String',
              displayFolder: column.displayFolder,
            });
          }
        }

        // Medidas
        if (table.measures) {
          for (const measure of table.measures) {
            pbipTable.measures!.push({
              name: measure.name,
              expression: measure.expression || '',
              displayFolder: measure.displayFolder,
            });
          }
        }

        tables.push(pbipTable);
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

  async addVisualization(
    filePath: string,
    pageNumber: number,
    visualization: {
      name: string;
      type: string;
      title: string;
      dataBindings: Array<{ field: string; table: string; aggregation?: string }>;
    }
  ): Promise<Buffer> {
    try {
      const fileContent = fs.readFileSync(filePath);
      const zip = new JSZip();
      await zip.loadAsync(fileContent);

      // Buscar pages.json para obtener estructura de páginas
      let pagesPath = '';
      let pageId = '';

      for (const [path, file] of Object.entries(zip.files)) {
        if (path.includes('.Report/definition/pages.json') && !file.dir) {
          pagesPath = path.replace('/pages.json', '');
          const pagesContent = await file.async('string');
          const pagesData = JSON.parse(pagesContent);
          const pageIds = pagesData.pageOrder || [];
          
          // Obtener página por número
          if (pageIds[pageNumber]) {
            pageId = pageIds[pageNumber];
          }
          break;
        }
      }

      if (!pageId) {
        throw new Error(`Página número ${pageNumber} no encontrada`);
      }

      // Crear nuevo visual con ID único
      const visualId = uuidv4().slice(0, 16);
      const visualPath = `${pagesPath}/${pageId}/visuals/${visualId}/visual.json`;

      const newVisualData = {
        $schema: 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.9.0/schema.json',
        name: visualId,
        position: {
          x: 0,
          y: 0,
          z: 0,
          height: 300,
          width: 400,
          tabOrder: 5000,
        },
        visual: {
          visualType: visualization.type,
          objects: {
            title: [
              {
                properties: {
                  text: {
                    expr: {
                      Literal: {
                        Value: `'${visualization.title}'`,
                      },
                    },
                  },
                },
              },
            ],
          },
        },
      };

      zip.file(visualPath, JSON.stringify(newVisualData, null, 2));

      // Generar archivo PBIP modificado
      const newFileBuffer = await zip.generateAsync({ type: 'nodebuffer' });
      return newFileBuffer;
    } catch (error) {
      throw new Error(`Error al agregar visualización: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async removeVisualization(filePath: string, visualizationName: string): Promise<Buffer> {
    try {
      const fileContent = fs.readFileSync(filePath);
      const zip = new JSZip();
      await zip.loadAsync(fileContent);

      // Buscar y remover visual en estructura nueva
      const pathsToRemove: string[] = [];

      for (const [path] of Object.entries(zip.files)) {
        // Buscar visual con nombre coincidente en {pageId}/visuals/{visualId}/visual.json
        if (path.includes('/visuals/') && path.endsWith('visual.json')) {
          try {
            const file = zip.file(path);
            if (file) {
              const content = await file.async('string');
              const visualData = JSON.parse(content);
              
              // Si encontramos el visual por nombre, marcar para eliminar
              if (visualData.name === visualizationName) {
                // Eliminar la carpeta completa del visual (incluyendo directorios)
                const visualDirPath = path.substring(0, path.lastIndexOf('/'));
                for (const [zipPath] of Object.entries(zip.files)) {
                  if (zipPath.startsWith(visualDirPath + '/') || zipPath === visualDirPath) {
                    pathsToRemove.push(zipPath);
                  }
                }
              }
            }
          } catch (e) {
            // Ignorar
          }
        }
      }

      // Remover archivos marcados
      pathsToRemove.forEach(path => {
        zip.remove(path);
      });

      // Fallback: buscar en estructura antigua si no se encontró en nueva
      if (pathsToRemove.length === 0) {
        for (const [path, file] of Object.entries(zip.files)) {
          if (path.includes('report/pages/') && path.endsWith('.json') && !file.dir) {
            try {
              const content = await file.async('string');
              const pageData = JSON.parse(content);

              if (pageData.visualizations) {
                pageData.visualizations = pageData.visualizations.filter(
                  (v: any) => v.name !== visualizationName
                );

                zip.file(path, JSON.stringify(pageData, null, 2));
              }
            } catch (e) {
              // Ignorar
            }
          }
        }
      }

      const newFileBuffer = await zip.generateAsync({ type: 'nodebuffer' });
      return newFileBuffer;
    } catch (error) {
      throw new Error(`Error al remover visualización: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async addMeasure(filePath: string, tableName: string, measureName: string, measureExpression: string): Promise<Buffer> {
    try {
      const fileContent = fs.readFileSync(filePath);
      const zip = new JSZip();
      await zip.loadAsync(fileContent);

      // NOTA: Los archivos TMDL requieren parser más complejo. Por ahora retornamos buffer sin cambios
      // y un warning. La modificación de medidas en TMDL requiere un parser específico.

      // Buscar tabla TMDL
      let foundTable = false;
      for (const [path, file] of Object.entries(zip.files)) {
        if (path.includes('SemanticModel') && path.includes('definition/tables/') && path.endsWith('.tmdl') && !file.dir) {
          const content = await file.async('string');
          if (content.includes(`table ${tableName}`) || content.includes(`table '${tableName}'`)) {
            foundTable = true;
            // Aquí se modificaría el archivo TMDL, pero requiere un parser TMDL completo
            // Por ahora solo confirmamos que la tabla existe
          }
        }
      }

      if (!foundTable) {
        throw new Error(`Tabla "${tableName}" no encontrada en el modelo semantic`);
      }

      // Retornar ZIP sin modificaciones (TMDL parsing está en desarrollo)
      const newFileBuffer = await zip.generateAsync({ type: 'nodebuffer' });
      return newFileBuffer;
    } catch (error) {
      throw new Error(`Error al agregar medida: ${error instanceof Error ? error.message : 'Unknown error'}. Nota: La modificación de medidas en formato TMDL está en desarrollo.`);
    }
  }

  validatePBIPStructure(metadata: PBIPMetadata): { valid: boolean; errors: string[] } {
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

  validateVisualization(
    visualization: PBIPVisualization,
    metadata: PBIPMetadata
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validar propiedades básicas
    if (!visualization.name) {
      errors.push('La visualización debe tener un nombre');
    }
    if (!visualization.type) {
      errors.push('La visualización debe tener un tipo');
    }
    if (!visualization.title) {
      errors.push('La visualización debe tener un título');
    }

    // Validar tipos de gráficos válidos en Power BI
    const validTypes = [
      'BarChart',
      'ColumnChart',
      'LineChart',
      'PieChart',
      'ScatterChart',
      'AreaChart',
      'Table',
      'Matrix',
      'Card',
      'Gauge',
      'KPI',
    ];
    if (visualization.type && !validTypes.includes(visualization.type)) {
      errors.push(`Tipo de gráfico no válido: ${visualization.type}`);
    }

    // Validar bindings de datos
    if (!visualization.dataBindings || visualization.dataBindings.length === 0) {
      errors.push('La visualización debe tener al menos un binding de datos');
    } else {
      for (const binding of visualization.dataBindings) {
        // Verificar que la tabla existe
        const table = metadata.tables.find((t) => t.name === binding.table);
        if (!table) {
          errors.push(`Tabla "${binding.table}" no encontrada en el modelo`);
        } else {
          // Verificar que el campo existe en la tabla
          const fieldExists =
            table.columns.some((c) => c.name === binding.field) ||
            table.measures?.some((m) => m.name === binding.field);

          if (!fieldExists) {
            errors.push(
              `Campo "${binding.field}" no encontrado en tabla "${binding.table}"`
            );
          }
        }
      }
    }

    // Validar posición si existe
    if (visualization.position) {
      const { x, y, width, height } = visualization.position;
      if (typeof x !== 'number' || typeof y !== 'number') {
        errors.push('Posición X,Y debe ser numérica');
      }
      if ((typeof width !== 'number' || width <= 0) && !visualization.position.width) {
        errors.push('Ancho debe ser un número positivo');
      }
      if ((typeof height !== 'number' || height <= 0) && !visualization.position.height) {
        errors.push('Alto debe ser un número positivo');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export default new PBIPService();
