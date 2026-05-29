import React, { useState } from 'react';
import { useAppStore } from '@services/store';
import api from '@services/api';
import type { DAXMeasure } from '../../types';

export const ModuloMedidasDAX: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [measures, setMeasures] = useState<DAXMeasure[]>([]);
  const [selectedMeasure, setSelectedMeasure] = useState<DAXMeasure | null>(null);
  const { setLoading, isLoading, setError, error } = useAppStore();

  const handleGenerateDAX = async () => {
    if (!prompt.trim()) {
      setError('Por favor ingresa una descripción de la medida');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.generateDAX(prompt, {});
      if (response.data) {
        setMeasures([...measures, response.data]);
        setSelectedMeasure(response.data);
        setPrompt('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar medida DAX');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyMeasure = async (measure: DAXMeasure) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.applyDAX(measure);
      if (response.success) {
        setSelectedMeasure(null);
      } else {
        setError(response.error || 'Error al aplicar la medida');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al aplicar la medida');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Generación de Medidas DAX</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Panel Izquierdo: Entrada */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Nueva Medida</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ¿Qué medida necesitas?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ej: Suma total de ventas del año actual"
                  className="input h-24 resize-none"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="bg-error-50 border border-error-200 text-error-700 px-3 py-2 rounded text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerateDAX}
                disabled={isLoading || !prompt.trim()}
                className="btn-primary w-full"
              >
                {isLoading ? 'Generando...' : 'Generar DAX'}
              </button>
            </div>

            {measures.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Historial</h4>
                <div className="space-y-2">
                  {measures.map((measure, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedMeasure(measure)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                        selectedMeasure === measure
                          ? 'bg-primary-100 text-primary-900'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <p className="font-medium truncate">{measure.nombre}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel Derecho: Detalles */}
        <div className="lg:col-span-3">
          {selectedMeasure ? (
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-6">{selectedMeasure.nombre}</h3>

              <div className="space-y-6">
                {/* Explicación */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Explicación</h4>
                  <p className="text-gray-600">{selectedMeasure.explicacion}</p>
                </div>

                {/* Fórmula DAX */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Fórmula DAX</h4>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto">
                    <pre>{selectedMeasure.formula}</pre>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedMeasure.formula);
                      setError(null);
                    }}
                    className="btn-outline mt-3"
                  >
                    Copiar Fórmula
                  </button>
                </div>

                {/* Tabla Destino */}
                {selectedMeasure.tabla && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Tabla Destino</h4>
                    <p className="text-gray-600">{selectedMeasure.tabla}</p>
                  </div>
                )}

                {/* Botón Aplicar */}
                <button
                  onClick={() => handleApplyMeasure(selectedMeasure)}
                  disabled={isLoading}
                  className="btn-primary w-full"
                >
                  {isLoading ? 'Aplicando...' : 'Aplicar Medida'}
                </button>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-16">
                <svg
                  className="w-16 h-16 mx-auto text-gray-300 mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
                <p className="text-gray-500">Selecciona una medida para ver los detalles</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
