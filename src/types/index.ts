export interface ModuleType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface PromptRequest {
  module: string;
  prompt: string;
  context?: Record<string, any>;
}

export interface PromptResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface FilterConfig {
  nombre: string;
  tipo: 'radio' | 'checkbox' | 'date' | 'range' | 'search';
  columna: string;
  multiple: boolean;
  busqueda: boolean;
  menuAvanzado: boolean;
  orden: 'asc' | 'desc';
  icono?: string;
}

export interface DAXMeasure {
  nombre: string;
  formula: string;
  explicacion: string;
  tabla?: string;
}

export interface Translation {
  clave: string;
  es: string;
  en: string;
  pt: string;
  fr: string;
  zh: string;
  ja: string;
}

export interface DynamicRoute {
  nombre: string;
  paginas: string[];
  separador: string;
  formula: string;
}

export interface ChartConfig {
  tipo: string;
  titulo: string;
  datos: Record<string, any>;
  estilo: Record<string, any>;
}

export interface AppState {
  activeModule: string | null;
  isLoading: boolean;
  error: string | null;
}
