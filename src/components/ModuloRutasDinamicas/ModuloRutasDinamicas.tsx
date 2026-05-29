import React, { useState } from 'react';
import { useAppStore } from '@services/store';
import api from '@services/api';
import type { DynamicRoute } from '../../types';

const SEPARADORES = [
  { value: '>', label: '>' },
  { value: '→', label: '→' },
  { value: '/', label: '/' },
  { value: '❯', label: '❯' },
  { value: '|', label: '|' },
];

export const ModuloRutasDinamicas: React.FC = () => {
  const [paginas, setPaginas] = useState<string[]>(['']);
  const [separador, setSeparador] = useState('>');
  const [rutaGenerada, setRutaGenerada] = useState<DynamicRoute | null>(null);
  const { setLoading, isLoading, setError, error } = useAppStore();

  const handleAddPagina = () => {
    setPaginas([...paginas, '']);
  };

  const handleRemovePagina = (idx: number) => {
    setPaginas(paginas.filter((_, i) => i !== idx));
  };

  const handleChangePagina = (idx: number, valor: string) => {
    const newPaginas = [...paginas];
    newPaginas[idx] = valor;
    setPaginas(newPaginas);
  };

  const handleGenerateRoute = async () => {
    const paginasValidas = paginas.filter((p) => p.trim());
    if (paginasValidas.length < 2) {
      setError('Por favor ingresa al menos 2 páginas');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.generateDynamicRoute(paginasValidas);
      if (response.data) {
        setRutaGenerada({
          nombre: `Ruta_${paginasValidas.join('_')}`,
          paginas: paginasValidas,
          separador,
          formula: response.data.formula,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar ruta');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyFormula = () => {
    if (rutaGenerada) {
      navigator.clipboard.writeText(rutaGenerada.formula);
      setError(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Rutas Dinámicas Multiidioma</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel Izquierdo */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Configuración de Ruta</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Páginas de la Ruta
              </label>
              <div className="space-y-2">
                {paginas.map((pagina, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={pagina}
                      onChange={(e) => handleChangePagina(idx, e.target.value)}
                      placeholder={`Página ${idx + 1}`}
                      className="input flex-1"
                      disabled={isLoading}
                    />
                    {paginas.length > 1 && (
                      <button
                        onClick={() => handleRemovePagina(idx)}
                        disabled={isLoading}
                        className="btn-ghost text-error-600 hover:bg-error-50"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={handleAddPagina}
                disabled={isLoading}
                className="btn-ghost text-sm mt-2 w-full"
              >
                + Agregar página
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Separador
              </label>
              <div className="grid grid-cols-5 gap-2">
                {SEPARADORES.map((sep) => (
                  <button
                    key={sep.value}
                    onClick={() => setSeparador(sep.value)}
                    className={`py-2 rounded-lg font-semibold transition ${
                      separador === sep.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    disabled={isLoading}
                  >
                    {sep.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerateRoute}
              disabled={isLoading || paginas.filter((p) => p.trim()).length < 2}
              className="btn-primary w-full"
            >
              {isLoading ? 'Generando...' : 'Generar Ruta'}
            </button>
          </div>
        </div>

        {/* Panel Derecho */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Vista Previa y Código</h3>

          {rutaGenerada ? (
            <div className="space-y-6">
              {/* Vista Previa */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Vista Previa</h4>
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <p className="text-primary-900 font-semibold">
                    {rutaGenerada.paginas.join(` ${separador} `)}
                  </p>
                </div>
              </div>

              {/* Fórmula DAX */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Fórmula DAX</h4>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-auto max-h-40">
                  <pre>{rutaGenerada.formula}</pre>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="space-y-3">
                <button onClick={handleCopyFormula} className="btn-outline w-full">
                  Copiar Fórmula
                </button>
                <button className="btn-primary w-full">Aplicar Ruta</button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
              <p className="text-gray-500">La ruta aparecerá aquí</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
