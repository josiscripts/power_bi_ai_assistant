import React from 'react';
import { useAppStore } from '@services/store';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';
import { MainMenu } from '@components/Common/MainMenu';
import { ModuloDisenoGraficos } from '@components/ModuloDisenoGraficos/ModuloDisenoGraficos';
import { ModuloMedidasDAX } from '@components/ModuloMedidasDAX/ModuloMedidasDAX';
import { ModuloTraducciones } from '@components/ModuloTraducciones/ModuloTraducciones';
import { ModuloRutasDinamicas } from '@components/ModuloRutasDinamicas/ModuloRutasDinamicas';
import { ModuloFiltros } from '@components/ModuloFiltros/ModuloFiltros';
import { ModuloAnalisisPBIX } from '@components/ModuloAnalisisPBIX/ModuloAnalisisPBIX';
import { DataExplorer } from '@components/DataExplorer/DataExplorer';

export const App: React.FC = () => {
  const { activeModule } = useAppStore();

  const renderModule = () => {
    switch (activeModule) {
      case 'pbix':
        return <ModuloAnalisisPBIX />;
      case 'data':
        return <DataExplorer />;
      case 'graficos':
        return <ModuloDisenoGraficos />;
      case 'dax':
        return <ModuloMedidasDAX />;
      case 'traducciones':
        return <ModuloTraducciones />;
      case 'rutas':
        return <ModuloRutasDinamicas />;
      case 'filtros':
        return <ModuloFiltros />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />

      <main className="flex-1 py-8 dark:bg-gray-900">
        {renderModule()}
      </main>

      <Footer />
    </div>
  );
};
