describe('Navigation Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('debe cargar la página principal', () => {
    cy.contains('Power BI AI Assistant').should('be.visible');
    cy.contains('¿Qué deseas hacer?').should('be.visible');
  });

  it('debe mostrar los 5 módulos', () => {
    cy.contains('Diseño de Gráficos').should('be.visible');
    cy.contains('Medidas DAX').should('be.visible');
    cy.contains('Traducciones').should('be.visible');
    cy.contains('Rutas Dinámicas').should('be.visible');
    cy.contains('Filtros Avanzados').should('be.visible');
  });

  it('debe navegar al módulo de gráficos', () => {
    cy.contains('Diseño de Gráficos').click();
    cy.contains('Configuración').should('be.visible');
    cy.contains('Describe tu gráfico').should('be.visible');
  });

  it('debe navegar al módulo de DAX', () => {
    cy.contains('Medidas DAX').click();
    cy.contains('Nueva Medida').should('be.visible');
  });

  it('debe navegar al módulo de traducciones', () => {
    cy.contains('Traducciones').click();
    cy.contains('Crear Traducción').should('be.visible');
  });

  it('debe navegar al módulo de rutas', () => {
    cy.contains('Rutas Dinámicas').click();
    cy.contains('Configuración de Ruta').should('be.visible');
  });

  it('debe navegar al módulo de filtros', () => {
    cy.contains('Filtros Avanzados').click();
    cy.contains('Nuevo Filtro').should('be.visible');
  });

  it('debe volver al menú principal', () => {
    cy.contains('Diseño de Gráficos').click();
    cy.contains('← Volver al menú').click();
    cy.contains('¿Qué deseas hacer?').should('be.visible');
  });

  it('debe tener header y footer', () => {
    cy.get('header').should('be.visible');
    cy.get('footer').should('be.visible');
  });
});
