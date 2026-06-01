import React, { useState } from 'react';

export const DataQueryBox: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const suggestions = [
    'Dame el promedio de la primera columna numérica',
    'Cuántas filas tiene cada tabla',
    'Lista todas las columnas disponibles',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:3000/api/data/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Error procesando consulta');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">🤖 Pregúntale a la IA</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tu pregunta:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ej: ¿Cuál es el promedio de ventas por región?"
            className="input w-full h-24 resize-none"
            disabled={isLoading}
          />
        </div>

        {/* Sugerencias */}
        <div className="text-sm">
          <p className="text-gray-600 mb-2">💡 Ejemplos:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => setPrompt(sug)}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="btn-primary w-full"
        >
          {isLoading ? '⏳ Analizando...' : '🔍 Analizar con IA'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Resultado */}
      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="font-bold text-green-900 mb-4">✅ Resultado</h4>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">📋 Cálculo o Fórmula:</p>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm break-words">
                {result.calculo_solicitado}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">📍 Ubicación Lógica:</p>
              <div className="bg-blue-50 border border-blue-200 p-2 rounded text-blue-900">
                {result.ubicacion_logica}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">📝 Explicación:</p>
              <p className="text-gray-900">{result.explicacion_breve}</p>
            </div>

            {result.campos_usados && result.campos_usados.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-1">🔑 Campos Usados:</p>
                <div className="flex flex-wrap gap-2">
                  {result.campos_usados.map((campo: string) => (
                    <span
                      key={campo}
                      className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs"
                    >
                      {campo}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
