import React, { useState } from 'react';

interface TranslationResult {
  idioma: string;
  texto: string;
  confianza: number;
}

interface AutoTranslatorProps {
  textoOriginal?: string;
  onTranslate?: (results: TranslationResult[]) => void;
}

const IDIOMAS_DISPONIBLES = [
  { código: 'es', nombre: 'Español', bandera: '🇪🇸' },
  { código: 'en', nombre: 'Inglés', bandera: '🇬🇧' },
  { código: 'pt', nombre: 'Portugués', bandera: '🇧🇷' },
  { código: 'fr', nombre: 'Francés', bandera: '🇫🇷' },
  { código: 'de', nombre: 'Alemán', bandera: '🇩🇪' },
  { código: 'it', nombre: 'Italiano', bandera: '🇮🇹' },
  { código: 'ja', nombre: 'Japonés', bandera: '🇯🇵' },
  { código: 'zh', nombre: 'Chino', bandera: '🇨🇳' },
];

// Mock translations para demo
const MOCK_TRANSLATIONS: Record<string, Record<string, { texto: string; confianza: number }>> = {
  bienvenida: {
    es: { texto: 'Bienvenida', confianza: 100 },
    en: { texto: 'Welcome', confianza: 100 },
    pt: { texto: 'Bem-vindo', confianza: 98 },
    fr: { texto: 'Bienvenue', confianza: 100 },
    de: { texto: 'Willkommen', confianza: 99 },
    it: { texto: 'Benvenuto', confianza: 99 },
    ja: { texto: 'ようこそ', confianza: 95 },
    zh: { texto: '欢迎', confianza: 97 },
  },
};

export const AutoTranslator: React.FC<AutoTranslatorProps> = ({
  textoOriginal = 'bienvenida',
  onTranslate,
}) => {
  const [selectedText, setSelectedText] = useState(textoOriginal);
  const [selectedIdiomas, setSelectedIdiomas] = useState<string[]>(['es', 'en', 'pt']);
  const [translations, setTranslations] = useState<TranslationResult[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);

  const toggleIdioma = (codigo: string) => {
    setSelectedIdiomas((prev) =>
      prev.includes(codigo) ? prev.filter((c) => c !== codigo) : [...prev, codigo]
    );
  };

  const handleTranslate = async () => {
    setIsTranslating(true);

    // Simular traducción con mock data
    const results: TranslationResult[] = selectedIdiomas.map((idioma) => {
      const mockData = MOCK_TRANSLATIONS[selectedText.toLowerCase()]?.[idioma];
      return {
        idioma,
        texto: mockData?.texto || selectedText,
        confianza: mockData?.confianza || Math.floor(Math.random() * 20 + 80),
      };
    });

    await new Promise((resolve) => setTimeout(resolve, 800));

    setTranslations(results);
    onTranslate?.(results);
    setIsTranslating(false);
  };

  const handleCopyAll = () => {
    const texto = translations
      .map((t) => `${t.idioma.toUpperCase()}: ${t.texto}`)
      .join('\n');
    navigator.clipboard.writeText(texto);
  };

  return (
    <div className="space-y-6">
      {/* Entrada */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Texto a traducir
        </label>
        <textarea
          value={selectedText}
          onChange={(e) => setSelectedText(e.target.value)}
          placeholder="Ingresa el texto que deseas traducir..."
          className="input h-24"
          disabled={isTranslating}
        />
      </div>

      {/* Selector de idiomas */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Idiomas de destino
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {IDIOMAS_DISPONIBLES.map((idioma) => (
            <button
              key={idioma.código}
              onClick={() => toggleIdioma(idioma.código)}
              className={`p-3 rounded-lg transition text-sm font-medium ${
                selectedIdiomas.includes(idioma.código)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {idioma.bandera} {idioma.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Botón traducir */}
      <button
        onClick={handleTranslate}
        disabled={isTranslating || selectedIdiomas.length === 0}
        className="btn-primary w-full"
      >
        {isTranslating ? 'Traduciendo...' : 'Traducir'}
      </button>

      {/* Resultados */}
      {translations.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Traducciones</h3>
            <button onClick={handleCopyAll} className="btn-outline text-sm">
              Copiar todas
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {translations.map((translation) => {
              const idioma = IDIOMAS_DISPONIBLES.find(
                (i) => i.código === translation.idioma
              );
              return (
                <div key={translation.idioma} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">
                      {idioma?.bandera} {idioma?.nombre}
                    </span>
                    <span className="text-xs text-gray-500">
                      {translation.confianza}% confianza
                    </span>
                  </div>

                  <div className="bg-white rounded p-3 mb-2">
                    <p className="text-gray-900 font-medium">{translation.texto}</p>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition"
                      style={{ width: `${translation.confianza}%` }}
                    />
                  </div>

                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(translation.texto)
                    }
                    className="mt-2 btn-ghost text-sm w-full"
                  >
                    Copiar
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats */}
      {translations.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total traducido</p>
              <p className="text-2xl font-bold text-blue-600">
                {translations.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Confianza promedio</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(
                  translations.reduce((a, b) => a + b.confianza, 0) /
                    translations.length
                )}
                %
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Caracteres</p>
              <p className="text-2xl font-bold text-blue-600">
                {selectedText.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
