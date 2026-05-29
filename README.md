# Power BI AI Assistant

Aplicación inteligente para diseñar gráficos, medidas DAX, traducciones multiidioma, rutas dinámicas y filtros avanzados en Power BI utilizando inteligencia artificial.

## 🎯 Características Principales

- **Diseño de Gráficos con IA**: Crea gráficos automáticamente mediante prompts en lenguaje natural
- **Generación de Medidas DAX**: Genera fórmulas DAX con explicaciones detalladas
- **Traducciones Multiidioma**: Crea traducciones automáticas en 6 idiomas (ES, EN, PT, FR, ZH, JA)
- **Rutas Dinámicas**: Genera rutas de navegación que se traducen automáticamente
- **Filtros Visuales Avanzados**: Diseña filtros interactivos con múltiples opciones
- **Vista Previa en Tiempo Real**: Previsualizas cambios antes de aplicarlos
- **Interfaz Intuitiva**: Diseño moderno y fácil de usar

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 16+ 
- npm o yarn o pnpm

### Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd powerbi-ai-assistant
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
# Edita .env con tus claves API
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
powerbi-ai-assistant/
├── src/
│   ├── components/
│   │   ├── Common/              # Componentes compartidos
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MainMenu.tsx
│   │   ├── ModuloDisenoGraficos/
│   │   ├── ModuloMedidasDAX/
│   │   ├── ModuloTraducciones/
│   │   ├── ModuloRutasDinamicas/
│   │   └── ModuloFiltros/
│   ├── services/
│   │   ├── api.ts               # Cliente API
│   │   └── store.ts             # Estado global (Zustand)
│   ├── types/
│   │   └── index.ts             # Tipos TypeScript
│   ├── hooks/                   # Custom hooks (próximamente)
│   ├── styles/
│   │   └── global.css           # Estilos globales
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor con hot reload

# Producción
npm run build        # Compila para producción
npm run preview      # Vista previa de la compilación

# Calidad de Código
npm run lint         # Ejecuta ESLint
npm run type-check   # Verifica tipos TypeScript
```

## 🎨 Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Estilos**: Tailwind CSS 3
- **Build Tool**: Vite
- **Estado Global**: Zustand
- **HTTP Client**: Axios
- **Linting**: ESLint + TypeScript ESLint

## 📊 Módulos Disponibles

### 1. Diseño de Gráficos
Describe tu gráfico en lenguaje natural y la IA:
- Analiza la estructura de datos
- Genera una vista previa
- Aplica automáticamente en Power BI

### 2. Medidas DAX
Crea medidas DAX automáticamente:
- Descripción en lenguaje natural
- Explicación detallada del DAX
- Aplicación en tabla dedicada `_MedidasGeneradas`

### 3. Traducciones Multiidioma
Traduce contenido en 6 idiomas:
- Español (ES)
- Inglés (EN)
- Portugués (PT)
- Francés (FR)
- Chino (ZH)
- Japonés (JA)

### 4. Rutas Dinámicas
Genera rutas de navegación:
- Detección automática de páginas
- Separadores personalizables
- Soporte multiidioma

### 5. Filtros Avanzados
Crea filtros interactivos:
- Radio buttons (selección única)
- Checkboxes (selección múltiple)
- Date pickers
- Búsqueda
- Menú avanzado

## 🔌 Integración con API

La aplicación se conecta a un backend que debe proporcionar:

```typescript
POST /api/prompt                    // Procesar prompts
POST /api/preview/graphic           // Vista previa de gráficos
POST /api/apply/graphic             // Aplicar gráficos
POST /api/dax/generate              // Generar medidas DAX
POST /api/dax/apply                 // Aplicar medidas
POST /api/translations/generate     // Generar traducciones
POST /api/translations/apply        // Aplicar traducciones
POST /api/routes/generate           // Generar rutas
POST /api/filters/options/:columna  // Obtener opciones de filtro
```

## 🔐 Seguridad

- Todas las variables sensibles se configuran en `.env`
- Las claves API no se exponen al cliente
- Implementar CORS en el backend
- Validación de inputs en frontend y backend

## 📈 Próximas Características

- [ ] Tema oscuro completo
- [ ] Exportación de configuraciones
- [ ] Historial de cambios
- [ ] Colaboración en tiempo real
- [ ] Análisis de rendimiento
- [ ] Integración con Power BI Live

## 📝 Configuración de Tailwind

El proyecto utiliza Tailwind CSS con configuración personalizada:

- **Colores**: Paleta extendida con variantes primary, secondary, success, warning, error
- **Componentes**: Classes reutilizables como `.btn`, `.card`, `.input`
- **Dark Mode**: Soporte para tema oscuro

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## 📞 Soporte

Para reportar bugs o solicitar features, por favor abre un issue en el repositorio.

## 🙏 Agradecimientos

- Inspirado en la especificación técnica de Power BI AI Assistant
- Construido con React, TypeScript y Tailwind CSS
- Impulsado por Claude AI

---

**Versión**: 1.0.0  
**Última actualización**: Mayo 2026  
**Estado**: En desarrollo activo
