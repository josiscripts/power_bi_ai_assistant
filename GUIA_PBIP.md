# 📋 Guía: Cómo Subir y Usar tu Proyecto PBIP

## 🎯 ¿Qué es PBIP?

**PBIP** = Power BI Project (Formato moderno de Power BI)

Es una **carpeta con estructura de directorios** que contiene:
```
tu-proyecto.pbip/
├── dataset/
│   ├── metadata.json        ← Modelo (tablas, medidas, relaciones)
│   ├── tables/              ← Definiciones de tablas
│   └── expressions/         ← Fórmulas DAX
├── report/
│   ├── definition.json      ← Configuración del reporte
│   ├── pages/
│   │   ├── ReportSection1.json  ← Página 1 (gráficos)
│   │   └── ReportSection2.json  ← Página 2 (gráficos)
│   └── ...
└── .gitignore
```

---

## 📦 **Paso 1: Generar ZIP de tu Carpeta PBIP**

### En Windows:

1. **Abre tu carpeta PBIP en el Explorador:**
   ```
   C:\ruta\a\tu-proyecto.pbip/
   ```

2. **Comprime la carpeta:**
   - Click derecho en la carpeta
   - "Enviar a" → "Carpeta comprimida (ZIP)"
   - Se creará `tu-proyecto.zip`

### Alternativa (PowerShell):
```powershell
$carpeta = "C:\ruta\a\tu-proyecto.pbip"
$destino = "C:\ruta\a\tu-proyecto.zip"
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($carpeta, $destino)
```

### En Mac/Linux:
```bash
cd /ruta/a/
zip -r tu-proyecto.zip tu-proyecto.pbip/
```

---

## 🚀 **Paso 2: Subir el ZIP a la Aplicación**

1. **Abre la app:** http://localhost:5174

2. **Selecciona "Análisis de .pbip"** en el menú

3. **Sube el archivo ZIP:**
   - Arrastra y suelta
   - O haz clic para seleccionar

4. **La app:**
   - ✅ Descomprime el ZIP
   - ✅ Analiza `dataset/metadata.json`
   - ✅ Extrae tablas, columnas, medidas
   - ✅ Lee gráficos existentes
   - ✅ Valida estructura

---

## ✨ **Paso 3: Generar Gráficos con Claude**

### Flujo:

```
1. Ves tu modelo (tablas, campos, medidas)
   
2. Describes: "Quiero un gráfico de barras con ventas por región"
   
3. Claude:
   ├─ Analiza tu modelo
   ├─ Identifica campos disponibles
   ├─ Genera configuración JSON
   └─ Muestra vista previa
   
4. Apruebas o rechazas
   
5. App agrega el gráfico al PBIP
```

### Ejemplo de Prompt:

```
"Crea un gráfico de líneas que muestre la tendencia de ventas 
por mes. Usa la tabla Ventas, el campo Fecha para el eje X, 
y la medida Total de Ventas para el eje Y."
```

---

## ❌ **Paso 4: Eliminar Gráficos**

1. **Ver lista de gráficos existentes**

2. **Seleccionar gráfico a eliminar**

3. **Confirmar eliminación**

4. **App lo remueve del PBIP**

---

## ✓ **Validación Automática**

La app valida que:

✅ El gráfico tenga nombre, tipo y título  
✅ El tipo sea válido en Power BI (BarChart, LineChart, etc.)  
✅ Los campos existan en tu modelo  
✅ Las medidas existan en tu modelo  
✅ Las relaciones sean correctas  
✅ La estructura JSON sea válida  

**Si hay error:** No permite aplicar, te muestra qué falló.

---

## 📥 **Paso 5: Descargar PBIP Modificado**

1. **Descarga el ZIP modificado**
   - Botón "Descargar"

2. **Extrae el ZIP en tu PC:**
   ```
   C:\Proyectos\tu-proyecto.zip → C:\Proyectos\tu-proyecto.pbip/
   ```

3. **Abre en Power BI Desktop:**
   - File → Open
   - Selecciona tu carpeta `tu-proyecto.pbip`
   - ¡Los gráficos están ahí! ✅

---

## 🔄 **Flujo Completo (Visual)**

```
Tu PC (Windows/Mac)
    ├─ 1️⃣ Carpeta PBIP
    │  └─ Comprimir a ZIP
    │
    └─ 2️⃣ Subir ZIP
       ↓
   
   🌐 Navegador (App)
    │
    ├─ 3️⃣ Analizar modelo
    │
    ├─ 4️⃣ Generar gráficos con Claude
    │
    ├─ 5️⃣ Remover gráficos
    │
    ├─ 6️⃣ Validar todo
    │
    └─ 7️⃣ Descargar ZIP modificado
       ↓
   
   Tu PC (Windows/Mac)
    │
    ├─ 8️⃣ Extraer ZIP
    │
    └─ 9️⃣ Abrir en Power BI Desktop
       ✅ ¡Gráficos listos!
```

---

## 💡 **Casos de Uso**

### Caso 1: Agregar 5 gráficos nuevos
```
1. Sube PBIP
2. "Gráfico de ventas por región" → Claude genera → Aplica
3. "Gráfico de clientes por país" → Claude genera → Aplica
4. "Gráfico de tendencia mensual" → Claude genera → Aplica
5. Repite 2-3 veces más
6. Descarga
7. Abre en Power BI Desktop
```

### Caso 2: Reemplazar gráficos
```
1. Sube PBIP
2. Elimina gráficos antiguos
3. Genera nuevos gráficos
4. Descarga
5. Abre en Power BI Desktop
```

### Caso 3: Agregar medidas nuevas
```
1. Sube PBIP
2. "Crea una medida de margen de ganancia" → Claude genera
3. App agrega a tabla _Medidas
4. Descarga
5. Usa las nuevas medidas en Power BI Desktop
```

---

## 🚨 **Errores Comunes**

| Error | Causa | Solución |
|-------|-------|----------|
| "No es un PBIP válido" | ZIP sin estructura correcta | Comprime la carpeta PBIP completa |
| "Campo no encontrado" | Nombre mal escrito | Usa nombres exactos de tu modelo |
| "Tabla no existe" | Tabla no existe en el modelo | Verifica las tablas en la app |
| "Tipo de gráfico inválido" | Tipo mal escrito | Usa: BarChart, LineChart, PieChart, etc. |

---

## 🎓 **Tipos de Gráficos Válidos**

```
✅ BarChart         - Gráfico de barras
✅ ColumnChart      - Gráfico de columnas
✅ LineChart        - Gráfico de líneas
✅ PieChart         - Gráfico de pastel
✅ ScatterChart     - Gráfico de dispersión
✅ AreaChart        - Gráfico de áreas
✅ Table            - Tabla
✅ Matrix           - Matriz
✅ Card             - Tarjeta
✅ Gauge            - Medidor
✅ KPI              - Indicador clave
```

---

## 📝 **Estructura de Binding de Datos**

Cada gráfico necesita "bindings" (conexión con datos):

```json
{
  "name": "VentasPorRegion",
  "type": "BarChart",
  "title": "Ventas por Región",
  "dataBindings": [
    {
      "field": "Region",
      "table": "Ventas",
      "aggregation": "DISTINCT"
    },
    {
      "field": "Total Ventas",
      "table": "Ventas",
      "aggregation": "SUM"
    }
  ]
}
```

---

## ✅ **Checklist Antes de Descargar**

- [ ] He verificado que todos los gráficos se ven correctamente
- [ ] He revisado que los nombres de las medidas son correctos
- [ ] He confirmado que los campos existen en mi modelo
- [ ] He eliminado los gráficos que no quería
- [ ] He agregado todos los gráficos nuevos que necesitaba

---

## 🆘 **Soporte**

Si algo no funciona:

1. Verifica que la estructura PBIP es correcta
2. Asegúrate de comprimir la carpeta completa a ZIP
3. Comprueba que los nombres coinciden exactamente (mayúsculas/minúsculas)
4. Intenta subir un PBIP más simple primero para probar

---

**¡Listo! Ahora puedes trabajar con tu PBIP en la aplicación.** 🚀
