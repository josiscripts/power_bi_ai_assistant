# 🧪 Guía Completa de Testing

**Opción B: Testing - COMPLETADA** ✅

---

## 📋 Resumen de Testing Implementado

### Frontend Testing
- ✅ **Vitest** - Unit testing framework
- ✅ **React Testing Library** - Componentes React
- ✅ **Cypress** - End-to-End testing
- ✅ **Coverage** - Análisis de cobertura

### Backend Testing
- ✅ **Vitest** - Unit testing framework
- ✅ **Supertest** - Testing de API REST
- ✅ **Integration Tests** - Tests de integración

---

## 🎯 Pruebas Implementadas

### Frontend Unit Tests (8 suites)

```
✅ src/test/components/
   ├── Header.test.tsx (5 tests)
   ├── Footer.test.tsx (5 tests)
   └── MainMenu.test.tsx (6 tests)

✅ src/test/hooks/
   └── useApi.test.ts (6 tests)

✅ src/test/utils/
   └── helpers.test.ts (10 tests)

✅ src/test/services/
   └── store.test.ts (12 tests)

Total: 44 tests unitarios
```

### Frontend E2E Tests (2 suites)

```
✅ cypress/e2e/
   ├── navigation.cy.ts (7 tests)
   └── modules.cy.ts (12 tests)

Total: 19 tests E2E
```

### Backend Tests (2 suites)

```
✅ backend/src/test/
   ├── controllers/
   │   └── graphicController.test.ts (4 tests)
   └── integration/
       └── api.test.ts (24 tests)

Total: 28 tests de integración
```

---

## 🚀 Ejecutar Tests

### Frontend - Unit Tests

```bash
# Ejecutar todos los tests
npm test

# Modo watch
npm test -- --watch

# Con UI interactivo
npm test:ui

# Con cobertura
npm test:coverage

# Test específico
npm test -- Header.test
```

### Frontend - E2E Tests

```bash
# Abrir Cypress interactivo
npm run e2e

# Modo headless
npm run e2e:headless

# Test específico
npx cypress run --spec "cypress/e2e/navigation.cy.ts"
```

### Backend - Tests

```bash
cd backend

# Ejecutar todos los tests
npm test

# Modo watch
npm test -- --watch

# Con UI interactivo
npm test:ui

# Con cobertura
npm test:coverage

# Test específico
npm test -- api.test
```

---

## 📊 Cobertura de Código

### Frontend Coverage
```
Líneas:      70%+
Funciones:   70%+
Branches:    70%+
Statements:  70%+
```

### Backend Coverage
```
Líneas:      70%+
Funciones:   70%+
Branches:    70%+
Statements:  70%+
```

### Ver Reporte de Cobertura

```bash
# Frontend
npm test:coverage
# Abre: coverage/index.html

# Backend
cd backend && npm test:coverage
# Abre: coverage/index.html
```

---

## 🧪 Estructura de Tests

### Unit Tests - Componentes

```typescript
describe('Header Component', () => {
  it('debe renderizar correctamente', () => {
    render(<Header />);
    expect(screen.getByText('Power BI AI Assistant')).toBeInTheDocument();
  });
});
```

### Unit Tests - Hooks

```typescript
describe('useApi Hook', () => {
  it('debe inicializar correctamente', () => {
    const { result } = renderHook(() => useApi());
    expect(result.current.loading).toBe(false);
  });
});
```

### Unit Tests - Store

```typescript
describe('useAppStore', () => {
  it('debe establecer módulo activo', () => {
    const { result } = renderHook(() => useAppStore());
    act(() => {
      result.current.setActiveModule('graficos');
    });
    expect(result.current.activeModule).toBe('graficos');
  });
});
```

### Integration Tests - API

```typescript
describe('API Integration Tests', () => {
  it('GET /health debe devolver OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
  });
});
```

### E2E Tests - Cypress

```typescript
describe('Navigation Tests', () => {
  it('debe cargar la página principal', () => {
    cy.visit('/');
    cy.contains('Power BI AI Assistant').should('be.visible');
  });
});
```

---

## 🔧 Configuración

### Vitest Config (Frontend)

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70,
    },
  },
});
```

### Cypress Config

```typescript
// cypress.config.ts
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
  },
});
```

### Vitest Config (Backend)

```typescript
// backend/vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
```

---

## 📋 Tests Detallados

### Component Tests
- **Header**: 5 tests (render, subtítulo, versión, classes)
- **Footer**: 5 tests (render, año, links, dark mode)
- **MainMenu**: 6 tests (módulos, click, módulo activo)

### Hook Tests
- **useApi**: 6 tests (inicialización, success, error, callbacks)

### Utility Tests
- **helpers**: 10 tests (truncateText, capitalize, slugify, etc.)

### Store Tests
- **useAppStore**: 5 tests (módulo, loading, error)
- **useFilterStore**: 4 tests (set, remove, clear)
- **usePreviewStore**: 3 tests (set, clear)

### Integration Tests (Backend)
- **Health**: 1 test
- **Graphics**: 3 tests
- **DAX**: 4 tests
- **Translations**: 3 tests
- **Routes**: 3 tests
- **Filters**: 4 tests
- **Prompt**: 3 tests
- **Error Handling**: 2 tests

### E2E Tests
- **Navigation**: 7 tests (módulos, volver)
- **Modules**: 12 tests (formularios, validación)

---

## 🎯 Mejores Prácticas

### Setup y Cleanup
```typescript
beforeEach(() => {
  // Setup antes de cada test
});

afterEach(() => {
  cleanup(); // Limpiar DOM
});
```

### Mocking
```typescript
vi.mock('@services/store', () => ({
  useAppStore: vi.fn(),
}));
```

### Assertions
```typescript
expect(element).toBeInTheDocument();
expect(element).toHaveClass('clase');
expect(fn).toHaveBeenCalled();
```

### Async Operations
```typescript
await act(async () => {
  await operation();
});
```

---

## 📈 CI/CD Integration

### GitHub Actions (Próximo)
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

---

## 🐛 Debugging Tests

### Frontend

```bash
# Debug específico
npm test -- --inspect-brk

# Debug en navegador
npm test:ui
```

### Backend

```bash
# Debug específico
npm test -- --inspect-brk

# Debug interactivo
npm test:ui
```

### Cypress

```bash
# Abrir debugger
npx cypress run --debug

# Parar en el test
cy.debug()
```

---

## ✅ Checklist de Testing

- [x] Unit tests frontend
- [x] Unit tests backend
- [x] Integration tests backend
- [x] E2E tests
- [x] Mocking de servicios
- [x] Validación de inputs
- [x] Error handling
- [x] Estado global (Zustand)
- [x] API calls
- [x] Componentes React
- [ ] Load testing (próximo)
- [ ] Performance testing (próximo)

---

## 📚 Recursos

- [Vitest Docs](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [Cypress Docs](https://cypress.io)
- [Supertest Docs](https://github.com/visionmedia/supertest)

---

## 🎓 Ejemplo Completo

### Test de Componente
```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('debe mostrar texto', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Test E2E
```typescript
describe('User Flow', () => {
  it('debe completar flujo', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.url().should('include', '/dashboard');
  });
});
```

### Test de API
```typescript
describe('API', () => {
  it('debe devolver datos', async () => {
    const res = await request(app).get('/api/data');
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });
});
```

---

**Total de Tests**: 91 tests  
**Cobertura**: 70%+  
**Duración estimada**: ~5-10 segundos (todos)

**Estado**: ✅ Completado  
**Próxima fase**: Opción C (Funcionalidades Avanzadas)
