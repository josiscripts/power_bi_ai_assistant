import React from 'react';

interface ChartData {
  labels: string[];
  values: number[];
  title: string;
}

interface GraphicVisualizerProps {
  data?: ChartData;
  tipo?: string;
}

export const GraphicVisualizer: React.FC<GraphicVisualizerProps> = ({
  data,
  tipo = 'bar',
}) => {

  if (!data) {
    return (
      <div className="bg-gray-50 rounded-lg p-12 text-center">
        <svg
          className="w-16 h-16 mx-auto text-gray-300 mb-4"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        </svg>
        <p className="text-gray-500">Sin datos para visualizar</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.values);
  const chartHeight = 300;

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h3 className="text-lg font-bold text-gray-900">{data.title}</h3>
        <p className="text-sm text-gray-500">Tipo: {tipo}</p>
      </div>

      {/* Gráfico */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Eje Y */}
        <div className="flex gap-4">
          <div className="flex flex-col justify-between text-xs text-gray-500 w-12">
            <span>{maxValue}</span>
            <span>{maxValue / 2}</span>
            <span>0</span>
          </div>

          {/* Gráfico */}
          <div className="flex-1">
            {tipo === 'bar' && (
              <div
                style={{ height: `${chartHeight}px` }}
                className="flex items-end gap-2 border-b border-l border-gray-300"
              >
                {data.values.map((value, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 transition cursor-pointer"
                    style={{
                      height: `${(value / maxValue) * 100}%`,
                      minHeight: '20px',
                    }}
                    title={`${data.labels[idx]}: ${value}`}
                  />
                ))}
              </div>
            )}

            {tipo === 'line' && (
              <svg
                width="100%"
                height={chartHeight}
                className="border-b border-l border-gray-300"
              >
                <polyline
                  points={data.values
                    .map(
                      (value, idx) =>
                        `${(idx / (data.values.length - 1)) * 100}%,${
                          chartHeight - (value / maxValue) * chartHeight
                        }`
                    )
                    .join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
              </svg>
            )}

            {tipo === 'pie' && (
              <div className="flex justify-center items-center h-full">
                <div className="w-40 h-40 rounded-full border-8 border-blue-500" />
              </div>
            )}
          </div>
        </div>

        {/* Eje X */}
        <div className="flex gap-2 mt-4 ml-16">
          {data.labels.map((label, idx) => (
            <div
              key={idx}
              className="flex-1 text-center text-xs text-gray-600 truncate"
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Detalles */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-blue-600">
            {data.values.reduce((a, b) => a + b, 0)}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Promedio</p>
          <p className="text-2xl font-bold text-green-600">
            {(data.values.reduce((a, b) => a + b, 0) / data.values.length).toFixed(
              2
            )}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Máximo</p>
          <p className="text-2xl font-bold text-purple-600">{maxValue}</p>
        </div>
      </div>

      {/* Leyenda */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm font-semibold text-gray-900 mb-3">Datos:</p>
        <div className="grid grid-cols-2 gap-2">
          {data.labels.map((label, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-gray-600">{label}:</span>
              <span className="font-semibold text-gray-900">{data.values[idx]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
