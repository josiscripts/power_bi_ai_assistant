import axios, { AxiosInstance } from 'axios';
import type { PromptRequest, PromptResponse } from '../types';

class APIService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3000/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async sendPrompt(request: PromptRequest): Promise<PromptResponse> {
    try {
      const response = await this.api.post('/prompt', request);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getGraphicPreview(config: any): Promise<any> {
    try {
      const response = await this.api.post('/preview/graphic', config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async applyGraphic(config: any): Promise<PromptResponse> {
    try {
      const response = await this.api.post('/apply/graphic', config);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async generateDAX(prompt: string, context: any): Promise<any> {
    try {
      const response = await this.api.post('/dax/generate', { prompt, context });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async applyDAX(measure: any): Promise<PromptResponse> {
    try {
      const response = await this.api.post('/dax/apply', measure);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async generateTranslations(clave: string, idiomas: string[]): Promise<any> {
    try {
      const response = await this.api.post('/translations/generate', { clave, idiomas });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async applyTranslations(data: any): Promise<PromptResponse> {
    try {
      const response = await this.api.post('/translations/apply', data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async generateDynamicRoute(paginas: string[]): Promise<any> {
    try {
      const response = await this.api.post('/routes/generate', { paginas });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getFilterOptions(columna: string): Promise<any> {
    try {
      const response = await this.api.get(`/filters/options/${columna}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async applyFilters(filters: any): Promise<PromptResponse> {
    try {
      const response = await this.api.post('/filters/apply', filters);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export default new APIService();
