# Especificación Técnica: Aplicación Power BI Avanzado con IA

## 📋 Resumen Ejecutivo

Aplicación inteligente que permite diseñar, previsualizar y gestionar gráficos, medidas DAX, traducciones multiidioma, rutas dinámicas y filtros en Power BI utilizando prompts de IA (Claude).

---

## 🎯 Objetivo Principal

Crear una plataforma que permita a usuarios no técnicos:
- Diseñar gráficos mediante prompts de IA
- Previsualizar cambios antes de aplicarlos
- Generar y explicar medidas DAX automáticamente
- Crear traducciones multiidioma dinámicas
- Generar rutas de navegación automáticas
- Diseñar y aplicar filtros visuales avanzados

---

## 🏗️ Módulos Principales

### 1. **MÓDULO 1: Diseño de Gráficos con IA**

#### 1.1 Flujo de Trabajo
```
Usuario → Prompt de IA → Vista Previa → Aprobación → Implementación en Power BI
```

#### 1.2 Características
- **Entrada por Prompt**: Usuario describe el gráfico deseado en lenguaje natural
- **Análisis de Datos**: La IA accede a la estructura de Power BI (tablas, columnas, relaciones)
- **Vista Previa HTML**: Muestra cómo lucirá el gráfico en Power BI antes de aplicar
- **Configuración Visual**: El usuario aprueba o pide ajustes
- **Aplicación Automática**: Se coloca en la posición especificada del reporte

#### 1.3 Ejemplo de Uso
```
Usuario: "Quiero un gráfico de barras que muestre ventas por región"
IA: [Analiza datos] → [Genera vista previa] → [Muestra opciones de diseño]
Usuario: "Aprobado, aplica en página 1"
Sistema: [Crea el gráfico en Power BI automáticamente]
```

---

### 2. **MÓDULO 2: Generación y Aplicación de Medidas DAX**

#### 2.1 Características Principales
- **Análisis de Estructura**: Examina tablas, columnas y relaciones
- **Generación de DAX**: Crea medidas personalizadas basadas en prompts
- **Explicación Simple**: Describe el DAX en lenguaje comprensible
- **Botón Aplicar**: Usuario aprueba antes de crear la medida
- **Almacenamiento Automático**: Crea tabla dedicada para nuevas medidas

#### 2.2 Flujo de Aplicación de Medidas
```
Prompt del Usuario
    ↓
Análisis de Datos (Tablas/Columnas)
    ↓
Generación de DAX
    ↓
Explicación Detallada (Simple)
    ↓
Vista Previa de Resultados
    ↓
[BOTÓN: Aplicar] → Crear en Power BI
    ↓
Tabla de Medidas (Auto-creada)
```

#### 2.3 Ejemplo Completo
**Usuario solicita:**
```
"Quiero el valor total del stock con el nombre de 'valor stock'"
```

**La IA:**
1. Analiza las tablas disponibles
2. Identifica columna de Stock
3. Genera la medida DAX
4. Explica: "Esta medida suma todos los valores de stock de la tabla..."
5. Muestra botón [Aplicar]
6. Al hacer clic, crea la medida en tabla `_Medidas`

#### 2.4 Gestión de Medidas
- **Tabla Dedicada**: Se crea automáticamente `_MedidasGeneradas`
- **Reorganización**: Usuario puede mover medidas entre tablas
- **Relaciones**: Sistema sugiere tablas relacionadas para mejor rendimiento
- **Reutilización**: Las medidas se pueden usar en múltiples gráficos

---

### 3. **MÓDULO 3: Traducciones Dinámicas Multiidioma**

#### 3.1 Estructura de Datos

**Tabla Base: `TraduccionesTitulos`**
```
Clave | ES | EN | PT | FR | ZH | JA
------+----+----+----+----+----+----
"modo_dia_noche" | "Modo Día/Noche" | "Day/Night Mode" | ... | ... | ...
"crear_marcadores" | "Crear marcadores" | "Create bookmarks" | ... | ... | ...
```

#### 3.2 Medidas DAX para Traducciones

**Medida Base: `Texto Traducido`**
```dax
Texto Traducido = 
VAR IdiomaSeleccionado = SELECTEDVALUE(IdiomasTabla[Codigo], "ES")
RETURN
SWITCH(
    IdiomaSeleccionado, 
    "ES", SELECTEDVALUE(TraduccionesTitulos[ES]),
    "EN", SELECTEDVALUE(TraduccionesTitulos[EN]),
    "PT", SELECTEDVALUE(TraduccionesTitulos[PT]),
    "FR", SELECTEDVALUE(TraduccionesTitulos[FR]),
    "ZH", SELECTEDVALUE(TraduccionesTitulos[ZH]), 
    "JA", SELECTEDVALUE(TraduccionesTitulos[JA]),
    SELECTEDVALUE(TraduccionesTitulos[ES])
)
```

**Medidas Específicas (Auto-generadas):**
```dax
DescripcionDinamicaBusquedaInteligente = 
CALCULATE([Texto Traducido], TraduccionesTitulos[Clave] = "desc_busqueda_inteligente")
```

#### 3.3 Flujo de Creación de Traducciones

```
Usuario: "Necesito un título que diga 'Cuenta Cuentos Feliz'"
    ↓
Sistema solicita idiomas a incluir → [ES] [EN] [PT] [FR] [ZH] [JA]
    ↓
Usuario proporciona traducciones (o IA las genera)
    ↓
Sistema crea:
  - Entrada en TraduccionesTitulos
  - Medida DAX personalizada
    ↓
Genera fórmula lista para copiar/pegar en gráficos
    ↓
[BOTÓN: Aplicar] → Se crea en Power BI
```

#### 3.4 Menú Desplegable de Idiomas
- **Opción de Crear**: Usuario elige si crear filtro de idiomas
- **Ubicación Flexible**: Se coloca donde el usuario especifique
- **Actualización Dinámica**: Todos los títulos se actualizan al cambiar idioma
- **Adición Continua**: Se pueden agregar más traducciones sin editar el filtro

#### 3.5 Copiar Palabras Entre Traducciones
**Interfaz de Copia:**
- **Panel Izquierdo**: Pegar DAX con traducciones existentes
- **Panel Derecho**: Palabras que faltan en tu medida
- **Extracción Automática**: Sistema detecta qué traducciones falta
- **Aplicación**: Copia solo las traducciones que necesitas

---

### 4. **MÓDULO 4: Rutas Dinámicas Multiidioma**

#### 4.1 Concepto
Crear breadcrumbs (rutas de navegación) que se traducen automáticamente según el idioma seleccionado.

#### 4.2 Ejemplo de Ruta Dinámica
```dax
RutaDinamicaAnalisisRotura = 
VAR _Almacen = CALCULATE([Texto Traducido], TraduccionesTitulos[Clave] = "almacen")
VAR _Stock = CALCULATE([Texto Traducido], TraduccionesTitulos[Clave] = "stock")
VAR _Analisis = CALCULATE([Texto Traducido], TraduccionesTitulos[Clave] = "analisis")
VAR _Rotura = CALCULATE([Texto Traducido], TraduccionesTitulos[Clave] = "rotura")
RETURN
    _Almacen & "  >  " & _Stock & "  >  " & _Analisis & "  >  " & _Rotura
```

#### 4.3 Flujo Automático de Generación

```
Sistema detecta páginas en Power BI
    ↓
Obtiene nombres de páginas (ej: "Almacén", "Stock", "Análisis", "Rotura")
    ↓
Solicita al usuario: "¿Crear ruta: Almacén > Stock > Análisis > Rotura?"
    ↓
Usuario confirma y selecciona páginas
    ↓
Sistema genera DAX automáticamente
    ↓
Proporciona código listo para:
  - Copiar/Pegar en campo de texto
  - Personalizar orden de páginas
  - Modificar separadores (> / → / / )
    ↓
[BOTÓN: Copiar] o [BOTÓN: Aplicar]
```

#### 4.4 Características
- **Detección Automática**: Analiza estructura de páginas
- **Personalización**: Usuario elige qué páginas incluir
- **Separadores Configurables**: Cambia > por → / ❯ / etc.
- **Multiidioma**: Las páginas se traducen según idioma activo
- **Edición**: Permite modificar DAX manualmente si es necesario

---

### 5. **MÓDULO 5: Creación de Filtros Visuales Avanzados**

#### 5.1 Visión General
Sistema que permite crear filtros interactivos con botones, desplegables y búsqueda.

#### 5.2 Interfaz de Filtros

```
┌─────────────────────────────────────────────────┐
│  PANEL DE FILTROS (Izquierda)                   │
├─────────────────────────────────────────────────┤
│ ☐ Año        [Búsqueda]  [...]                  │
│   ○ 2020     ○ 2021      ○ 2022                 │
├─────────────────────────────────────────────────┤
│ ☐ Mes        [Búsqueda]  [...]                  │
│   ☐ Enero    ☐ Febrero   ☐ Marzo                │
├─────────────────────────────────────────────────┤
│ ☐ Fecha      [Búsqueda]  [...]                  │
│   ○ 01/01/2020           ○ 02/01/2020           │
├─────────────────────────────────────────────────┤
│ ☐ Provincia  [Búsqueda]  [...]                  │
│   ○ ADEJE     ○ AGAETE    ○ ARRECIFE            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  FILTROS ACTIVOS (Centro)                       │
├─────────────────────────────────────────────────┤
│ Año: 2021  [×]                                  │
│ Mes: ene, feb, mar  [×]                         │
│ Fecha: 01/01/2020 - 07/01/2020  [×]             │
└─────────────────────────────────────────────────┘

[BOTÓN: Limpiar Selecciones]
```

#### 5.3 Tipos de Filtros Soportados
| Tipo | Componentes | Comportamiento |
|------|-------------|----------------|
| **Año** | Desplegable/Radio Buttons | Selección única |
| **Mes** | Checkboxes | Selección múltiple |
| **Fecha** | Date Picker / Range | Rango o individual |
| **Artículo** | Checkboxes + Búsqueda | Múltiple con filtrado |
| **Provincia** | Checkboxes + Menú (…) | Opciones avanzadas |
| **Semana** | Checkboxes numéricos | Selección múltiple |
| **Edad** | Sliders / Range | Rango continuo |
| **Personalizado** | Definido por usuario | Flexible |

#### 5.4 Menú Contextual (Tres Puntos)
Opciones disponibles según tipo de filtro:
- **Seleccionar Todo**: Marca todas las opciones
- **Seleccionar Posibles**: Selecciona opciones disponibles tras otros filtros
- **Seleccionar Excluidos**: Selecciona lo opuesto a la selección actual
- **Limpiar**: Elimina la selección
- **Buscar**: Abre búsqueda por texto

#### 5.5 Casos de Uso Detallados

**CASO 1: Filtro por Año (Selección Simple)**
```
1. Usuario hace clic en "Año"
2. Selecciona 2021 del desplegable
3. Aparece chip "Año: 2021" en área central
4. Gráficos se actualizan automáticamente
5. Usuario hace clic en [×] del chip para limpiar
```

**CASO 2: Filtro por Mes (Múltiple)**
```
1. Usuario abre "Mes"
2. Marca enero, febrero y marzo (checkboxes)
3. Aparece chip "Mes: ene, feb, mar"
4. Al hacer clic en [×] se elimina solo este filtro
5. Otros filtros se mantienen activos
```

**CASO 3: Filtro por Artículo (Múltiple con Efectos)**
```
1. Se seleccionan Articulo2, 3, 4, 5
2. Aparecen en chips en centro
3. Los KPIs principales se actualizan (algunos en 0)
4. Usuario hace clic "Limpiar Selecciones" → Todo se reinicia
```

**CASO 4: Filtro por Fecha (Rango)**
```
1. Usuario selecciona desde 01/01/2014 hasta 08/01/2014
2. Mostrará todas las fechas seleccionadas en chip
3. Se puede eliminar el filtro individual o limpiar todo
```

**CASO 5: Filtro Provincia con Menú Avanzado**
```
PASO A - Selección Inicial:
  • Usuario abre "Provincia Cliente"
  • Selecciona ADEJE
  • Aparece chip con ADEJE
  
PASO B - Seleccionar Todo:
  • Abre menú (…)
  • Hace clic "Seleccionar Todo"
  • Todos los datos se cargan
  • Gráficos se vacían (sin filtro específico)
  
PASO C - Seleccionar Posibles:
  • Menú (…) → "Seleccionar Posibles"
  • Solo muestra provincias disponibles
  • Actualiza visualización
  
PASO D - Limpieza:
  • Abre menú o hace clic [×]
  • Se elimina filtro

PASO E - Seleccionar Excluidos:
  • Menú (…) → "Seleccionar Excluidos"
  • Invierte la selección actual
  
PASO F - Volver a Seleccionar Todo:
  • Menú (…) → "Seleccionar Todo"
  • Etiqueta cambia a "All" (Todo)
  
PASO G - Eliminación Final:
  • Hace clic [×] para eliminar completamente
```

**CASO 6: Filtro Semana (Múltiple con Números)**
```
1. Usuario abre "Semana"
2. Marca semanas 1, 2, 3, 4, 5
3. Aparece "Semana: 1, 2, 3, 4, 5"
4. Se elimina con [×]
```

**CASO 7: Múltiples Filtros Activos**
```
1. Usuario selecciona Articulo2, 3, 4, 5
   → Chip: "Artículo: A2, A3, A4, A5"
   
2. Sin limpiar, selecciona abril, mayo, junio, julio
   → Chip: "Mes: abr, may, jun, jul"
   
3. Ambos chips conviven en el panel central
   
4. Hace clic "Limpiar Selecciones"
   → Se eliminan TODOS los filtros de una vez
   → Plataforma vuelve al estado inicial
```

#### 5.6 Propiedades de Configuración
```javascript
{
  "nombre": "Año",
  "tipo": "radio", // radio, checkbox, date, range, search
  "columna": "Tabla_Fecha[Año]",
  "multiple": false,
  "busqueda": false,
  "menuAvanzado": false,
  "orden": "desc",
  "icono": "calendar"
}
```

---

## 🛠️ Arquitectura Técnica

### Stack Recomendado
```
Frontend: React + TypeScript
UI Components: Shadcn/ui
Estilos: Tailwind CSS
Estado: React Context o Zustand
API de Power BI: Power BI REST API / Power BI Embedded
Base de Datos: Para almacenar configuraciones de usuario
```

### Flujo de Datos
```
Usuario escribe Prompt
    ↓
Claude API (análisis + generación)
    ↓
Sistema obtiene metadata de Power BI
    ↓
Renderiza vista previa HTML
    ↓
Usuario aprueba
    ↓
Power BI REST API (aplicación de cambios)
    ↓
Actualización en reporte
```

---

## 📝 Especificaciones Detalladas por Módulo

### Módulo 1: Diseño de Gráficos
**Entradas:**
- Prompt en lenguaje natural
- Rango de páginas disponibles
- Tipos de gráficos preferidos

**Procesos:**
- Análisis de disponibilidad de datos
- Generación de código Power BI
- Renderizado de preview HTML

**Salidas:**
- Vista previa del gráfico
- Recomendaciones de estilo
- Código aplicable

### Módulo 2: Medidas DAX
**Entradas:**
- Descripción de la medida
- Datos disponibles

**Procesos:**
- Análisis de tablas y relaciones
- Generación de DAX
- Explicación en lenguaje simple

**Salidas:**
- Código DAX
- Explicación detallada
- Vista previa de resultado

### Módulo 3: Traducciones
**Entradas:**
- Clave de traducción
- Textos en idiomas

**Procesos:**
- Creación de tabla DATATABLE
- Generación de medidas DAX
- Validación de idiomas

**Salidas:**
- Fórmulas DAX
- Tabla de traducciones
- Medidas por clave

### Módulo 4: Rutas Dinámicas
**Entradas:**
- Páginas del reporte
- Orden de secuencia

**Procesos:**
- Detección automática de páginas
- Generación de DAX
- Validación de traducciones

**Salidas:**
- Fórmula de ruta
- Código copiar/pegar
- Vista previa

### Módulo 5: Filtros
**Entradas:**
- Tipos de filtro requeridos
- Columnas asociadas
- Configuraciones visuales

**Procesos:**
- Generación de componentes HTML
- Lógica de selección
- Actualización de gráficos

**Salidas:**
- Componentes React
- Lógica de filtrado
- Estilos CSS

---

## 🎨 Flujos de Interacción Generales

### Flujo 1: Crear un Gráfico
```
START
  ↓
[Usuario abre app] → Interfaz principal con cuatro botones
  ↓
[Usuario escribe prompt] → "Quiero un gráfico de ventas por región"
  ↓
[Sistema analiza] → Obtiene metadata de Power BI
  ↓
[IA genera propuesta] → Código + preview visual
  ↓
[Usuario ve preview] → Puede pedir cambios o aprobar
  ↓
[Usuario aprueba] → [BOTÓN: Aplicar]
  ↓
[Sistema aplica] → Gráfico aparece en Power BI
  ↓
END
```

### Flujo 2: Crear Medida DAX
```
START
  ↓
[Usuario solicita] → "Valor total de stock"
  ↓
[Sistema analiza estructura] → Identifica tablas y columnas
  ↓
[IA genera DAX] → Código + explicación simple
  ↓
[Usuario revisa] → Lee explicación y ve preview
  ↓
[Usuario aprueba] → [BOTÓN: Aplicar]
  ↓
[Sistema crea medida] → Se agrega a tabla _MedidasGeneradas
  ↓
END
```

### Flujo 3: Agregar Traducción
```
START
  ↓
[Usuario dice] → "Necesito traducción para 'Cuenta Cuentos Feliz'"
  ↓
[Sistema pregunta] → "¿Qué idiomas?"
  ↓
[Usuario selecciona] → ES, EN, PT, FR, ZH, JA
  ↓
[Usuario proporciona o IA genera traducciones]
  ↓
[Sistema crea entrada en tabla]
  ↓
[Sistema genera medidas DAX personalizadas]
  ↓
[Usuario aplica] → Medidas quedan listas en Power BI
  ↓
END
```

### Flujo 4: Crear Filtro
```
START
  ↓
[Usuario solicita] → "Filtros por año, mes, provincia"
  ↓
[Sistema propone] → Estructura visual con cada filtro
  ↓
[Usuario configura] → Colores, posiciones, estilos
  ↓
[Sistema renderiza] → Componentes interactivos
  ↓
[Usuario interactúa] → Selecciona valores
  ↓
[Gráficos se actualizan] → Automáticamente
  ↓
[Usuario limpia] → [BOTÓN: Limpiar Selecciones]
  ↓
END
```

---

## 📦 Componentes Principales

### Frontend Components
```
App.tsx
├── Header
├── MainMenu
│   ├── BtnDisenarGraficos
│   ├── BtnMedidasDAX
│   ├── BtnTraducciones
│   ├── BtnRutasDinamicas
│   └── BtnFiltros
├── ContentArea
│   ├── PromptInput
│   ├── Preview
│   ├── ControlPanel
│   └── ApplyButton
└── Footer
```

---

## 🔌 Integraciones Necesarias

1. **Claude API** - Para análisis y generación de código
2. **Power BI REST API** - Para lectura/escritura de elementos
3. **Power BI Embedded** - Para mostrar previsualizaciones
4. **Base de Datos** - Para persistencia de configuraciones
5. **Autenticación** - OAuth 2.0 con Microsoft

---

## 📊 Paleta de Colores y Estilos

### Sugerencias de Estilo
La aplicación debe sugerir automáticamente estilos basados en:
- Paleta de colores del usuario
- Tema (claro/oscuro)
- Tipo de datos (financiero, RR.HH., inventario, etc.)

### Ejemplo de Sugerencia
```
Usuario elige paleta: Azul corporativo
Sistema sugiere:
- Gráficos de barras en azul marino
- Acentos en naranja
- Fondos en gris claro
- Textos en gris oscuro
```

---

## ✅ Requisitos Funcionales

- [x] Crear gráficos por prompt
- [x] Previsualizar cambios
- [x] Generar medidas DAX con explicaciones
- [x] Crear traducciones multiidioma automáticas
- [x] Generar rutas dinámicas
- [x] Crear filtros interactivos avanzados
- [x] Almacenar medidas en tabla dedicada
- [x] Permitir edición de DAX manual
- [x] Sugerir estilos por paleta de colores
- [x] Copiar/pegar código
- [x] Aplicar cambios directamente en Power BI

---

## ⚠️ Requisitos No Funcionales

- **Rendimiento**: Carga de preview < 2 segundos
- **Escalabilidad**: Soportar reportes con 100+ gráficos
- **Seguridad**: Autenticación segura con Power BI
- **Usabilidad**: Interfaz intuitiva para no técnicos
- **Accesibilidad**: Cumplir con WCAG 2.1 AA

---

## 🚀 Fases de Desarrollo

### Fase 1: MVP (Mínimo Viable)
- Módulo de Gráficos básico
- Módulo de Medidas DAX simple
- Interfaz funcional

### Fase 2: Traducción
- Módulo de Traducciones completo
- Tabla DATATABLE automática
- Menú de idiomas

### Fase 3: Avanzado
- Rutas dinámicas
- Filtros complejos
- Sugerencia de estilos

### Fase 4: Pulido
- Optimización
- Testing exhaustivo
- Documentación

---

## 📚 Ejemplo Completo de Caso de Uso

### Escenario: Crear Dashboard Completo

**Paso 1: Diseñar Gráficos**
```
Usuario: "Necesito gráfico de ventas por región y otro de tendencia anual"
IA: Genera dos gráficos con preview
Usuario: "Aprobado, coloca ambos en página 1"
Sistema: Gráficos creados
```

**Paso 2: Crear Medidas**
```
Usuario: "Quiero KPI de ingresos totales"
IA: Genera medida DAX, explica funcionamiento
Usuario: "Aplica"
Sistema: Medida creada en tabla _MedidasGeneradas
```

**Paso 3: Agregar Traducciones**
```
Usuario: "Necesito todo en español, inglés y portugués"
Sistema: Detecta títulos del dashboard
Usuario: Proporciona o confirma traducciones
Sistema: Crea tabla TraduccionesTitulos y medidas DAX
```

**Paso 4: Crear Ruta de Navegación**
```
Usuario: "Agrega ruta Análisis > Ventas > Detalle"
Sistema: Genera DAX de ruta dinámica multiidioma
Usuario: "Copiar" o "Aplicar"
```

**Paso 5: Implementar Filtros**
```
Usuario: "Filtros por año, mes y región"
Sistema: Renderiza componentes interactivos
Usuario: Interactúa, selecciona valores
Sistema: Gráficos se actualizan en tiempo real
```

**Resultado Final:**
- Dashboard completamente funcional
- Multiidioma
- Filtros interactivos
- Medidas optimizadas
- Rutas de navegación dinámicas

---

## 📞 Contacto y Soporte

Para reportar problemas o solicitar features adicionales, contactar al equipo de desarrollo.

---

**Versión**: 1.0  
**Última actualización**: Mayo 2024  
**Estado**: Especificación Completa - Listo para Desarrollo
