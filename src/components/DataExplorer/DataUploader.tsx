import React, { useState } from 'react';

interface DataUploaderProps {
  onUploadSuccess: (catalog: any) => void;
}

export const DataUploader: React.FC<DataUploaderProps> = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    const validFormats = ['csv', 'xlsx', 'xls', 'json'];
    const ext = file.name.toLowerCase().split('.').pop();

    if (!validFormats.includes(ext || '')) {
      setError(`Formato no soportado. Usa: ${validFormats.join(', ')}`);
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3000/api/data/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onUploadSuccess(data.data.catalog);
      } else {
        setError(data.error || 'Error al subir archivo');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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

      <h3 className="text-lg font-semibold text-gray-900 mb-2">Carga tus Datos</h3>
      <p className="text-gray-600 mb-6">
        Arrastra un archivo aquí o haz clic para seleccionar
      </p>

      <input
        type="file"
        accept=".csv,.xlsx,.xls,.json"
        onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
        className="hidden"
        id="file-input"
        disabled={isLoading}
      />
      <label htmlFor="file-input">
        <button
          onClick={() => document.getElementById('file-input')?.click()}
          disabled={isLoading}
          className="btn-primary"
        >
          {isLoading ? '⏳ Cargando...' : '📁 Seleccionar Archivo'}
        </button>
      </label>

      <p className="text-sm text-gray-500 mt-4">Formatos: CSV, Excel (.xlsx/.xls), JSON</p>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
};
