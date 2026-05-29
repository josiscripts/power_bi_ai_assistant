import React, { useState } from 'react';

interface PredefinedMeasure {
  id: string;
  nombre: string;
  categoria: string;
  formula: string;
  explicacion: string;
  ejemplo: string;
  dificultad: 'fácil' | 'medio' | 'avanzado';
}

const MEDIDAS_PREDEFINIDAS: PredefinedMeasure[] = [
  {
    id: 'suma',
    nombre: 'Suma Total',
    categoria: 'Agregación',
    formula: 'SUM([Columna])',
    explicacion: 'Suma todos los valores de una columna',
    ejemplo: 'SUM(Ventas[Monto])',
    dificultad: 'fácil',
  },
  {
    id: 'promedio',
    nombre: 'Promedio',
    categoria: 'Agregación',
    formula: 'AVERAGE([Columna])',
    explicacion: 'Calcula el promedio de valores',
    ejemplo: 'AVERAGE(Ventas[Precio])',
    dificultad: 'fácil',
  },
  {
    id: 'cuenta',
    nombre: 'Contar Registros',
    categoria: 'Conteo',
    formula: 'COUNTA([Columna])',
    explicacion: 'Cuenta registros no vacíos',
    ejemplo: 'COUNTA(Clientes[ID])',
    dificultad: 'fácil',
  },
  {
    id: 'maximo',
    nombre: 'Valor Máximo',
    categoria: 'Agregación',
    formula: 'MAX([Columna])',
    explicacion: 'Devuelve el valor máximo',
    ejemplo: 'MAX(Ventas[Monto])',
    dificultad: 'fácil',
  },
  {
    id: 'minimo',
    nombre: 'Valor Mínimo',
    categoria: 'Agregación',
    formula: 'MIN([Columna])',
    explicacion: 'Devuelve el valor mínimo',
    ejemplo: 'MIN(Ventas[Precio])',
    dificultad: 'fácil',
  },
  {
    id: 'ytd',
    nombre: 'Año Actual (YTD)',
    categoria: 'Temporal',
    formula:
      'CALCULATE(SUM([Monto]), DATESYTD(Calendario[Fecha]))',
    explicacion: 'Suma acumulada del año hasta hoy',
    ejemplo: 'CALCULATE(SUM(Ventas[Monto]), DATESYTD(Calendario[Fecha]))',
    dificultad: 'medio',
  },
  {
    id: 'growth',
    nombre: 'Crecimiento Porcentual',
    categoria: 'Comparación',
    formula:
      'DIVIDE([Medida_Actual] - [Medida_Anterior], [Medida_Anterior], 0)',
    explicacion: 'Calcula el crecimiento porcentual',
    ejemplo:
      'DIVIDE([Ventas_2024] - [Ventas_2023], [Ventas_2023], 0)',
    dificultad: 'medio',
  },
  {
    id: 'ranking',
    nombre: 'Ranking',
    categoria: 'Clasificación',
    formula:
      'RANK(CALCULATE(SUM([Monto])), ALL([Categoría]))',
    explicacion: 'Asigna ranking a valores',
    ejemplo:
      'RANK(CALCULATE(SUM(Ventas[Monto])), ALL(Productos[Categoría]))',
    dificultad: 'avanzado',
  },
];

interface MeasureLibraryProps {
  onSelectMeasure?: (measure: PredefinedMeasure) => void;
}

export const MeasureLibrary: React.FC<MeasureLibraryProps> = ({
  onSelectMeasure,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categorias = [...new Set(MEDIDAS_PREDEFINIDAS.map((m) => m.categoria))];

  const filteredMeasures = MEDIDAS_PREDEFINIDAS.filter((measure) => {
    const matchCategory =
      !selectedCategory || measure.categoria === selectedCategory;
    const matchSearch =
      measure.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      measure.explicacion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const dificultadColor = (dificultad: string) => {
    switch (dificultad) {
      case 'fácil':
        return 'badge-success';
      case 'medio':
        return 'badge-warning';
      case 'avanzado':
        return 'badge-error';
      default:
        return 'badge-primary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Búsqueda */}
      <div>
        <input
          type="text"
          placeholder="Buscar medidas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input w-full"
        />
      </div>

      {/* Categorías */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg transition ${
            selectedCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todas ({MEDIDAS_PREDEFINIDAS.length})
        </button>
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg transition ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat} ({MEDIDAS_PREDEFINIDAS.filter((m) => m.categoria === cat).length})
          </button>
        ))}
      </div>

      {/* Lista de Medidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMeasures.map((measure) => (
          <div
            key={measure.id}
            className="card hover:shadow-xl transition cursor-pointer"
            onClick={() => onSelectMeasure?.(measure)}
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-gray-900">{measure.nombre}</h4>
              <span className={`badge ${dificultadColor(measure.dificultad)}`}>
                {measure.dificultad}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4">{measure.explicacion}</p>

            <div className="space-y-2">
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">
                  Fórmula Base:
                </p>
                <code className="block bg-gray-100 p-2 rounded text-xs text-gray-800 overflow-auto">
                  {measure.formula}
                </code>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">
                  Ejemplo:
                </p>
                <code className="block bg-gray-100 p-2 rounded text-xs text-gray-800 overflow-auto">
                  {measure.ejemplo}
                </code>
              </div>
            </div>

            <button className="mt-4 btn-primary w-full text-sm">
              Usar esta medida
            </button>
          </div>
        ))}
      </div>

      {filteredMeasures.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron medidas</p>
        </div>
      )}
    </div>
  );
};
