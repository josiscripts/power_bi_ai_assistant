import React, { useState } from 'react';
import type { RelationshipAction } from '../../types';

interface AutoRepairWizardProps {
  filePath: string;
  onClose: () => void;
  onSuccess?: (newFilePath: string) => void;
}

type WizardStep = 'analyzing' | 'review' | 'customize' | 'repairing' | 'success' | 'error';

export const AutoRepairWizard: React.FC<AutoRepairWizardProps> = ({ filePath, onClose, onSuccess }) => {
  const [step, setStep] = useState<WizardStep>('analyzing');
  const [actions, setActions] = useState<RelationshipAction[]>([]);
  const [selectedActions, setSelectedActions] = useState<Set<number>>(new Set());
  const [repairPath, setRepairPath] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Pantalla 1: Analizando relaciones
  const analyzeRelationships = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/pbip/analyze-relationships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath }),
      });

      const data = (await response.json()) as { success: boolean; data?: { actions: RelationshipAction[] }; error?: string };

      if (data.success && data.data?.actions) {
        setActions(data.data.actions);
        // Pre-seleccionar todas las acciones
        setSelectedActions(new Set(Array.from({ length: data.data.actions.length }, (_, i) => i)));
        setStep('review');
      } else {
        setError(data.error || 'Error analizando relaciones');
        setStep('error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en conexión');
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Pantalla 2: Review de acciones
  const handleReviewActionClick = () => {
    if (actions.length === 0) {
      // Sin relaciones para reparar
      setError('No se detectaron relaciones faltantes');
      setStep('error');
    } else {
      setStep('customize');
    }
  };

  // Pantalla 3: Personalización de acciones
  const toggleAction = (index: number) => {
    const newSelected = new Set(selectedActions);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedActions(newSelected);
  };

  // Pantalla 4: Reparar archivo
  const performRepair = async () => {
    setIsLoading(true);
    setStep('repairing');

    try {
      const actionsToApply = actions.filter((_, idx) => selectedActions.has(idx));

      const response = await fetch('http://localhost:3000/api/pbip/auto-repair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath, actions: actionsToApply }),
      });

      const data = (await response.json()) as { success: boolean; data?: { repairPath: string }; error?: string };

      if (data.success && data.data?.repairPath) {
        setRepairPath(data.data.repairPath);
        setStep('success');
      } else {
        setError(data.error || 'Error reparando archivo');
        setStep('error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en conexión');
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Descargar archivo reparado
  const downloadRepaired = () => {
    window.location.href = `http://localhost:3000/api/pbip/download-repaired?filePath=${encodeURIComponent(repairPath)}`;
    if (onSuccess) {
      onSuccess(repairPath);
    }
    setTimeout(onClose, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Pantalla 1: Analizando */}
        {step === 'analyzing' && (
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analizando relaciones...</h3>
            <p className="text-gray-600 mb-6">Inspecciones las tablas y muestras de datos para detectar relaciones faltantes.</p>
            <button
              onClick={analyzeRelationships}
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Analizando...' : 'Iniciar Análisis'}
            </button>
          </div>
        )}

        {/* Pantalla 2: Review */}
        {step === 'review' && (
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              ✅ Relaciones Detectadas ({actions.length})
            </h3>

            {actions.length === 0 ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-blue-800">No se detectaron relaciones faltantes en el archivo.</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                  {actions.map((action, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {action.type === 'RELACIONAR' && <span className="text-blue-600 text-xl">🔗</span>}
                          {action.type === 'COMBINAR' && <span className="text-purple-600 text-xl">⚙️</span>}
                          {action.type === 'ANEXAR' && <span className="text-green-600 text-xl">📚</span>}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {action.type === 'RELACIONAR' && 'Crear Relación'}
                            {action.type === 'COMBINAR' && 'Combinar Datos'}
                            {action.type === 'ANEXAR' && 'Anexar Filas'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {action.fromTable}.{action.fromColumn} → {action.toTable}.{action.toColumn}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{action.rationale}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={onClose}
                    className="btn-outline flex-1"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleReviewActionClick}
                    className="btn-primary flex-1"
                  >
                    Personalizar
                  </button>
                  <button
                    onClick={performRepair}
                    className="btn-primary flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Aplicar Todas
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Pantalla 3: Personalizar */}
        {step === 'customize' && (
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Seleccionar Acciones</h3>

            <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
              {actions.map((action, idx) => (
                <label key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selectedActions.has(idx)}
                    onChange={() => toggleAction(idx)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {action.type === 'RELACIONAR' && '🔗 Relacionar'}
                      {action.type === 'COMBINAR' && '⚙️ Combinar'}
                      {action.type === 'ANEXAR' && '📚 Anexar'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {action.fromTable}.{action.fromColumn} → {action.toTable}.{action.toColumn}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep('review')}
                className="btn-outline flex-1"
              >
                Atrás
              </button>
              <button
                onClick={performRepair}
                disabled={selectedActions.size === 0}
                className="btn-primary flex-1"
              >
                Reparar ({selectedActions.size} acciones)
              </button>
            </div>
          </div>
        )}

        {/* Pantalla 4: Reparando */}
        {step === 'repairing' && (
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Reparando archivo...</h3>
            <p className="text-gray-600">Aplicando relaciones detectadas. Por favor espera.</p>
          </div>
        )}

        {/* Pantalla 5: Éxito */}
        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="mb-6 text-6xl">✅</div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">¡Reparación Completada!</h3>
            <p className="text-gray-600 mb-6">El archivo ha sido reparado exitosamente con todas las relaciones detectadas.</p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                <strong>Archivo:</strong> {repairPath.split('/').pop()}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="btn-outline flex-1"
              >
                Cerrar
              </button>
              <button
                onClick={downloadRepaired}
                className="btn-primary flex-1 bg-green-600 hover:bg-green-700"
              >
                📥 Descargar Archivo
              </button>
            </div>
          </div>
        )}

        {/* Pantalla 6: Error */}
        {step === 'error' && (
          <div className="p-8 text-center">
            <div className="mb-6 text-6xl">⚠️</div>
            <h3 className="text-2xl font-bold text-red-600 mb-2">Error</h3>
            <p className="text-gray-600 mb-6">{error || 'Ocurrió un error inesperado'}</p>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="btn-outline flex-1"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setStep('analyzing');
                  setError('');
                  setActions([]);
                  setSelectedActions(new Set());
                }}
                className="btn-primary flex-1"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
