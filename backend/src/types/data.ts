// Interfaces para sistema universal de análisis de datos

export interface Column {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'unknown';
  nullable: boolean;
  statistics?: {
    min?: any;
    max?: any;
    avg?: number;
    distinctCount?: number;
  };
}

export interface Table {
  id: string;
  name: string;
  source: 'csv' | 'excel' | 'json' | 'sql' | 'parquet';
  filePath: string;
  columns: Column[];
  rowCount: number;
  samples: any[];
  metadata?: Record<string, any>;
}

export interface DataCatalog {
  id: string;
  tables: Table[];
  uploadedAt: Date;
  fileCount: number;
  totalRows: number;
  metadata: {
    lastModified?: Date;
    sourceFiles?: string[];
    description?: string;
  };
}

export interface AIResponse {
  calculo_solicitado: string;
  ubicacion_logica: string;
  explicacion_breve: string;
  campos_usados?: string[];
  tipo_resultado?: 'scalar' | 'table' | 'formula';
}

export interface ParsedData {
  tables: Table[];
  success: boolean;
  errors?: string[];
}
