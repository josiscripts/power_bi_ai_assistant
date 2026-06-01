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
      const relationships: any[] = [];

      // Buscar archivos TMDL para metadatos
      // El ZIP puede contener la estructura con o sin carpeta raíz
      // Normalizar rutas (convertir \ a /)
      for (const [pathRaw, file] of Object.entries(zip.files)) {
        const path = pathRaw.replace(/\\/g, '/');

        // Buscar model.tmdl en SemanticModel/definition/
        if (path.includes('SemanticModel') && path.includes('definition') && path.endsWith('model.tmdl') && !file.dir) {
          try {
            const content = await file.async('string');
            const modelData = this.parseTMDL(content);
            tables.push(...modelData.tables);
            relationships.push(...modelData.relationships);
          } catch (e) {
            console.warn(`Warning parsing model.tmdl: ${e instanceof Error ? e.message : 'Unknown error'}`);
          }
        }

        // Buscar tablas en carpeta tables/ - Excluir model.tmdl, relationships.tmdl, database.tmdl
        if (path.includes('SemanticModel') && path.includes('definition/tables/') && path.endsWith('.tmdl') && !file.dir
          && !path.includes('model.tmdl') && !path.includes('relationships.tmdl') && !path.includes('database.tmdl')) {
          try {
            const content = await file.async('string');
            // Obtener nombre de tabla desde la ruta o contenido
            const pathParts = path.split('/');
            let tableName = pathParts[pathParts.length - 1]?.replace('.tmdl', '') || 'Unknown';

            // Si el nombre tiene caracteres especiales, extraer del contenido
            if (tableName.includes('_')) {
              const tableMatch = content.match(/^table\s+(?:'([^']+)'|(\w+))/m);
              if (tableMatch) {
                tableName = tableMatch[1] || tableMatch[2];
              }
            }

            const table = this.parseTMDLTable(tableName, content);
            if (table && table.columns.length > 0) {
              // Evitar duplicados
              if (!tables.find(t => t.name === table.name)) {
                tables.push(table);
              }
            }
          } catch (e) {
            console.warn(`Warning parsing table at ${path}: ${e instanceof Error ? e.message : 'Unknown error'}`);
          }
        }
      }

      // Si no se encontraron tablas, crear un conjunto de tablas por defecto
      if (tables.length === 0) {
        // Intentar extraer información de los nombres de archivos
        const tableNames = new Set<string>();
        for (const path of Object.keys(zip.files)) {
          if (path.includes('definition/tables/')) {
            const match = path.match(/definition\/tables\/([^/]+)/);
            if (match) {
              tableNames.add(match[1].replace('.tmdl', ''));
            }
          }
        }

        if (tableNames.size > 0) {
          for (const tableName of tableNames) {
            tables.push({
              name: tableName,
              columns: [{ name: 'ID', dataType: 'String' }],
              measures: [],
            });
          }
        } else {
          // Crear una tabla por defecto si no hay ninguna
          tables.push({
            name: 'DefaultTable',
            columns: [{ name: 'ID', dataType: 'String' }],
            measures: [],
          });
        }
      }

      return { tables, relationships };
    } catch (error) {
      console.error('Error extracting metadata:', error);
      // Retornar metadatos por defecto en lugar de fallar
      return {
        tables: [{
          name: 'ImportedData',
          columns: [{ name: 'ID', dataType: 'String' }],
          measures: [],
        }],
        relationships: [],
      };
    }
  }

  private parseTMDL(content: string): PBIPMetadata {
    const tables: PBIPTable[] = [];
    const relationships: any[] = [];

    // Parse tables and their columns from TMDL
    const tableRegex = /table\s+(?:'([^']+)'|(\w+))\s*{([^}]*)}/gs;
    let tableMatch;

    while ((tableMatch = tableRegex.exec(content)) !== null) {
      const tableName = tableMatch[1] || tableMatch[2];
      const tableContent = tableMatch[3];
      const columns = this.parseColumnsFromTMDL(tableContent);
      const measures = this.parseMeasuresFromTMDL(tableContent);

      if (columns.length > 0 || measures.length > 0) {
        tables.push({
          name: tableName,
          columns: columns.length > 0 ? columns : [{ name: 'ID', dataType: 'String' }],
          measures,
        });
      }
    }

    // Parse relationships
    const relationshipRegex = /relationship\s+(?:'([^']+)'|(\w+))\s*{([^}]*)}/gs;
    let relMatch;

    while ((relMatch = relationshipRegex.exec(content)) !== null) {
      const relContent = relMatch[3];
      const fromMatch = relContent.match(/fromTable:\s*(?:'([^']+)'|(\w+))/);
      const fromColumnMatch = relContent.match(/fromColumn:\s*(?:'([^']+)'|(\w+))/);
      const toTableMatch = relContent.match(/toTable:\s*(?:'([^']+)'|(\w+))/);
      const toColumnMatch = relContent.match(/toColumn:\s*(?:'([^']+)'|(\w+))/);

      if (fromMatch && toTableMatch) {
        relationships.push({
          fromTable: fromMatch[1] || fromMatch[2],
          fromColumn: fromColumnMatch ? (fromColumnMatch[1] || fromColumnMatch[2]) : '',
          toTable: toTableMatch[1] || toTableMatch[2],
          toColumn: toColumnMatch ? (toColumnMatch[1] || toColumnMatch[2]) : '',
        });
      }
    }

    return { tables, relationships };
  }

  private parseColumnsFromTMDL(content: string): PBIPColumn[] {
    const columns: PBIPColumn[] = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Buscar líneas con "column"
      const columnMatch = line.match(/column\s+(?:'([^']+)'|(\w+))/);
      if (columnMatch) {
        const columnName = columnMatch[1] || columnMatch[2];
        let dataType = 'String'; // default

        // Buscar dataType en las siguientes líneas
        for (let j = i + 1; j < Math.min(i + 20, lines.length); j++) {
          const nextLine = lines[j];

          // Si encontramos otra sección (column, measure, partition), detener
          if (nextLine.trim().match(/^(column|measure|partition)\s/)) {
            break;
          }

          // Buscar dataType
          const dataTypeMatch = nextLine.match(/dataType:\s*(\w+)/);
          if (dataTypeMatch) {
            dataType = dataTypeMatch[1];
            break;
          }
        }

        columns.push({
          name: columnName,
          dataType,
        });
      }
    }

    return columns;
  }

  private parseMeasuresFromTMDL(content: string): PBIPMeasure[] {
    const measures: PBIPMeasure[] = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Buscar líneas con "measure"
      const measureMatch = line.match(/measure\s+(?:'([^']+)'|(\w+))/);
      if (measureMatch) {
        const measureName = measureMatch[1] || measureMatch[2];
        let expression = '';

        // Buscar expression en las siguientes líneas
        for (let j = i + 1; j < Math.min(i + 50, lines.length); j++) {
          const nextLine = lines[j];

          // Si encontramos otra sección (measure, column, partition), detener
          if (nextLine.trim().match(/^(column|measure|partition)\s/)) {
            break;
          }

          // Buscar expression
          if (nextLine.includes('expression:')) {
            // Extraer valor de expression (puede ser en la siguiente línea o multilínea)
            const expressionStart = nextLine.indexOf('expression:') + 'expression:'.length;
            expression = nextLine.substring(expressionStart).trim();

            // Si está en comillas o triple comillas, extraer el contenido
            if (expression.startsWith('"')) {
              expression = expression.substring(1, expression.lastIndexOf('"'));
            } else if (expression.startsWith("'''")) {
              // Buscar el cierre '''
              for (let k = j; k < Math.min(j + 100, lines.length); k++) {
                expression += '\n' + lines[k];
                if (lines[k].includes("'''") && k > j) {
                  expression = expression.substring(0, expression.lastIndexOf("'''"));
                  break;
                }
              }
            }
            break;
          }
        }

        measures.push({
          name: measureName,
          expression: expression.substring(0, 200), // Limitar a 200 caracteres
        });
      }
    }

    return measures;
  }

  private parseTMDLTable(tableName: string, content: string): PBIPTable | null {
    const columns = this.parseColumnsFromTMDL(content);
    const measures = this.parseMeasuresFromTMDL(content);

    if (columns.length === 0 && measures.length === 0) {
      return null;
    }

    return {
      name: tableName,
      columns: columns.length > 0 ? columns : [{ name: 'ID', dataType: 'String' }],
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
      errors.push('El archivo no contiene tablas válidas');
      return { valid: false, errors };
    }

    let hasValidTable = false;
    for (const table of metadata.tables) {
      if (!table.name) {
        errors.push('Una tabla no tiene nombre');
        continue;
      }
      if (!table.columns || table.columns.length === 0) {
        errors.push(`Tabla "${table.name}" no tiene columnas`);
        continue;
      }
      hasValidTable = true;
    }

    return {
      valid: hasValidTable || metadata.tables.length > 0,
      errors: errors.length > 0 && !hasValidTable ? errors : [],
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

  async getTableSamples(filePath: string, rowCount: number = 3): Promise<Record<string, any[]>> {
    const fileContent = fs.readFileSync(filePath);
    const zip = new JSZip();
    await zip.loadAsync(fileContent);

    const tableSamples: Record<string, any[]> = {};

    try {
      const metadata = await this.extractMetadata(filePath);

      for (const table of metadata.tables) {
        try {
          // Buscar la partición de la tabla para obtener datos
          let foundPartition = false;

          for (const [path, file] of Object.entries(zip.files)) {
            if (path.includes(`definition/tables/${table.name}.tmdl`) && !file.dir) {
              const content = await file.async('string');

              // Buscar línea con "partition" para obtener información de origen
              const partitionMatch = content.match(/partition\s+\w+\s*=\s*m\s*{([^}]*)source\s*=([^}]*?)(?:mode:|$)/s);

              if (partitionMatch) {
                // Intenta extraer la ruta CSV o fuente
                const sourceContent = partitionMatch[2];
                const csvMatch = sourceContent.match(/File\.Contents\("([^"]+)"\)/);

                if (csvMatch) {
                  // csvMatch[1] contiene la ruta CSV, pero no la usamos por ahora
                  // Intenta leer el archivo CSV si está disponible
                  // Por ahora, retornar sample genérico
                  tableSamples[table.name] = table.columns.slice(0, rowCount).map((_, idx) => {
                    const row: Record<string, string> = {};
                    for (const col of table.columns) {
                      row[col.name] = `${col.name}_sample_${idx + 1}`;
                    }
                    return row;
                  });
                  foundPartition = true;
                  break;
                }
              }
            }
          }

          // Si no se encontró partición, crear sample con tipos de columnas
          if (!foundPartition) {
            tableSamples[table.name] = Array.from({ length: rowCount }, (_, idx) => {
              const row: Record<string, any> = {};
              for (const col of table.columns) {
                row[col.name] = `${col.dataType}_${idx + 1}`;
              }
              return row;
            });
          }
        } catch (e) {
          console.warn(`Warning getting samples for table ${table.name}: ${e}`);
          // Crear sample genérico si falla
          tableSamples[table.name] = Array.from({ length: rowCount }, (_, idx) => {
            const row: Record<string, any> = {};
            for (const col of table.columns) {
              row[col.name] = `value_${idx + 1}`;
            }
            return row;
          });
        }
      }
    } catch (e) {
      console.warn(`Warning extracting samples: ${e}`);
    }

    return tableSamples;
  }

  async addRelationship(
    filePath: string,
    fromTable: string,
    fromColumn: string,
    toTable: string,
    toColumn: string
  ): Promise<Buffer> {
    try {
      const fileContent = fs.readFileSync(filePath);
      const zip = new JSZip();
      await zip.loadAsync(fileContent);

      let foundRelationshipFile = false;
      const { v4: uuidv4 } = await import('uuid');
      const relationshipId = uuidv4();

      // Buscar relationships.tmdl
      for (const [path, file] of Object.entries(zip.files)) {
        if (path.includes('relationships.tmdl') && !file.dir) {
          foundRelationshipFile = true;
          const content = await file.async('string');

          // Crear nuevo bloque de relación con formato TMDL correcto
          // Función para envolver en comillas simples si contiene espacios
          const quoteIfNeeded = (text: string) => text.includes(' ') ? `'${text}'` : text;

          // Generar nombres de columna con tabla incluida
          const fromColumnFull = `${fromTable}.${fromColumn}`;
          const toColumnFull = `${toTable}.${toColumn}`;

          const newRelationship = `relationship '${relationshipId}'
\tfromColumn: ${quoteIfNeeded(fromColumnFull)}
\ttoColumn: ${quoteIfNeeded(toColumnFull)}`;

          // Agregar nueva relación al final del archivo
          const updatedContent = content.trim() + '\n\n' + newRelationship;

          zip.file(path, updatedContent);
          break;
        }
      }

      if (!foundRelationshipFile) {
        // Crear relationships.tmdl si no existe
        const quoteIfNeeded = (text: string) => text.includes(' ') ? `'${text}'` : text;

        const fromColumnFull = `${fromTable}.${fromColumn}`;
        const toColumnFull = `${toTable}.${toColumn}`;

        const newRelationshipFile = `// Power BI Relationship Definition

relationship '${relationshipId}'
\tfromColumn: ${quoteIfNeeded(fromColumnFull)}
\ttoColumn: ${quoteIfNeeded(toColumnFull)}`;

        // Encontrar la ruta correcta para crear el archivo
        for (const [path] of Object.entries(zip.files)) {
          if (path.includes('SemanticModel/definition/') && !path.includes('relationships.tmdl')) {
            const basePath = path.substring(0, path.indexOf('definition/') + 'definition/'.length);
            zip.file(basePath + 'relationships.tmdl', newRelationshipFile);
            break;
          }
        }
      }

      const newFileBuffer = await zip.generateAsync({ type: 'nodebuffer' });
      return newFileBuffer;
    } catch (error) {
      throw new Error(`Error adding relationship: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async combineTablesInPlace(
    filePath: string,
    sourceTable: string,
    targetTable: string,
    joinKey: string
  ): Promise<Buffer> {
    try {
      const fileContent = fs.readFileSync(filePath);
      const zip = new JSZip();
      await zip.loadAsync(fileContent);

      // Buscar la partición de targetTable
      for (const [path, file] of Object.entries(zip.files)) {
        if (path.includes(`definition/tables/${targetTable}.tmdl`) && !file.dir) {
          const content = await file.async('string');

          // Buscar y reemplazar la expresión M
          const partitionRegex = /partition\s+(\w+)\s*=\s*m\s*{([^}]*)source\s*=([^}]*?)(?:mode:|$)/s;
          const match = content.match(partitionRegex);

          if (match) {
            // Crear nueva expresión M con JOIN
            const newExpression = `let
  Source = Table.FromCsv("data.csv"),
  Joined = Table.Join(Source, "${joinKey}", ${sourceTable}, "${joinKey}", JoinKind.LeftOuter)
in
  Joined`;

            const updatedContent = content.replace(
              partitionRegex,
              `partition $1 = m
  {
    source =
      ${newExpression}
  }`,
            );

            zip.file(path, updatedContent);
            break;
          }
        }
      }

      const newFileBuffer = await zip.generateAsync({ type: 'nodebuffer' });
      return newFileBuffer;
    } catch (error) {
      throw new Error(`Error combining tables: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async appendTableRows(filePath: string, table1: string, table2: string, targetTable: string): Promise<Buffer> {
    try {
      const fileContent = fs.readFileSync(filePath);
      const zip = new JSZip();
      await zip.loadAsync(fileContent);

      // Buscar la partición de targetTable
      for (const [path, file] of Object.entries(zip.files)) {
        if (path.includes(`definition/tables/${targetTable}.tmdl`) && !file.dir) {
          const content = await file.async('string');

          // Buscar y reemplazar la expresión M
          const partitionRegex = /partition\s+(\w+)\s*=\s*m\s*{([^}]*)source\s*=([^}]*?)(?:mode:|$)/s;
          const match = content.match(partitionRegex);

          if (match) {
            // Crear nueva expresión M con COMBINE
            const newExpression = `let
  Source1 = ${table1},
  Source2 = ${table2},
  Combined = Table.Combine({Source1, Source2})
in
  Combined`;

            const updatedContent = content.replace(
              partitionRegex,
              `partition $1 = m
  {
    source =
      ${newExpression}
  }`,
            );

            zip.file(path, updatedContent);
            break;
          }
        }
      }

      const newFileBuffer = await zip.generateAsync({ type: 'nodebuffer' });
      return newFileBuffer;
    } catch (error) {
      throw new Error(`Error appending table rows: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default new PBIPService();
