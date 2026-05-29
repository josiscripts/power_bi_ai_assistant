import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Acerca de</h3>
            <p className="text-sm">
              Herramienta inteligente para diseñar gráficos, medidas DAX y filtros en Power BI
              usando inteligencia artificial.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Características</h3>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">
                  Diseño de Gráficos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Medidas DAX
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Traducciones
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="text-sm space-y-2">
              <li>
                <a href="mailto:support@powerbi-ai.com" className="hover:text-white transition">
                  support@powerbi-ai.com
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Documentación
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© {currentYear} Power BI AI Assistant. Todos los derechos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm hover:text-white transition">
                Privacidad
              </a>
              <a href="#" className="text-sm hover:text-white transition">
                Términos
              </a>
              <a href="#" className="text-sm hover:text-white transition">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
