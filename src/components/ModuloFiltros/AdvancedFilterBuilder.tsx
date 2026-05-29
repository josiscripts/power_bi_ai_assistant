import React, { useState } from 'react';

interface FilterOption {
  id: string;
  label: string;
  cantidad: number;
}

interface CascadeLevel {
  nombre: string;
  opciones: FilterOption[];
  seleccionado: string[];
}

interface AdvancedFilterBuilderProps {
  onApplyFilter?: (filtro: any) => void;
}

const MOCK_CASCADE_DATA: Record<string, CascadeLevel> = {
  pais: {
    nombre: 'País',
    opciones: [
      { id: 'es', label: 'España', cantidad: 450 },
      { id: 'mx', label: 'México', cantidad: 320 },
      { id: 'ar', label: 'Argentina', cantidad: 280 },
      { id: 'co', label: 'Colombia', cantidad: 190 },
    ],
    seleccionado: [],
  },
  region: {
    nombre: 'Región',
    opciones: [
      { id: 'madrid', label: 'Madrid', cantidad: 150 },
      { id: 'barcelona', label: 'Barcelona', cantidad: 120 },
      { id: 'valencia', label: 'Valencia', cantidad: 80 },
    ],
    seleccionado: [],
  },
  ciudad: {
    nombre: 'Ciudad',
    opciones: [
      { id: 'madrid_city', label: 'Madrid', cantidad: 150 },
      { id: 'barcelona_city', label: 'Barcelona', cantidad: 120 },
    ],
    seleccionado: [],
  },
};

export const AdvancedFilterBuilder: React.FC<AdvancedFilterBuilderProps> = ({
  onApplyFilter,
}) => {
  const [cascadeFilters, setCascadeFilters] = useState<Record<string, CascadeLevel>>(
    MOCK_CASCADE_DATA
  );
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<
    Record<string, boolean>
  >({});

  const toggleSelection = (level: string, optionId: string) => {
    setCascadeFilters((prev) => ({
      ...prev,
      [level]: {
        ...prev[level],
        seleccionado: prev[level].seleccionado.includes(optionId)
          ? prev[level].seleccionado.filter((id) => id !== optionId)
          : [...prev[level].seleccionado, optionId],
      },
    }));
  };

  const handleSelectAll = (level: string) => {
    setCascadeFilters((prev) => ({
      ...prev,
      [level]: {
        ...prev[level],
        seleccionado: prev[level].opciones.map((opt) => opt.id),
      },
    }));
  };

  const handleClearSelection = (level: string) => {
    setCascadeFilters((prev) => ({
      ...prev,
      [level]: {
        ...prev[level],
        seleccionado: [],
      },
    }));
  };

  const getFilteredOptions = (level: string) => {
    const searchTerm = searchTerms[level] || '';
    return cascadeFilters[level].opciones.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const totalSelected = Object.values(cascadeFilters).reduce(
    (sum, level) => sum + level.seleccionado.length,
    0
  );

  const totalRecords = Object.values(cascadeFilters)
    .flatMap((level) => level.opciones)
    .reduce((sum, opt) => sum + opt.cantidad, 0);

  return (
    <div className="space-y-6">
      {/* Información del filtro */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-purple-900">
              Filtro Cascada Inteligente
            </h3>
            <p className="text-sm text-purple-700">
              {totalSelected} de {totalRecords} registros seleccionados
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-purple-600">
              {totalSelected > 0 ? `${totalRecords}` : '0'}
            </p>
            <p className="text-xs text-purple-600">registros</p>
          </div>
        </div>
      </div>

      {/* Niveles de cascada */}
      <div className="space-y-4">
        {Object.entries(cascadeFilters).map(([levelKey, level]) => (
          <div key={levelKey} className="card">
            {/* Encabezado */}
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <div>
                <h4 className="font-bold text-gray-900">{level.nombre}</h4>
                <p className="text-xs text-gray-500">
                  {level.seleccionado.length} de {level.opciones.length} seleccionados
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSelectAll(levelKey)}
                  className="btn-ghost text-xs"
                >
                  Todos
                </button>
                <button
                  onClick={() => handleClearSelection(levelKey)}
                  className="btn-ghost text-xs text-error-600"
                >
                  Limpiar
                </button>
              </div>
            </div>

            {/* Búsqueda */}
            <input
              type="text"
              placeholder={`Buscar en ${level.nombre}...`}
              value={searchTerms[levelKey] || ''}
              onChange={(e) =>
                setSearchTerms((prev) => ({
                  ...prev,
                  [levelKey]: e.target.value,
                }))
              }
              className="input mb-4"
            />

            {/* Opciones */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {getFilteredOptions(levelKey).map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={level.seleccionado.includes(option.id)}
                    onChange={() => toggleSelection(levelKey, option.id)}
                    className="w-4 h-4"
                  />
                  <span className="flex-1 text-sm font-medium text-gray-900">
                    {option.label}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                    {option.cantidad}
                  </span>
                </label>
              ))}
            </div>

            {/* Opciones avanzadas */}
            <button
              onClick={() =>
                setShowAdvancedOptions((prev) => ({
                  ...prev,
                  [levelKey]: !prev[levelKey],
                }))
              }
              className="mt-3 btn-ghost text-xs w-full"
            >
              {showAdvancedOptions[levelKey]
                ? '- Ocultar opciones avanzadas'
                : '+ Opciones avanzadas'}
            </button>

            {showAdvancedOptions[levelKey] && (
              <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                <button className="btn-ghost text-xs w-full text-left">
                  Invertir selección
                </button>
                <button className="btn-ghost text-xs w-full text-left">
                  Seleccionar solo mayores a 100
                </button>
                <button className="btn-ghost text-xs w-full text-left">
                  Excluir sin datos
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Resumen de filtro */}
      {totalSelected > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-bold text-green-900 mb-3">
            ✓ Filtro configurado
          </h3>
          <div className="space-y-2">
            {Object.entries(cascadeFilters).map(
              ([levelKey, level]) =>
                level.seleccionado.length > 0 && (
                  <div key={levelKey}>
                    <p className="text-sm font-semibold text-green-700">
                      {level.nombre}:
                    </p>
                    <div className="flex gap-2 flex-wrap mt-1">
                      {level.seleccionado.map((id) => {
                        const option = level.opciones.find((opt) => opt.id === id);
                        return (
                          <span
                            key={id}
                            className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
                          >
                            {option?.label}
                            <button
                              onClick={() => toggleSelection(levelKey, id)}
                              className="font-bold hover:text-green-900"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )
            )}
          </div>

          <button
            onClick={() => onApplyFilter?.(cascadeFilters)}
            className="btn-primary w-full mt-4"
          >
            Aplicar filtro
          </button>
        </div>
      )}
    </div>
  );
};
