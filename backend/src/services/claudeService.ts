import { Anthropic } from '@anthropic-ai/sdk';
import { ClaudeMessage } from '../types';

class ClaudeService {
  private client: Anthropic | null = null;
  private model: string = 'claude-opus-4-8';

  private getClient(): Anthropic {
    if (!this.client) {
      const apiKey = process.env.CLAUDE_API_KEY;
      if (!apiKey) {
        throw new Error('CLAUDE_API_KEY is not set');
      }
      this.client = new Anthropic({ apiKey });
    }
    return this.client;
  }

  async generateGraphic(prompt: string, context?: Record<string, any>) {
    const systemPrompt = `Eres un experto en Power BI. El usuario solicita crear un gráfico.

Analiza el prompt del usuario y devuelve un JSON con:
{
  "titulo": "título del gráfico",
  "tipo": "bar|column|line|pie|scatter|area",
  "descripcion": "descripción breve",
  "datosEsperados": ["columna1", "columna2"],
  "recomendaciones": ["recomendación 1", "recomendación 2"]
}

Sé conciso y directo.`;

    const response = await this.getClient().messages.create({
      model: this.model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    try {
      return JSON.parse(content.text);
    } catch (e) {
      return {
        titulo: 'Gráfico personalizado',
        tipo: 'bar',
        descripcion: content.text,
        metadata: { raw: content.text },
      };
    }
  }

  async generateDAX(prompt: string, context?: Record<string, any>) {
    const systemPrompt = `Eres un experto en DAX (Data Analysis Expressions) de Power BI.

El usuario solicita generar una medida DAX. Devuelve un JSON con:
{
  "nombre": "nombre_de_la_medida",
  "formula": "la fórmula DAX",
  "explicacion": "explicación simple en español de qué hace",
  "tabla": "tabla_recomendada"
}

La fórmula debe ser válida en Power BI.`;

    const response = await this.getClient().messages.create({
      model: this.model,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    try {
      return JSON.parse(content.text);
    } catch (e) {
      return {
        nombre: 'Medida Personalizada',
        formula: content.text,
        explicacion: 'Medida generada personalizada',
        tabla: '_Medidas',
      };
    }
  }

  async generateTranslations(clave: string, idiomas: string[]) {
    const idiomasMap: Record<string, string> = {
      es: 'Español',
      en: 'Inglés',
      pt: 'Portugués',
      fr: 'Francés',
      zh: 'Chino',
      ja: 'Japonés',
    };

    const idiomasString = idiomas.map((id) => idiomasMap[id] || id).join(', ');

    const systemPrompt = `Eres un traductor profesional. El usuario proporciona una clave y los idiomas a traducir.

Devuelve un JSON con las traducciones:
{
  "es": "traducción en español",
  "en": "traducción en inglés",
  "pt": "traducción en portugués",
  "fr": "traducción en francés",
  "zh": "traducción en chino",
  "ja": "traducción en japonés"
}

Solo incluye los idiomas solicitados. Sé preciso y profesional.`;

    const response = await this.getClient().messages.create({
      model: this.model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Traduce la siguiente clave a ${idiomasString}: "${clave}"`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    try {
      return JSON.parse(content.text);
    } catch (e) {
      const defaultTranslations: Record<string, string> = {
        es: clave,
        en: clave,
        pt: clave,
        fr: clave,
        zh: clave,
        ja: clave,
      };
      return Object.keys(defaultTranslations)
        .filter((lang) => idiomas.includes(lang))
        .reduce((acc, lang) => {
          acc[lang] = defaultTranslations[lang];
          return acc;
        }, {} as Record<string, string>);
    }
  }

  async generateDynamicRoute(paginas: string[]) {
    const systemPrompt = `Eres un experto en Power BI con conocimiento de DAX.

El usuario solicita generar una ruta dinámica (breadcrumb) basada en páginas.
Devuelve un JSON con:
{
  "nombre": "nombre_de_la_ruta",
  "formula": "fórmula DAX con CONCATENATE o &",
  "descripcion": "descripción breve"
}

Usa SELECTEDVALUE para obtener valores dinámicamente.`;

    const paginasString = paginas.join(' > ');

    const response = await this.getClient().messages.create({
      model: this.model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Genera una ruta dinámica DAX para: ${paginasString}`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    try {
      return JSON.parse(content.text);
    } catch (e) {
      const daxFormula = `CONCATENATE(${paginas.map((p) => `"${p}"`).join(', " > "')})`;
      return {
        nombre: `Ruta_${paginas.join('_')}`,
        formula: daxFormula,
        descripcion: `Ruta: ${paginasString}`,
      };
    }
  }

  async analyzeChart(prompt: string) {
    const response = await this.getClient().messages.create({
      model: this.model,
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Análiza este prompt para crear un gráfico en Power BI y sugiere recomendaciones: ${prompt}`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    return content.text;
  }

  async generateWithSystemPrompt(systemPrompt: string, userMessage: string) {
    const response = await this.getClient().messages.create({
      model: this.model,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    return content.text;
  }
}

let instance: ClaudeService | null = null;

export default {
  getInstance(): ClaudeService {
    if (!instance) {
      instance = new ClaudeService();
    }
    return instance;
  },
  async generateGraphic(prompt: string, context?: Record<string, any>) {
    return this.getInstance().generateGraphic(prompt, context);
  },
  async generateDAX(prompt: string, context?: Record<string, any>) {
    return this.getInstance().generateDAX(prompt, context);
  },
  async generateTranslations(clave: string, idiomas: string[]) {
    return this.getInstance().generateTranslations(clave, idiomas);
  },
  async generateDynamicRoute(paginas: string[]) {
    return this.getInstance().generateDynamicRoute(paginas);
  },
  async analyzeChart(prompt: string) {
    return this.getInstance().analyzeChart(prompt);
  },
};
