import React, { useState } from 'react';

interface PBIPVisualization {
  name: string;
  type: string;
  title: string;
}

interface GraphicRemoverProps {
  visualizations: PBIPVisualization[];
  filePath: string;
  onVisualizationRemoved?: () => void;
}

export const GraphicRemover: React.FC<GraphicRemoverProps> = ({
  visualizations,
  filePath,
  onVisualizationRemoved,
}) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [selectedViz, setSelectedViz] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRemoveVisualization = async (vizName: string) => {
    setIsRemoving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:3000/api/pbip/remove-visualization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath,
          visualizationName: vizName,
        }),
      });

      const data = await response.json() as { success: boolean; error?: string };

      if (data.success) {
        setSuccess('Gráfico eliminado exitosamente');
        setConfirmDelete(false);
        setSelectedViz(null);
        onVisualizationRemoved?.();
      } else {
        setError(data.error || 'Error al eliminar gráfico');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar gráfico');
    } finally {
      setIsRemoving(false);
    }
  };

  if (visualizations.length === 0) {
    return (
      <div className="card">
        <p className="text-gray-600 text-center py-8">No hay gráficos para eliminar</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-900 mb-6">❌ Eliminar Gráficos</h3>

      <div className="space-y-4">
        {visualizations.map((viz) => (
          <div
            key={viz.name}
            className={`border rounded-lg p-4 transition ${
              selectedViz === viz.name
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{viz.title}</p>
                <p className="text-sm text-gray-600">{viz.type}</p>
              </div>

              {selectedViz === viz.name && confirmDelete ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedViz(null);
                      setConfirmDelete(false);
                    }}
                    disabled={isRemoving}
                    className="btn-outline px-4 py-2 text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleRemoveVisualization(viz.name)}
                    disabled={isRemoving}
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    {isRemoving ? 'Eliminando...' : 'Confirmar'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectedViz(viz.name);
                    setConfirmDelete(true);
                  }}
                  className="text-red-600 hover:text-red-700 font-bold px-4 py-2"
                >
                  Eliminar
                </button>
              )}
            </div>

            {selectedViz === viz.name && confirmDelete && (
              <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded text-sm text-red-800">
                ⚠️ ¿Estás seguro de que deseas eliminar "{viz.title}"? Esta acción no se puede deshacer.
              </div>
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
    </div>
  );
};
