import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '@components/Common/Footer';

describe('Footer Component', () => {
  it('debe renderizar correctamente', () => {
    render(<Footer />);
    expect(screen.getByText(/Power BI AI Assistant/i)).toBeInTheDocument();
  });

  it('debe mostrar el año actual', () => {
    const currentYear = new Date().getFullYear();
    render(<Footer />);
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
  });

  it('debe contener enlaces de contacto', () => {
    render(<Footer />);
    const contactLinks = screen.queryAllByRole('link');
    expect(contactLinks.length).toBeGreaterThan(0);
  });

  it('debe tener fondo oscuro', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('bg-gray-900');
  });

  it('debe contener texto de copyright', () => {
    render(<Footer />);
    expect(screen.getByText(/Todos los derechos reservados/i)).toBeInTheDocument();
  });
});
