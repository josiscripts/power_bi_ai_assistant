import React, { useState } from 'react';
import { DataUploader } from './DataUploader';
import { DataCatalogViewer } from './DataCatalogViewer';
import { DataQueryBox } from './DataQueryBox';

export const DataExplorer: React.FC = () => {
  const [catalog, setCatalog] = useState<any>(null);

  const handleUploadSuccess = (newCatalog: any) => {
    setCatalog(newCatalog);
  };

  const handleClearCatalog = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/data/clear', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setCatalog(null);
      }
    } catch (error) {
      console.error('Error clearing catalog:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Explorador de Datos</h1>
      <p className="text-gray-600 mb-8">Carga tus datos y haz preguntas usando lenguaje natural para obtener análisis inmediatos con IA</p>

      <div className="space-y-8">
        {/* Uploader */}
        <DataUploader onUploadSuccess={handleUploadSuccess} />

        {/* Catalog Viewer */}
        {catalog && catalog.tables && catalog.tables.length > 0 ? (
          <>
            <DataCatalogViewer catalog={catalog} />
            <DataQueryBox />
            <button
              onClick={handleClearCatalog}
              className="btn-outline text-red-600 border-red-600 hover:bg-red-50"
            >
              Limpiar Datos
            </button>
          </>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <p className="text-blue-800 text-lg">👇 Sube un archivo para empezar a explorar tus datos</p>
            <p className="text-blue-600 text-sm mt-2">Formatos soportados: CSV, Excel, JSON</p>
          </div>
        )}
      </div>
    </div>
  );
};
