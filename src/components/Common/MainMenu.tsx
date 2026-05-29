import React from 'react';
import { useAppStore } from '@services/store';

interface MenuItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  fromColor: string;
  toColor: string;
}

export const MainMenu: React.FC = () => {
  const { setActiveModule, activeModule } = useAppStore();

  const menuItems: MenuItem[] = [
    {
      id: 'pbix',
      label: 'Análisis de .pbix',
      description: 'Analiza tu archivo Power BI',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      ),
      fromColor: '#06b6d4',
      toColor: '#0891b2',
    },
    {
      id: 'graficos',
      label: 'Diseño de Gráficos',
      description: 'Crea gráficos con IA',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
        </svg>
      ),
      fromColor: '#3b82f6',
      toColor: '#2563eb',
    },
    {
      id: 'dax',
      label: 'Medidas DAX',
      description: 'Genera medidas DAX automáticamente',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54h2.86v2.14h-4.41v-2.14h2.75l-3.54-4.29h-2.75V7.42h4.41v2.14h-2.75l2.75 3.54 2.75-3.54h-2.86V7.42h4.41v2.14h-2.75z" />
        </svg>
      ),
      fromColor: '#a855f7',
      toColor: '#9333ea',
    },
    {
      id: 'traducciones',
      label: 'Traducciones',
      description: 'Crea traducciones multiidioma',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 3H17V0h-5.5v.92H3.5C1.6 0 0 1.6 0 3.5V12c0 1.9 1.6 3.5 3.5 3.5h5v-5h6.02l-.25 2.5z" />
        </svg>
      ),
      fromColor: '#10b981',
      toColor: '#059669',
    },
    {
      id: 'rutas',
      label: 'Rutas Dinámicas',
      description: 'Genera rutas de navegación',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 10.02C7.21 10.02 5 12.23 5 15.02c0 2.78 2.21 5 5 5s5-2.22 5-5c0-2.79-2.21-5-5-5zM16.6 5.02c1.16 0 2.1-1.04 2.1-2.1s-.94-2.1-2.1-2.1-2.1.94-2.1 2.1.94 2.1 2.1 2.1zM15.7 14.04c.77.22 1.6.07 2.25-.56.92-.92.92-2.45 0-3.37-.92-.92-2.45-.92-3.37 0-.63.65-.78 1.48-.56 2.25L14 17.62v1.38h1.38l2.58-2.58z" />
        </svg>
      ),
      fromColor: '#f97316',
      toColor: '#ea580c',
    },
    {
      id: 'filtros',
      label: 'Filtros Avanzados',
      description: 'Diseña filtros interactivos',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        </svg>
      ),
      fromColor: '#ef4444',
      toColor: '#dc2626',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">¿Qué deseas hacer?</h2>
        <p className="text-gray-600">Selecciona el módulo que necesitas para comenzar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveModule(item.id)}
            className={`relative overflow-hidden rounded-xl p-6 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
              activeModule === item.id ? 'ring-2 ring-offset-2 ring-white' : ''
            }`}
            style={{
              background: `linear-gradient(135deg, ${item.fromColor}, ${item.toColor})`,
            } as React.CSSProperties}
          >
            <div className="relative z-10">
              <div className="mb-4 flex justify-center">{item.icon}</div>
              <h3 className="font-bold text-center text-lg mb-2">{item.label}</h3>
              <p className="text-sm text-center opacity-90">{item.description}</p>
            </div>

            <div className="absolute inset-0 opacity-0 hover:opacity-10 bg-white transition-opacity duration-300" />
          </button>
        ))}
      </div>

      {activeModule && (
        <div className="mt-8">
          <button
            onClick={() => setActiveModule(null)}
            className="btn-ghost"
          >
            ← Volver al menú
          </button>
        </div>
      )}
    </div>
  );
};
