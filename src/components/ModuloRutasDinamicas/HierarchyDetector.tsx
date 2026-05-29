import React, { useState } from 'react';

interface Hierarchy {
  id: string;
  nombre: string;
  niveles: string[];
  tipo: 'temporal' | 'geográfica' | 'organizacional' | 'producto';
  formula: string;
}

const JERARQUIAS_DETECTADAS: Hierarchy[] = [
  {
    id: 'temporal',
    nombre: 'Jerarquía Temporal',
    niveles: ['Año', 'Trimestre', 'Mes', 'Semana', 'Día'],
    tipo: 'temporal',
    formula:
      'Año > Trimestre > Mes > Semana > Día',
  },
  {
    id: 'geografica',
    nombre: 'Jerarquía Geográfica',
    niveles: ['País', 'Región', 'Provincia', 'Ciudad'],
    tipo: 'geográfica',
    formula:
      'País > Región > Provincia > Ciudad',
  },
  {
    id: 'organizacional',
    nombre: 'Jerarquía Organizacional',
    niveles: ['Empresa', 'Departamento', 'Equipo', 'Empleado'],
    tipo: 'organizacional',
    formula:
      'Empresa > Departamento > Equipo > Empleado',
  },
  {
    id: 'producto',
    nombre: 'Jerarquía de Productos',
    niveles: ['Categoría', 'Subcategoría', 'Marca', 'Producto'],
    tipo: 'producto',
    formula:
      'Categoría > Subcategoría > Marca > Producto',
  },
];

const tipoColores: Record<string, string> = {
  temporal: 'bg-blue-100 text-blue-700',
  geográfica: 'bg-green-100 text-green-700',
  organizacional: 'bg-purple-100 text-purple-700',
  producto: 'bg-orange-100 text-orange-700',
};

interface HierarchyDetectorProps {
  onSelectHierarchy?: (hierarchy: Hierarchy) => void;
}

export const HierarchyDetector: React.FC<HierarchyDetectorProps> = ({
  onSelectHierarchy,
}) => {
  const [selectedHierarchy, setSelectedHierarchy] = useState<Hierarchy | null>(
    null
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSelect = (hierarchy: Hierarchy) => {
    setSelectedHierarchy(hierarchy);
    onSelectHierarchy?.(hierarchy);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          🔍 Detección Automática de Jerarquías
        </h3>
        <p className="text-sm text-blue-700">
          Se detectaron {JERARQUIAS_DETECTADAS.length} jerarquías en tus datos. Selecciona una
          para crear la ruta dinámina.
        </p>
      </div>

      {/* Grid de jerarquías */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {JERARQUIAS_DETECTADAS.map((hierarchy) => (
          <div
            key={hierarchy.id}
            className={`rounded-lg border-2 transition cursor-pointer ${
              selectedHierarchy?.id === hierarchy.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="p-4 space-y-3">
              {/* Encabezado */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">{hierarchy.nombre}</h4>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                      tipoColores[hierarchy.tipo]
                    }`}
                  >
                    {hierarchy.tipo.charAt(0).toUpperCase() + hierarchy.tipo.slice(1)}
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 transition ${
                    expandedId === hierarchy.id ? 'rotate-180' : ''
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </div>

              {/* Niveles - Previsualizacion */}
              <div>
                <div className="flex items-center gap-2">
                  {hierarchy.niveles.slice(0, 3).map((nivel, idx) => (
                    <React.Fragment key={idx}>
                      <div className="bg-gray-100 rounded px-2 py-1 text-xs font-medium text-gray-700">
                        {nivel}
                      </div>
                      {idx < 2 && <span className="text-gray-400">›</span>}
                    </React.Fragment>
                  ))}
                  {hierarchy.niveles.length > 3 && (
                    <>
                      <span className="text-gray-400">›</span>
                      <span className="text-xs text-gray-500">
                        +{hierarchy.niveles.length - 3}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Expandido */}
              {expandedId === hierarchy.id && (
                <div className="space-y-3 border-t border-gray-200 pt-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Todos los niveles:
                    </p>
                    <div className="space-y-1">
                      {hierarchy.niveles.map((nivel, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-600">
                            Nivel {idx + 1}
                          </span>
                          <div className="bg-blue-100 rounded px-2 py-1 text-xs text-blue-700">
                            {nivel}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Fórmula DAX:
                    </p>
                    <code className="block bg-gray-900 text-green-400 p-2 rounded text-xs overflow-auto">
                      {hierarchy.formula}
                    </code>
                  </div>

                  <button
                    onClick={() => handleSelect(hierarchy)}
                    className="btn-primary w-full text-sm"
                  >
                    {selectedHierarchy?.id === hierarchy.id
                      ? '✓ Seleccionado'
                      : 'Usar esta jerarquía'}
                  </button>
                </div>
              )}

              {expandedId !== hierarchy.id && (
                <button
                  onClick={() => setExpandedId(hierarchy.id)}
                  className="btn-ghost text-sm w-full"
                >
                  Ver detalles ›
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Información seleccionada */}
      {selectedHierarchy && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-3">
            ✓ Jerarquía seleccionada: {selectedHierarchy.nombre}
          </h3>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-green-700 mb-2">Estructura de navegación:</p>
              <div className="flex items-center gap-2">
                {selectedHierarchy.niveles.map((nivel, idx) => (
                  <React.Fragment key={idx}>
                    <div className="bg-white rounded px-3 py-2 text-sm font-medium text-gray-900">
                      {nivel}
                    </div>
                    {idx < selectedHierarchy.niveles.length - 1 && (
                      <span className="text-green-600">›</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <button className="btn-primary w-full">
              Generar ruta dinámica
            </button>
          </div>
        </div>
      )}

      {/* Sugerencias */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800 font-semibold mb-2">
          💡 Sugerencias:
        </p>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Puedes combinar múltiples jerarquías en una sola ruta</li>
          <li>• Las jerarquías temporales se actualizan automáticamente</li>
          <li>• Personaliza el orden de los niveles según necesites</li>
        </ul>
      </div>
    </div>
  );
};
