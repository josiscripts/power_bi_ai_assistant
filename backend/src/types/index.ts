export interface PromptRequest {
  module: string;
  prompt: string;
  context?: Record<string, any>;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GraphicConfig {
  prompt: string;
  tipo: string;
  titulo?: string;
  datos?: Record<string, any>;
  metadata?: Record<string, any>;
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

export interface FilterConfig {
  nombre: string;
  tipo: 'radio' | 'checkbox' | 'date' | 'range' | 'search';
  columna: string;
  multiple: boolean;
  busqueda: boolean;
  menuAvanzado: boolean;
  orden: 'asc' | 'desc';
}

export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'editor' | 'viewer';
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  nombre: string;
  descripcion: string;
  usuarioId: string;
  config: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}
