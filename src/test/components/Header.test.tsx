import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '@components/Common/Header';

describe('Header Component', () => {
  it('debe renderizar correctamente', () => {
    render(<Header />);
    expect(screen.getByText('Power BI AI Assistant')).toBeInTheDocument();
  });

  it('debe mostrar el subtítulo', () => {
    render(<Header />);
    expect(screen.getByText('Diseña gráficos, medidas y más con IA')).toBeInTheDocument();
  });

  it('debe mostrar la versión', () => {
    render(<Header />);
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
  });

  it('debe tener clase de gradiente', () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('bg-gradient-to-r');
  });

  it('debe tener fondo azul', () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('from-primary-600');
    expect(header).toHaveClass('to-primary-700');
  });
});
