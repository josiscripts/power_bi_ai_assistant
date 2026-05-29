export const MODULES = {
  GRAFICOS: 'graficos',
  DAX: 'dax',
  TRADUCCIONES: 'traducciones',
  RUTAS: 'rutas',
  FILTROS: 'filtros',
} as const;

export const IDIOMAS = {
  ES: 'es',
  EN: 'en',
  PT: 'pt',
  FR: 'fr',
  ZH: 'zh',
  JA: 'ja',
} as const;

export const TIPOS_GRAFICO = [
  { value: 'bar', label: 'Barras' },
  { value: 'column', label: 'Columnas' },
  { value: 'line', label: 'Líneas' },
  { value: 'pie', label: 'Pastel' },
  { value: 'scatter', label: 'Dispersión' },
  { value: 'area', label: 'Área' },
  { value: 'combo', label: 'Combinado' },
  { value: 'gauge', label: 'Medidor' },
];

export const TIPOS_FILTRO = [
  { value: 'radio', label: 'Radio (Selección única)' },
  { value: 'checkbox', label: 'Checkbox (Múltiple)' },
  { value: 'date', label: 'Fecha' },
  { value: 'range', label: 'Rango' },
  { value: 'search', label: 'Búsqueda' },
];

export const SEPARADORES_RUTA = [
  { value: '>', label: '>' },
  { value: '→', label: '→' },
  { value: '/', label: '/' },
  { value: '❯', label: '❯' },
  { value: '|', label: '|' },
];

export const API_ENDPOINTS = {
  PROMPT: '/prompt',
  GRAPHIC_PREVIEW: '/preview/graphic',
  GRAPHIC_APPLY: '/apply/graphic',
  DAX_GENERATE: '/dax/generate',
  DAX_APPLY: '/dax/apply',
  TRANSLATIONS_GENERATE: '/translations/generate',
  TRANSLATIONS_APPLY: '/translations/apply',
  ROUTES_GENERATE: '/routes/generate',
  FILTERS_OPTIONS: '/filters/options',
  FILTERS_APPLY: '/filters/apply',
} as const;

export const ERROR_MESSAGES = {
  EMPTY_PROMPT: 'Por favor ingresa un prompt o descripción',
  EMPTY_FIELD: 'Por favor completa todos los campos requeridos',
  API_ERROR: 'Error al conectar con el servidor',
  VALIDATION_ERROR: 'Error en la validación de datos',
  UNKNOWN_ERROR: 'Ocurrió un error inesperado',
} as const;

export const SUCCESS_MESSAGES = {
  GRAPHIC_CREATED: 'Gráfico creado exitosamente',
  MEASURE_APPLIED: 'Medida DAX aplicada exitosamente',
  TRANSLATIONS_APPLIED: 'Traducciones aplicadas exitosamente',
  ROUTE_CREATED: 'Ruta dinámina creada exitosamente',
  FILTER_CREATED: 'Filtro creado exitosamente',
} as const;
