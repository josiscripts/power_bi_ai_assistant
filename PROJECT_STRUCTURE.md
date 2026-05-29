# Estructura Completa del Proyecto

## 📂 Árbol de Directorios

```
powerbi-ai-assistant/
│
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 Common/
│   │   │   ├── Header.tsx              ⭐ Encabezado con logo y versión
│   │   │   ├── Footer.tsx              ⭐ Pie de página con info
│   │   │   └── MainMenu.tsx            ⭐ Botones de 5 módulos
│   │   │
│   │   ├── 📁 ModuloDisenoGraficos/
│   │   │   └── ModuloDisenoGraficos.tsx
│   │   │       • Input: prompt en lenguaje natural
│   │   │       • Output: vista previa + botón aplicar
│   │   │       • Integración: Claude API para análisis
│   │   │
│   │   ├── 📁 ModuloMedidasDAX/
│   │   │   └── ModuloMedidasDAX.tsx
│   │   │       • Input: descripción de medida
│   │   │       • Output: DAX + explicación + historial
│   │   │       • Integración: Tabla _MedidasGeneradas
│   │   │
│   │   ├── 📁 ModuloTraducciones/
│   │   │   └── ModuloTraducciones.tsx
│   │   │       • Input: clave + 6 idiomas
│   │   │       • Output: tabla TraduccionesTitulos
│   │   │       • Idiomas: ES, EN, PT, FR, ZH, JA
│   │   │
│   │   ├── 📁 ModuloRutasDinamicas/
│   │   │   └── ModuloRutasDinamicas.tsx
│   │   │       • Input: páginas del reporte
│   │   │       • Output: DAX + vista previa
│   │   │       • Separadores: > → / ❯ |
│   │   │
│   │   └── 📁 ModuloFiltros/
│   │       └── ModuloFiltros.tsx
│   │           • Tipos: radio, checkbox, date, range
│   │           • Funciones: búsqueda, menú avanzado
│   │           • Visual: chips de filtros activos
│   │
│   ├── 📁 services/
│   │   ├── api.ts                      ⭐ Cliente HTTP (Axios)
│   │   │   • Métodos para cada módulo
│   │   │   • Manejo de errores
│   │   │   • Timeout configurable
│   │   │
│   │   └── store.ts                    ⭐ Estado Global (Zustand)
│   │       • useAppStore()             - Estado principal
│   │       • useFilterStore()          - Filtros activos
│   │       • usePreviewStore()         - Vista previa
│   │
│   ├── 📁 types/
│   │   └── index.ts                    ⭐ Tipos TypeScript
│   │       • ModuleType, FilterConfig, DAXMeasure
│   │       • Translation, DynamicRoute, ChartConfig
│   │       • PromptRequest, PromptResponse
│   │
│   ├── 📁 hooks/
│   │   └── useApi.ts                   ⭐ Hook personalizado
│   │       • Encapsula lógica de API calls
│   │       • Manejo de loading y errores
│   │       • Callbacks para éxito/error
│   │
│   ├── 📁 constants/
│   │   └── index.ts                    ⭐ Constantes globales
│   │       • Módulos, idiomas, tipos
│   │       • Mensajes de error/éxito
│   │       • Configuración de UI
│   │
│   ├── 📁 config/
│   │   └── index.ts                    ⭐ Configuración de app
│   │       • Variables de entorno
│   │       • URLs de API
│   │       • Feature flags
│   │
│   ├── 📁 utils/
│   │   └── helpers.ts                  ⭐ Funciones de utilidad
│   │       • Formateo de fechas
│   │       • Clipboard, validaciones
│   │       • Debounce, throttle, retry
│   │
│   ├── 📁 styles/
│   │   └── global.css                  ⭐ Estilos globales
│   │       • Tailwind directives
│   │       • Componentes reutilizables
│   │       • Variables CSS
│   │
│   ├── App.tsx                         ⭐ Componente raíz
│   │   • Renderiza módulos según state
│   │   • Layout principal (Header + Main + Footer)
│   │   • Routing lógico
│   │
│   └── main.tsx                        ⭐ Punto de entrada
│       • React.StrictMode
│       • Importa estilos globales
│
├── 📁 docs/                             (Existente)
│   └── ESPECIFICACION_APLICACION_POWERBI_AVANZADO.md
│
├── 📄 Archivos Configuración
│   ├── index.html                       ⭐ HTML principal
│   ├── package.json                     ⭐ Dependencias y scripts
│   ├── tsconfig.json                    ⭐ Configuración TypeScript
│   ├── vite.config.ts                   ⭐ Configuración Vite
│   ├── tailwind.config.js               ⭐ Configuración Tailwind
│   ├── postcss.config.js                ⭐ PostCSS para Tailwind
│   ├── .eslintrc.cjs                    ⭐ Configuración ESLint
│   ├── .env.example                     ⭐ Ejemplo de variables
│   ├── .gitignore                       ⭐ Archivos a ignorar en git
│   │
│   ├── README.md                        ⭐ Documentación principal
│   ├── DEVELOPMENT.md                   ⭐ Guía de desarrollo
│   ├── PROJECT_STRUCTURE.md             ⭐ Este archivo
│   │
│   └── 📁 .claude/
│       └── projects/
│           └── [proyecto]/
│               └── memory/              - Sistema de memoria persistente
```

## 🔑 Archivos Clave

### Componentes (5 módulos)
1. **ModuloDisenoGraficos.tsx** - Crea gráficos con IA
2. **ModuloMedidasDAX.tsx** - Genera medidas DAX
3. **ModuloTraducciones.tsx** - Traducciones multiidioma
4. **ModuloRutasDinamicas.tsx** - Rutas de navegación
5. **ModuloFiltros.tsx** - Filtros interactivos

### Servicios
- **api.ts** - Todas las llamadas HTTP
- **store.ts** - Estado global con Zustand

### Configuración
- **package.json** - React, TypeScript, Tailwind, Axios, Zustand
- **tsconfig.json** - Paths para imports (~/@)
- **vite.config.ts** - Configuración del build
- **tailwind.config.js** - Colores y temas personalizados

## 📊 Diagrama de Flujos

```
┌─────────────────────────────────────────────────────┐
│                    Inicio (/)                        │
│         MainMenu con 5 botones                       │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────┼────────────┬────────────┬──────────┐
        │            │            │            │          │
        ▼            ▼            ▼            ▼          ▼
    Gráficos      DAX        Traducción     Rutas      Filtros
        │            │            │            │          │
        └────────────┴────────────┴────────────┴──────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │   Zustand Store      │
          │  (activeModule)      │
          └──────────────────────┘
```

## 🎯 Flujo de Datos por Módulo

```
Usuario Input
    ↓
Componente
    ↓
useApi Hook o useAppStore
    ↓
api.ts (Axios Request)
    ↓
Backend REST API
    ↓
Response (JSON)
    ↓
Zustand Store (actualizar estado)
    ↓
Component Re-render
    ↓
UI Actualizada
```

## 💾 Dependencias Principales

```json
{
  "react": "^18.2.0",           // Framework UI
  "react-dom": "^18.2.0",       // React para DOM
  "typescript": "^5.3.0",       // Lenguaje tipado
  "axios": "^1.6.0",            // Cliente HTTP
  "zustand": "^4.4.0",          // State management
  "tailwindcss": "^3.3.0",      // CSS framework
  "vite": "^5.0.0"              // Build tool
}
```

## 🎨 Paleta de Colores

```
Primary (Azul)
├── 50: #f0f9ff
├── 100: #e0f2fe
├── 500: #0ea5e9
├── 600: #0284c7
└── 900: #082f49

Secondary (Púrpura)
├── 50: #faf5ff
├── 100: #f3e8ff
├── 500: #a855f7
└── 600: #9333ea

Success (Verde)
├── 50: #f0fdf4
├── 500: #22c55e
└── 600: #16a34a

Warning (Amarillo)
├── 50: #fefce8
├── 500: #eab308
└── 600: #ca8a04

Error (Rojo)
├── 50: #fef2f2
├── 500: #ef4444
└── 600: #dc2626
```

## 📱 Responsive Design

- **Mobile**: 1 columna (< 768px)
- **Tablet**: 2 columnas (768px - 1024px)
- **Desktop**: 3-5 columnas (> 1024px)

Basado en Tailwind breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🔐 Variables de Entorno

```
VITE_API_URL=http://localhost:3000/api
VITE_POWER_BI_API_KEY=xxxxx
VITE_CLAUDE_API_KEY=xxxxx
```

## ✅ Scripts Disponibles

```bash
npm run dev         # Inicia servidor con hot reload
npm run build       # Build para producción
npm run preview     # Preview del build
npm run lint        # Ejecuta ESLint
npm run type-check  # Verifica tipos TypeScript
```

## 🚀 Próximos Pasos

1. **Instalar dependencias**: `npm install`
2. **Configurar .env**: Copiar `.env.example` a `.env`
3. **Iniciar servidor**: `npm run dev`
4. **Abrir en navegador**: http://localhost:5173
5. **Desarrollar**: Editar componentes en `src/`

## 📞 Contacto

Para preguntas o sugerencias, contacta al equipo de desarrollo.

---

**Última actualización**: Mayo 2026  
**Estado**: Estructura completa lista para desarrollo
