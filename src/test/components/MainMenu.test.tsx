import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MainMenu } from '@components/Common/MainMenu';
import { useAppStore } from '@services/store';

// Mock del store
vi.mock('@services/store', () => ({
  useAppStore: vi.fn(),
}));

describe('MainMenu Component', () => {
  beforeEach(() => {
    (useAppStore as any).mockReturnValue({
      activeModule: null,
      setActiveModule: vi.fn(),
    });
  });

  it('debe renderizar correctamente', () => {
    render(<MainMenu />);
    expect(screen.getByText('¿Qué deseas hacer?')).toBeInTheDocument();
  });

  it('debe mostrar 5 módulos', () => {
    render(<MainMenu />);
    expect(screen.getByText('Diseño de Gráficos')).toBeInTheDocument();
    expect(screen.getByText('Medidas DAX')).toBeInTheDocument();
    expect(screen.getByText('Traducciones')).toBeInTheDocument();
    expect(screen.getByText('Rutas Dinámicas')).toBeInTheDocument();
    expect(screen.getByText('Filtros Avanzados')).toBeInTheDocument();
  });

  it('debe mostrar descripciones de módulos', () => {
    render(<MainMenu />);
    expect(screen.getByText('Crea gráficos con IA')).toBeInTheDocument();
    expect(screen.getByText('Genera medidas DAX automáticamente')).toBeInTheDocument();
  });

  it('debe llamar setActiveModule al hacer click en un botón', () => {
    const mockSetActiveModule = vi.fn();
    (useAppStore as any).mockReturnValue({
      activeModule: null,
      setActiveModule: mockSetActiveModule,
    });

    render(<MainMenu />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);

    expect(mockSetActiveModule).toHaveBeenCalled();
  });

  it('debe mostrar botón de volver cuando hay módulo activo', () => {
    (useAppStore as any).mockReturnValue({
      activeModule: 'graficos',
      setActiveModule: vi.fn(),
    });

    render(<MainMenu />);
    expect(screen.getByText('← Volver al menú')).toBeInTheDocument();
  });

  it('no debe mostrar botón de volver cuando no hay módulo activo', () => {
    (useAppStore as any).mockReturnValue({
      activeModule: null,
      setActiveModule: vi.fn(),
    });

    render(<MainMenu />);
    expect(screen.queryByText('← Volver al menú')).not.toBeInTheDocument();
  });
});
