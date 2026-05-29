import React, { useState } from 'react';

interface PBIPMetadata {
  tables: Array<{
    name: string;
    columns: Array<{ name: string; dataType: string }>;
    measures?: Array<{ name: string; expression: string }>;
  }>;
}

interface GeneratedVisualization {
  name: string;
  type: string;
  title: string;
  dataBindings: Array<{ field: string; table: string; aggregation?: string }>;
}

interface GraphicGeneratorProps {
  metadata: PBIPMetadata;
  filePath: string;
  onVisualizationAdded?: () => void;
}

export const GraphicGenerator: React.FC<GraphicGeneratorProps> = ({
  metadata,
  filePath,
  onVisualizationAdded,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedViz, setGeneratedViz] = useState<GeneratedVisualization | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGenerateGraphic = async () => {
    if (!prompt.trim()) {
      setError('Por favor describe el gráfico que deseas crear');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      // Crear contexto con el modelo disponible
      const modelContext = {
        tables: metadata.tables.map((t) => ({
          name: t.name,
          columns: t.columns.map((c) => c.name),
          measures: t.measures?.map((m) => m.name) || [],
        })),
      };

      // Llamar al backend para generar gráfico
      const response = await fetch('http://localhost:3000/api/preview/graphic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context: modelContext }),
      });

      const data = await response.json() as { success: boolean; data?: GeneratedVisualization; error?: string };

      if (data.success && data.data) {
        setGeneratedViz(data.data);
        setSuccess('Gráfico generado correctamente. Revisa la vista previa y aplica si es correcto.');
      } else {
        setError(data.error || 'Error al generar gráfico con Claude');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar gráfico');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyVisualization = async () => {
    if (!generatedViz) return;

    setIsApplying(true);
    setError(null);

    try {
      // Llamar al endpoint para agregar visualización
      const response = await fetch('http://localhost:3000/api/pbip/add-visualization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath,
          pageNumber: 1,
          visualization: generatedViz,
        }),
      });

      const data = await response.json() as { success: boolean; error?: string };

      if (data.success) {
        setSuccess('¡Gráfico agregado exitosamente!');
        setGeneratedViz(null);
        setPrompt('');
        onVisualizationAdded?.();
      } else {
        setError(data.error || 'Error al aplicar visualización');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al aplicar gráfico');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-900 mb-6">🤖 Generar Gráfico con IA</h3>

      <div className="space-y-6">
        {/* Input para descripción */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Describe el gráfico que deseas
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ejemplo: Mostrar ventas totales por región en un gráfico de barras"
            className="w-full input h-24 resize-none"
            disabled={isGenerating}
          />
          <p className="text-xs text-gray-500 mt-2">
            Describe qué datos quieres visualizar. La IA analizará tu modelo y generará el gráfico.
          </p>
        </div>

        {/* Botón generar */}
        <button
          onClick={handleGenerateGraphic}
          disabled={isGenerating || !prompt.trim()}
          className="btn-primary w-full"
        >
          {isGenerating ? 'Generando con Claude...' : 'Generar Gráfico'}
        </button>

        {/* Errores */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Vista previa del gráfico generado */}
        {generatedViz && (
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-bold text-gray-900 mb-4">Vista Previa</h4>

            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <div className="bg-white border border-gray-200 rounded p-4">
                <h5 className="font-bold text-gray-900 mb-4">{generatedViz.title}</h5>

                {/* Simulación visual simple */}
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>Tipo:</strong> {generatedViz.type}
                    </p>
                    <p className="mt-2">
                      <strong>Campos:</strong>
                    </p>
                    <ul className="list-disc list-inside ml-4 mt-1">
                      {generatedViz.dataBindings.map((binding, idx) => (
                        <li key={idx}>
                          {binding.field} ({binding.table})
                          {binding.aggregation && ` - ${binding.aggregation}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4">
              <button
                onClick={() => setGeneratedViz(null)}
                disabled={isApplying}
                className="btn-outline flex-1"
              >
                Rechazar
              </button>
              <button
                onClick={handleApplyVisualization}
                disabled={isApplying}
                className="btn-primary flex-1"
              >
                {isApplying ? 'Aplicando...' : 'Aplicar Gráfico'}
              </button>
            </div>
          </div>
        )}

        {/* Mensaje de éxito */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}
      </div>
    </div>
  );
};
