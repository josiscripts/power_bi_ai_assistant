# Guía de Desarrollo

Esta guía describe cómo trabajar con el proyecto Power BI AI Assistant.

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
src/
├── components/
│   ├── Common/                      # Componentes reutilizables
│   │   ├── Header.tsx              # Encabezado de la app
│   │   ├── Footer.tsx              # Pie de página
│   │   └── MainMenu.tsx            # Menú principal
│   ├── ModuloDisenoGraficos/       # Módulo 1: Gráficos
│   │   └── ModuloDisenoGraficos.tsx
│   ├── ModuloMedidasDAX/           # Módulo 2: Medidas DAX
│   │   └── ModuloMedidasDAX.tsx
│   ├── ModuloTraducciones/         # Módulo 3: Traducciones
│   │   └── ModuloTraducciones.tsx
│   ├── ModuloRutasDinamicas/       # Módulo 4: Rutas
│   │   └── ModuloRutasDinamicas.tsx
│   └── ModuloFiltros/              # Módulo 5: Filtros
│       └── ModuloFiltros.tsx
├── services/
│   ├── api.ts                      # Cliente Axios
│   └── store.ts                    # Estado global (Zustand)
├── types/
│   └── index.ts                    # Tipos TypeScript
├── hooks/
│   └── useApi.ts                   # Hook personalizado para API
├── constants/
│   └── index.ts                    # Constantes de la app
├── config/
│   └── index.ts                    # Configuración
├── utils/
│   └── helpers.ts                  # Funciones de utilidad
├── styles/
│   └── global.css                  # Estilos globales
├── App.tsx                         # Componente principal
└── main.tsx                        # Punto de entrada
```

## 🎯 Flujo de Datos

```
Usuario Input
    ↓
Componente React
    ↓
Hook (useApi) o Store (Zustand)
    ↓
Servicio (api.ts)
    ↓
Axios Request
    ↓
Backend API
    ↓
Response
    ↓
Store actualizado
    ↓
Component Re-render
```

## 🔧 Guía de Desarrollo

### Crear un Nuevo Componente

1. **Crear el archivo en la carpeta correspondiente:**
```tsx
// src/components/Common/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onAction,
}) => {
  return (
    <div className="card">
      <h2 className="text-lg font-bold">{title}</h2>
      {onAction && (
        <button onClick={onAction} className="btn-primary">
          Acción
        </button>
      )}
    </div>
  );
};
```

### Usar Zustand Store

```tsx
import { useAppStore } from '@services/store';

export const MyComponent: React.FC = () => {
  const { activeModule, setActiveModule, isLoading } = useAppStore();

  return (
    <div>
      <p>Módulo activo: {activeModule}</p>
      <button onClick={() => setActiveModule('graficos')}>
        Cambiar módulo
      </button>
    </div>
  );
};
```

### Usar el Hook useApi

```tsx
import { useApi } from '@hooks/useApi';

export const MyComponent: React.FC = () => {
  const { generateDAX, loading, error, data } = useApi({
    onSuccess: (data) => console.log('Success!', data),
    onError: (error) => console.log('Error!', error),
  });

  const handleGenerate = async () => {
    try {
      await generateDAX('Suma total de ventas', {});
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generando...' : 'Generar DAX'}
      </button>
      {error && <p className="text-error-600">{error}</p>}
    </div>
  );
};
```

## 🎨 Sistema de Estilos

### Tailwind CSS Classes

El proyecto incluye componentes Tailwind reutilizables:

```tsx
// Botones
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>
<button className="btn-outline">Outline</button>
<button className="btn-ghost">Ghost</button>

// Tarjetas
<div className="card">
  <h3>Contenido</h3>
</div>

// Inputs
<input className="input" placeholder="Escribe aquí" />

// Badges
<span className="badge-primary">Primary</span>
<span className="badge-success">Success</span>
<span className="badge-warning">Warning</span>
<span className="badge-error">Error</span>
```

### Colores Personalizados

```tsx
// Primary (Azul)
<div className="bg-primary-600 text-white">Primary</div>

// Secondary (Púrpura)
<div className="bg-secondary-600 text-white">Secondary</div>

// Success (Verde)
<div className="bg-success-600 text-white">Success</div>

// Warning (Amarillo)
<div className="bg-warning-600 text-white">Warning</div>

// Error (Rojo)
<div className="bg-error-600 text-white">Error</div>
```

## 🚀 Agregar Nuevas Características

### 1. Agregar un Nuevo Endpoint API

En `src/services/api.ts`:
```typescript
async myNewEndpoint(data: any): Promise<any> {
  try {
    const response = await this.api.post('/my-endpoint', data);
    return response.data;
  } catch (error) {
    throw error;
  }
}
```

### 2. Agregar un Nuevo Store

En `src/services/store.ts`:
```typescript
interface MyStore {
  myValue: string;
  setMyValue: (value: string) => void;
}

export const useMyStore = create<MyStore>((set) => ({
  myValue: '',
  setMyValue: (value) => set({ myValue: value }),
}));
```

### 3. Agregar un Nuevo Tipo

En `src/types/index.ts`:
```typescript
export interface MyType {
  id: string;
  name: string;
}
```

## 📋 Checklist de Desarrollo

- [ ] Componente creado
- [ ] TypeScript types definidos
- [ ] Estilos Tailwind aplicados
- [ ] Linting pasado (`npm run lint`)
- [ ] Type checking pasado (`npm run type-check`)
- [ ] Documentado en comments si es necesario
- [ ] Testeado manualmente
- [ ] Responsive design verificado

## 🔍 Debugging

### Habilitar Logs

```typescript
// En src/config/index.ts
const isDevelopment = config.app.environment === 'development';

if (isDevelopment) {
  console.log('Debug info:', data);
}
```

### React DevTools

Instala la extensión de React DevTools en tu navegador para inspeccionar:
- Componentes
- Props
- State
- Performance

### Zustand DevTools

En desarrollo, puedes inspeccionar el estado con:
```typescript
import { devtools } from 'zustand/middleware';

export const useAppStore = create<AppStore>(
  devtools((set) => ({
    // ... store definition
  }), { name: 'AppStore' })
);
```

## 📚 Recursos Útiles

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Vite Documentation](https://vitejs.dev)

## 🤝 Buenas Prácticas

1. **Componentes Pequeños**: Divide en componentes reutilizables
2. **Props Clara**: Define interfaces clara para props
3. **Error Handling**: Siempre maneja errores en API calls
4. **Loading States**: Muestra estado de carga mientras esperas
5. **Responsive Design**: Prueba en mobile, tablet y desktop
6. **Accesibilidad**: Usa labels, semantic HTML, etc.
7. **Performance**: Usa useCallback para funciones que se pasan como props

## 🐛 Troubleshooting

### Error: "Module not found"
```bash
npm install
npm run dev
```

### Error de TypeScript
```bash
npm run type-check
# Verifica los errores y corrige
```

### Estilos no se aplican
- Verifica que uses `className` no `class`
- Asegúrate que Tailwind esté configurado en `tailwind.config.js`
- Limpia cache: `npm run build` y reinicia el servidor

### API no responde
- Verifica que el backend esté corriendo
- Verifica la URL en `.env`
- Abre DevTools → Network para ver requests

---

Para más información, consulta el README.md
