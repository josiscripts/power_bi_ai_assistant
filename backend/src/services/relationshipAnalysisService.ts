import claudeService from './claudeService';
import type { RelationshipAction, TableSample, PBIPMetadata, PBIPTable, PBIPColumn, PBIPMeasure } from '../types';

class RelationshipAnalysisService {
  async analyzeTableRelationships(
    metadata: PBIPMetadata,
    tableSamples: TableSample
  ): Promise<RelationshipAction[]> {
    try {
      // Preparar contexto con información de tablas y muestras
      const tablesContext = this.buildTablesContext(metadata, tableSamples);

      // Prompt del sistema exacto según especificación del usuario
      const systemPrompt = `Actúas como un experto en análisis de datos. Tu trabajo es inspeccionar las tablas y muestras recibidas para decidir cómo unirlas correctamente y solucionar el error de elementos no relacionados en el reporte.

Debes evaluar los datos y elegir una de estas tres opciones según corresponda para cada caso:
- "RELACIONAR": Si las tablas tienen campos comunes equivalentes que sirvan de puente directo.
- "COMBINAR": Si una tabla necesita absorber o cruzar columnas de otra a partir de una clave común.
- "ANEXAR": Si las tablas tienen la misma estructura y sus filas se deben unificar una debajo de otra.

Soluciona cualquier conflicto de datos y devuelve únicamente un listado estructurado en JSON con las acciones exactas a realizar.

Responde SIEMPRE con un JSON válido con este formato exacto:
{
  "actions": [
    {
      "type": "RELACIONAR" | "COMBINAR" | "ANEXAR",
      "fromTable": "nombre tabla origen",
      "toTable": "nombre tabla destino",
      "fromColumn": "nombre columna origen",
      "toColumn": "nombre columna destino",
      "rationale": "Explicación breve de por qué esta acción",
      "joinKey": "columna común (si aplica)"
    }
  ],
  "summary": "Resumen breve de qué se va a reparar",
  "confidence": 0.85
}`;

      // Llamar a Claude para análisis
      const userMessage = `Analiza estas tablas y sus datos de muestra para detectar relaciones faltantes:

${tablesContext}

Proporciona las acciones exactas en JSON válido.`;

      // Usar método existente de Claude con prompt personalizado
      const response = await claudeService.getInstance().generateWithSystemPrompt(
        systemPrompt,
        userMessage
      );

      // Parsear respuesta JSON
      const analysisResult = this.parseIAResponse(response);

      // Validar y enriquecer acciones
      const validatedActions = this.validateActions(analysisResult.actions, metadata);

      return validatedActions;
    } catch (error) {
      console.error('Error in relationship analysis:', error);
      // Retornar array vacío si hay error
      return [];
    }
  }

  private buildTablesContext(metadata: PBIPMetadata, tableSamples: TableSample): string {
    let context = 'TABLAS Y DATOS:\n\n';

    for (const table of metadata.tables) {
      context += `📊 TABLA: ${table.name}\n`;
      context += `   Columnas: ${table.columns.map((c: PBIPColumn) => `${c.name} (${c.dataType})`).join(', ')}\n`;

      if (table.measures && table.measures.length > 0) {
        context += `   Medidas: ${table.measures.map((m: PBIPMeasure) => m.name).join(', ')}\n`;
      }

      // Agregar muestras de datos si existen
      if (tableSamples[table.name] && tableSamples[table.name].length > 0) {
        context += `   MUESTRAS DE DATOS (primeras 3 filas):\n`;
        tableSamples[table.name].forEach((row: any, idx: number) => {
          context += `      Fila ${idx + 1}: ${JSON.stringify(row)}\n`;
        });
      }

      context += '\n';
    }

    // Agregar relaciones existentes
    if (metadata.relationships && metadata.relationships.length > 0) {
      context += 'RELACIONES EXISTENTES:\n';
      metadata.relationships.forEach((rel: any) => {
        context += `  • ${rel.fromTable}.${rel.fromColumn} → ${rel.toTable}.${rel.toColumn}\n`;
      });
      context += '\n';
    } else {
      context += 'NOTA: No hay relaciones actuales definidas.\n\n';
    }

    return context;
  }

  private parseIAResponse(response: string): {
    actions: RelationshipAction[];
    summary: string;
    confidence: number;
  } {
    try {
      // Intentar extraer JSON de la respuesta
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          actions: parsed.actions || [],
          summary: parsed.summary || 'Análisis completado',
          confidence: parsed.confidence || 0.8,
        };
      }
    } catch (e) {
      console.warn('Failed to parse IA response as JSON:', e);
    }

    // Fallback: retornar respuesta vacía si no se puede parsear
    return {
      actions: [],
      summary: 'No se pudieron detectar relaciones automáticamente',
      confidence: 0,
    };
  }

  private validateActions(actions: RelationshipAction[], metadata: PBIPMetadata): RelationshipAction[] {
    return actions.filter((action: RelationshipAction) => {
      // Verificar que ambas tablas existen
      const fromTableExists = metadata.tables.some((t: PBIPTable) => t.name === action.fromTable);
      const toTableExists = metadata.tables.some((t: PBIPTable) => t.name === action.toTable);

      if (!fromTableExists || !toTableExists) {
        console.warn(
          `Acción descartada: tabla ${fromTableExists ? action.toTable : action.fromTable} no existe`
        );
        return false;
      }

      // Verificar que el tipo es válido
      if (!['RELACIONAR', 'COMBINAR', 'ANEXAR'].includes(action.type)) {
        console.warn(`Acción descartada: tipo inválido ${action.type}`);
        return false;
      }

      // Verificar que las columnas existen
      const fromTable = metadata.tables.find((t: PBIPTable) => t.name === action.fromTable);
      const toTable = metadata.tables.find((t: PBIPTable) => t.name === action.toTable);

      const fromColumnExists = fromTable?.columns.some((c: PBIPColumn) => c.name === action.fromColumn);
      const toColumnExists = toTable?.columns.some((c: PBIPColumn) => c.name === action.toColumn);

      if (!fromColumnExists || !toColumnExists) {
        console.warn(
          `Acción descartada: columna no existe en ${fromColumnExists ? action.toTable : action.fromTable}`
        );
        return false;
      }

      return true;
    });
  }
}

export default new RelationshipAnalysisService();
