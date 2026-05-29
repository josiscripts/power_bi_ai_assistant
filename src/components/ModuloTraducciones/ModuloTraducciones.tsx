import React, { useState } from 'react';
import { useAppStore } from '@services/store';
import api from '@services/api';
import type { Translation } from '../../types';

const IDIOMAS = ['es', 'en', 'pt', 'fr', 'zh', 'ja'];
const IDIOMA_LABELS: Record<string, string> = {
  es: 'Español',
  en: 'Inglés',
  pt: 'Portugués',
  fr: 'Francés',
  zh: 'Chino',
  ja: 'Japonés',
};

export const ModuloTraducciones: React.FC = () => {
  const [clave, setClave] = useState('');
  const [selectedIdiomas, setSelectedIdiomas] = useState<string[]>(['es', 'en']);
  const [traducciones, setTraducciones] = useState<Record<string, string>>({});
  const [generatedTranslations, setGeneratedTranslations] = useState<Translation[]>([]);
  const { setLoading, isLoading, setError, error } = useAppStore();

  const toggleIdioma = (idioma: string) => {
    setSelectedIdiomas((prev) =>
      prev.includes(idioma) ? prev.filter((i) => i !== idioma) : [...prev, idioma]
    );
  };

  const handleTranslationChange = (idioma: string, valor: string) => {
    setTraducciones((prev) => ({ ...prev, [idioma]: valor }));
  };

  const handleGenerateTranslations = async () => {
    if (!clave.trim()) {
      setError('Por favor ingresa una clave de traducción');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.generateTranslations(clave, selectedIdiomas);
      if (response.data) {
        setTraducciones(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar traducciones');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyTranslations = async () => {
    if (!clave.trim() || Object.keys(traducciones).length === 0) {
      setError('Por favor completa las traducciones');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: Translation = {
        clave,
        es: traducciones['es'] || '',
        en: traducciones['en'] || '',
        pt: traducciones['pt'] || '',
        fr: traducciones['fr'] || '',
        zh: traducciones['zh'] || '',
        ja: traducciones['ja'] || '',
      };

      const response = await api.applyTranslations(payload);
      if (response.success) {
        setGeneratedTranslations([...generatedTranslations, payload]);
        setClave('');
        setTraducciones({});
        setSelectedIdiomas(['es', 'en']);
      } else {
        setError(response.error || 'Error al aplicar traducciones');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al aplicar traducciones');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Traducciones Multiidioma</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel Izquierdo */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Crear Traducción</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Clave de Traducción
                </label>
                <input
                  type="text"
                  value={clave}
                  onChange={(e) => setClave(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                  placeholder="ej: titulo_bienvenida"
                  className="input"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Selecciona Idiomas
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {IDIOMAS.map((idioma) => (
                    <label key={idioma} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedIdiomas.includes(idioma)}
                        onChange={() => toggleIdioma(idioma)}
                        disabled={isLoading}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm">{IDIOMA_LABELS[idioma]}</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-error-50 border border-error-200 text-error-700 px-3 py-2 rounded text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerateTranslations}
                disabled={isLoading || !clave.trim() || selectedIdiomas.length === 0}
                className="btn-primary w-full"
              >
                {isLoading ? 'Generando...' : 'Generar Traducciones'}
              </button>
            </div>
          </div>
        </div>

        {/* Panel Centro: Traducciones */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Traducciones</h3>

            {clave && selectedIdiomas.length > 0 ? (
              <div className="space-y-4 mb-6">
                {selectedIdiomas.map((idioma) => (
                  <div key={idioma}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {IDIOMA_LABELS[idioma]}
                    </label>
                    <textarea
                      value={traducciones[idioma] || ''}
                      onChange={(e) => handleTranslationChange(idioma, e.target.value)}
                      placeholder={`Ingresa el texto en ${IDIOMA_LABELS[idioma]}`}
                      className="input h-20 resize-none"
                      disabled={isLoading}
                    />
                  </div>
                ))}

                <button
                  onClick={handleApplyTranslations}
                  disabled={
                    isLoading ||
                    !clave.trim() ||
                    Object.values(traducciones).some((t) => !t.trim())
                  }
                  className="btn-primary w-full"
                >
                  {isLoading ? 'Aplicando...' : 'Aplicar Traducciones'}
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Completa la clave y selecciona idiomas</p>
              </div>
            )}

            {/* Historial */}
            {generatedTranslations.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Traducciones Aplicadas</h4>
                <div className="space-y-3">
                  {generatedTranslations.map((t, idx) => (
                    <div key={idx} className="bg-success-50 border border-success-200 rounded-lg p-3">
                      <p className="font-semibold text-success-900">{t.clave}</p>
                      <p className="text-sm text-success-700">✓ Aplicada exitosamente</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
