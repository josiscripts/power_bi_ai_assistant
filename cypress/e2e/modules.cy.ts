describe('Modules Functionality Tests', () => {
  describe('Módulo de Gráficos', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.contains('Diseño de Gráficos').click();
    });

    it('debe mostrar formulario de gráficos', () => {
      cy.contains('Describe tu gráfico').should('be.visible');
      cy.get('textarea').should('be.visible');
      cy.contains('Tipo de Gráfico').should('be.visible');
    });

    it('debe tener botón de generar vista previa', () => {
      cy.contains('Generar Vista Previa').should('exist');
    });

    it('debe validar entrada vacía', () => {
      cy.contains('Generar Vista Previa').click();
      cy.contains('Por favor ingresa un prompt').should('be.visible');
    });

    it('debe aceptar entrada de texto', () => {
      cy.get('textarea').type('Gráfico de barras con ventas');
      cy.get('textarea').should('have.value', 'Gráfico de barras con ventas');
    });

    it('debe cambiar tipo de gráfico', () => {
      cy.get('select').select('line');
      cy.get('select').should('have.value', 'line');
    });
  });

  describe('Módulo de DAX', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.contains('Medidas DAX').click();
    });

    it('debe mostrar panel de nueva medida', () => {
      cy.contains('Nueva Medida').should('be.visible');
      cy.contains('¿Qué medida necesitas?').should('be.visible');
    });

    it('debe tener botón generar DAX', () => {
      cy.contains('Generar DAX').should('exist');
    });
  });

  describe('Módulo de Traducciones', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.contains('Traducciones').click();
    });

    it('debe mostrar formulario de traducciones', () => {
      cy.contains('Clave de Traducción').should('be.visible');
      cy.contains('Selecciona Idiomas').should('be.visible');
    });

    it('debe permitir seleccionar idiomas', () => {
      cy.get('input[type="checkbox"]').first().click();
      cy.get('input[type="checkbox"]').first().should('be.checked');
    });

    it('debe mostrar generar traducciones', () => {
      cy.contains('Generar Traducciones').should('exist');
    });
  });

  describe('Módulo de Rutas', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.contains('Rutas Dinámicas').click();
    });

    it('debe mostrar configuración de ruta', () => {
      cy.contains('Páginas de la Ruta').should('be.visible');
      cy.contains('Separador').should('be.visible');
    });

    it('debe permitir agregar páginas', () => {
      cy.contains('Agregar página').should('exist');
    });
  });

  describe('Módulo de Filtros', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.contains('Filtros Avanzados').click();
    });

    it('debe mostrar panel de creación de filtros', () => {
      cy.contains('Nombre del Filtro').should('be.visible');
      cy.contains('Tipo de Filtro').should('be.visible');
    });

    it('debe tener botón crear filtro', () => {
      cy.contains('Crear Filtro').should('exist');
    });

    it('debe mostrar tipos de filtro disponibles', () => {
      cy.get('select').first().should('be.visible');
    });
  });
});
