import { DataCatalog, AIResponse } from '../types/data';
import claudeService from './claudeService';

class AIQueryService {
  async processQuery(userPrompt: string, catalog: DataCatalog): Promise<AIResponse> {
    try {
      // Construir contexto con catálogo
      const context = this.buildContext(catalog);

      // System prompt especializado
      const systemPrompt = `Actúas como un experto en análisis de datos. Tienes acceso a un catálogo
de tablas que el usuario ha subido a la aplicación.

Cuando el usuario haga una pregunta sobre los datos, debes:
1. Analizar qué datos necesitas para responder
2. Identificar en qué tabla(s) existen esos datos
3. Responder EXCLUSIVAMENTE con un objeto JSON estructurado con estos campos:

{
  "calculo_solicitado": "La fórmula, expresión o operación exacta que resuelve la pregunta. Sé específico con nombres de tablas y columnas.",
  "ubicacion_logica": "El nombre de la tabla donde tiene más sentido aplicar esta operación",
  "explicacion_breve": "Explicación muy corta de qué campos se usaron (máximo 1 línea)"
}

INSTRUCCIONES CRÍTICAS:
- Basate ÚNICAMENTE en los campos y tablas que ves en el catálogo
- Si un campo no existe, di en la explicación "Campo no disponible"
- Sé específico: menciona exactamente qué columnas usar
- Las fórmulas deben ser genéricas pero claras
- NO inventar datos o columnas que no existen`;

      // Mensaje del usuario con contexto
      const userMessage = `${context}

${userPrompt}`;

      // Llamar a Claude
      const response = await claudeService.getInstance().generateWithSystemPrompt(systemPrompt, userMessage);

      // Parsear respuesta JSON
      const parsed = this.parseResponse(response);

      return parsed;
    } catch (error) {
      console.error('Error in AI query processing:', error);
      throw new Error('Error procesando consulta con IA');
    }
  }

  // Construir contexto con catálogo formateado
  private buildContext(catalog: DataCatalog): string {
    let context = 'CATÁLOGO DE DATOS DISPONIBLES:\n\n';

    if (catalog.tables.length === 0) {
      context += 'No hay tablas cargadas aún.';
      return context;
    }

    catalog.tables.forEach((table, idx) => {
      context += `${idx + 1}. TABLA: "${table.name}"\n`;
      context += `   Filas totales: ${table.rowCount}\n`;
      context += `   Columnas disponibles:\n`;

      table.columns.forEach((col) => {
        context += `      - ${col.name} (${col.type})\n`;
      });

      if (table.samples && table.samples.length > 0) {
        context += `   MUESTRAS DE DATOS (primeras filas):\n`;
        table.samples.slice(0, 3).forEach((row, rowIdx) => {
          context += `      Fila ${rowIdx + 1}: ${JSON.stringify(row)}\n`;
        });
      }
      context += '\n';
    });

    context += `\nRESUMEN:\n- Total de tablas: ${catalog.tables.length}\n`;
    context += `- Total de filas: ${catalog.totalRows}\n`;

    return context;
  }

  // Parsear respuesta JSON de Claude
  private parseResponse(response: string): AIResponse {
    try {
      // Buscar JSON en la respuesta
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON encontrado en respuesta');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validar campos requeridos
      if (!parsed.calculo_solicitado || !parsed.ubicacion_logica || !parsed.explicacion_breve) {
        throw new Error('Respuesta JSON incompleta');
      }

      return {
        calculo_solicitado: parsed.calculo_solicitado,
        ubicacion_logica: parsed.ubicacion_logica,
        explicacion_breve: parsed.explicacion_breve,
        campos_usados: parsed.campos_usados || [],
        tipo_resultado: parsed.tipo_resultado || 'formula',
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Error parseando respuesta de IA');
    }
  }
}

export default new AIQueryService();
