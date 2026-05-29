import React, { useState } from 'react';
import { useAppStore, useFilterStore } from '@services/store';
import type { FilterConfig } from '../../types';

export const ModuloFiltros: React.FC = () => {
  const [filterConfigs, setFilterConfigs] = useState<FilterConfig[]>([]);
  const [nombreFiltro, setNombreFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<FilterConfig['tipo']>('checkbox');
  const [columnaFiltro, setColumnaFiltro] = useState('');
  const { activeFilters, removeFilter, clearFilters } = useFilterStore();
  const { setLoading, isLoading, setError, error } = useAppStore();

  const handleAddFilter = async () => {
    if (!nombreFiltro.trim() || !columnaFiltro.trim()) {
      setError('Por favor completa los campos requeridos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newConfig: FilterConfig = {
        nombre: nombreFiltro,
        tipo: tipoFiltro,
        columna: columnaFiltro,
        multiple: tipoFiltro === 'checkbox',
        busqueda: true,
        menuAvanzado: true,
        orden: 'desc',
      };

      setFilterConfigs([...filterConfigs, newConfig]);
      setNombreFiltro('');
      setColumnaFiltro('');
      setTipoFiltro('checkbox');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear filtro');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFilter = (nombre: string) => {
    setFilterConfigs(filterConfigs.filter((f) => f.nombre !== nombre));
    removeFilter(nombre);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Filtros Visuales Avanzados</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Panel Izquierdo: Crear Filtros */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Nuevo Filtro</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del Filtro
                </label>
                <input
                  type="text"
                  value={nombreFiltro}
                  onChange={(e) => setNombreFiltro(e.target.value)}
                  placeholder="Ej: Año"
                  className="input"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Filtro
                </label>
                <select
                  value={tipoFiltro}
                  onChange={(e) => setTipoFiltro(e.target.value as FilterConfig['tipo'])}
                  className="input"
                  disabled={isLoading}
                >
                  <option value="radio">Radio (Selección única)</option>
                  <option value="checkbox">Checkbox (Múltiple)</option>
                  <option value="date">Fecha</option>
                  <option value="range">Rango</option>
                  <option value="search">Búsqueda</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Columna
                </label>
                <input
                  type="text"
                  value={columnaFiltro}
                  onChange={(e) => setColumnaFiltro(e.target.value)}
                  placeholder="Ej: Tabla[Columna]"
                  className="input"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="bg-error-50 border border-error-200 text-error-700 px-3 py-2 rounded text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleAddFilter}
                disabled={isLoading || !nombreFiltro.trim() || !columnaFiltro.trim()}
                className="btn-primary w-full"
              >
                {isLoading ? 'Creando...' : 'Crear Filtro'}
              </button>
            </div>

            {filterConfigs.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Filtros Creados</h4>
                <div className="space-y-2">
                  {filterConfigs.map((config) => (
                    <div
                      key={config.nombre}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded-lg text-sm"
                    >
                      <span className="font-medium text-gray-900">{config.nombre}</span>
                      <button
                        onClick={() => handleRemoveFilter(config.nombre)}
                        className="text-error-600 hover:text-error-700 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel Derecho: Visualización */}
        <div className="lg:col-span-3">
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Panel de Filtros</h3>

            {filterConfigs.length > 0 ? (
              <div className="space-y-8">
                {/* Filtros Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filterConfigs.map((config) => (
                    <div key={config.nombre} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{config.nombre}</h4>
                        <button className="text-gray-500 hover:text-gray-700">⋯</button>
                      </div>

                      {config.tipo === 'radio' && (
                        <div className="space-y-2">
                          {['Opción 1', 'Opción 2', 'Opción 3'].map((opt) => (
                            <label key={opt} className="flex items-center space-x-2 cursor-pointer">
                              <input type="radio" name={config.nombre} className="w-4 h-4" />
                              <span className="text-sm text-gray-700">{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {config.tipo === 'checkbox' && (
                        <div className="space-y-2">
                          {['Opción 1', 'Opción 2', 'Opción 3'].map((opt) => (
                            <label key={opt} className="flex items-center space-x-2 cursor-pointer">
                              <input type="checkbox" className="w-4 h-4 rounded" />
                              <span className="text-sm text-gray-700">{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {config.tipo === 'date' && (
                        <input type="date" className="input w-full" />
                      )}

                      {config.tipo === 'range' && (
                        <input type="range" className="w-full" />
                      )}

                      {config.tipo === 'search' && (
                        <input
                          type="text"
                          placeholder="Buscar..."
                          className="input"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Filtros Activos */}
                {Object.keys(activeFilters).length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Filtros Activos</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Object.entries(activeFilters).map(([name, value]) => (
                        <div
                          key={name}
                          className="inline-flex items-center gap-2 bg-primary-100 text-primary-900 rounded-full px-4 py-2"
                        >
                          <span className="text-sm font-medium">
                            {name}: {Array.isArray(value) ? value.join(', ') : value}
                          </span>
                          <button
                            onClick={() => removeFilter(name)}
                            className="font-bold hover:bg-primary-200 rounded-full w-5 h-5 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={clearFilters}
                      className="btn-outline text-sm"
                    >
                      Limpiar Selecciones
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Crea un filtro para empezar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
