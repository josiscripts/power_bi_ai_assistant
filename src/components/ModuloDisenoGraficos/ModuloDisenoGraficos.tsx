import React, { useState } from 'react';
import { useAppStore, usePreviewStore } from '@services/store';
import api from '@services/api';

export const ModuloDisenoGraficos: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('bar');
  const { setLoading, isLoading, setError, error } = useAppStore();
  const { setPreviewData, previewData } = usePreviewStore();

  const handleGeneratePreview = async () => {
    if (!prompt.trim()) {
      setError('Por favor ingresa un prompt');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.getGraphicPreview({
        prompt,
        tipo: selectedStyle,
      });
      setPreviewData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar vista previa');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!previewData) {
      setError('No hay vista previa para aplicar');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.applyGraphic(previewData);
      if (response.success) {
        setPrompt('');
        setPreviewData(null);
        setError(null);
      } else {
        setError(response.error || 'Error al aplicar el gráfico');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al aplicar el gráfico');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Diseño de Gráficos con IA</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel de Entrada */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Configuración</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Describe tu gráfico
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ej: Gráfico de barras que muestre ventas por región"
                  className="input h-32 resize-none"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Gráfico
                </label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="input"
                  disabled={isLoading}
                >
                  <option value="bar">Barras</option>
                  <option value="column">Columnas</option>
                  <option value="line">Líneas</option>
                  <option value="pie">Pastel</option>
                  <option value="scatter">Dispersión</option>
                  <option value="area">Área</option>
                </select>
              </div>

              {error && (
                <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleGeneratePreview}
                disabled={isLoading || !prompt.trim()}
                className="btn-primary w-full"
              >
                {isLoading ? 'Generando...' : 'Generar Vista Previa'}
              </button>
            </div>
          </div>
        </div>

        {/* Panel de Vista Previa */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Vista Previa</h3>

            {previewData ? (
              <div className="bg-gray-50 rounded-lg p-8 mb-6">
                <div className="text-center text-gray-600">
                  <svg
                    className="w-24 h-24 mx-auto mb-4 text-primary-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  </svg>
                  <p className="text-gray-600 mb-2">{previewData.titulo}</p>
                  <p className="text-sm text-gray-500">{previewData.tipo}</p>
                </div>

                {previewData.metadata && (
                  <div className="mt-6 bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Detalles</h4>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto text-gray-700">
                      {JSON.stringify(previewData.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-16 text-center">
                <p className="text-gray-500">La vista previa aparecerá aquí</p>
              </div>
            )}

            {previewData && (
              <button onClick={handleApply} disabled={isLoading} className="btn-primary w-full">
                {isLoading ? 'Aplicando...' : 'Aplicar Gráfico'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
