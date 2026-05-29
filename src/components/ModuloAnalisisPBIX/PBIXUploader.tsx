import React, { useState } from 'react';

interface PBIPColumn {
  name: string;
  dataType: string;
  displayFolder?: string;
}

interface PBIPMeasure {
  name: string;
  expression: string;
  displayFolder?: string;
}

interface PBIPTable {
  name: string;
  columns: PBIPColumn[];
  measures?: PBIPMeasure[];
}

interface PBIPMetadata {
  tables: PBIPTable[];
  relationships: Array<{
    fromTable: string;
    fromColumn: string;
    toTable: string;
    toColumn: string;
  }>;
}

interface PBIPVisualization {
  name: string;
  type: string;
  title: string;
  position?: { x: number; y: number; width: number; height: number };
}

interface UploadedFile {
  filename: string;
  filePath: string;
  metadata: PBIPMetadata;
  visualizations?: PBIPVisualization[];
}

export const PBIXUploader: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith('.zip') && !file.name.endsWith('.pbip')) {
      setError('El archivo debe ser .zip o .pbip (ZIP con estructura PBIP)');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3000/api/pbip/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json() as { success: boolean; data?: UploadedFile; error?: string };

      if (data.success && data.data) {
        setUploadedFile(data.data);
      } else {
        setError(data.error || 'Error al subir archivo');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar archivo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Análisis de Proyecto Power BI (PBIP)</h2>

      {!uploadedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
        >
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sube tu Proyecto Power BI (PBIP)</h3>
          <p className="text-gray-600 mb-6">Arrastra tu archivo .zip con estructura PBIP aquí o haz clic para seleccionar</p>

          <input
            type="file"
            accept=".zip,.pbip"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
            className="hidden"
            id="pbip-input"
            disabled={isLoading}
          />
          <label htmlFor="pbip-input">
            <button
              onClick={() => document.getElementById('pbip-input')?.click()}
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Procesando archivo PBIP...' : 'Seleccionar Archivo PBIP'}
            </button>
          </label>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Información del archivo */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              ✅ Archivo cargado: {uploadedFile.filename}
            </h3>
            <p className="text-gray-600">Tu proyecto PBIP ha sido analizado correctamente</p>
          </div>

          {/* Tablas y Campos */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Tablas y Campos Disponibles</h3>

            <div className="space-y-6">
              {uploadedFile.metadata.tables.map((table) => (
                <div key={table.name} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-900">📊 {table.name}</h4>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {table.columns.length} campos
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {table.columns.map((column) => (
                      <div key={column.name} className="bg-gray-50 p-3 rounded">
                        <p className="font-medium text-gray-900">{column.name}</p>
                        <p className="text-sm text-gray-500">{column.dataType}</p>
                      </div>
                    ))}
                  </div>

                  {table.measures && table.measures.length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        Medidas ({table.measures.length}):
                      </p>
                      <div className="space-y-2">
                        {table.measures.map((measure) => (
                          <div key={measure.name} className="bg-green-50 p-2 rounded text-sm">
                            <p className="font-medium text-gray-900">{measure.name}</p>
                            <p className="text-xs text-gray-600 font-mono overflow-auto max-h-12">
                              {measure.expression}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Relaciones */}
          {uploadedFile.metadata.relationships.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Relaciones entre Tablas</h3>
              <div className="space-y-2">
                {uploadedFile.metadata.relationships.map((rel, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded text-sm">
                    <p className="text-gray-900">
                      <span className="font-medium">{rel.fromTable}</span>
                      {` [${rel.fromColumn}] → `}
                      <span className="font-medium">{rel.toTable}</span>
                      {` [${rel.toColumn}]`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Visualizaciones existentes */}
          {uploadedFile.visualizations && uploadedFile.visualizations.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Gráficos Existentes ({uploadedFile.visualizations.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {uploadedFile.visualizations.map((viz) => (
                  <div key={viz.name} className="border border-orange-200 bg-orange-50 p-4 rounded">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{viz.title}</p>
                        <p className="text-sm text-gray-600">{viz.type}</p>
                      </div>
                      <button className="text-red-600 hover:text-red-700 font-bold">
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Información para agregar gráficos */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">🚀 Próximo Paso</h3>
            <p className="text-gray-700 mb-4">
              Tu archivo PBIP está listo. Ahora puedes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>Generar nuevos gráficos con IA basados en tus datos</li>
              <li>Crear medidas DAX automáticamente</li>
              <li>Agregar gráficos directamente al proyecto</li>
              <li>Descargar el archivo modificado</li>
            </ul>
          </div>

          {/* Acciones */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                setUploadedFile(null);
                setError(null);
              }}
              className="btn-outline flex-1"
            >
              Cargar otro archivo
            </button>
            <button className="btn-primary flex-1">
              Continuar al Análisis
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
