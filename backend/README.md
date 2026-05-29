# Power BI AI Assistant - Backend

Backend API para Power BI AI Assistant. Proporciona endpoints para generar gráficos, medidas DAX, traducciones, rutas dinámicas y filtros usando Claude API.

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación

```bash
cd backend
npm install
```

### Configuración

```bash
# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus valores
CLAUDE_API_KEY=your_key
PORT=3000
```

### Iniciar Servidor

```bash
# Desarrollo (con hot reload)
npm run dev

# Producción
npm run build
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📚 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Health Check
```
GET /health
```

### 🎨 Módulo 1: Gráficos

#### Generar Vista Previa
```
POST /preview/graphic
Content-Type: application/json

{
  "prompt": "Gráfico de barras que muestre ventas por región",
  "tipo": "bar"
}

Response:
{
  "success": true,
  "data": {
    "titulo": "Ventas por Región",
    "tipo": "bar",
    "descripcion": "...",
    "datosEsperados": ["región", "ventas"]
  }
}
```

#### Aplicar Gráfico
```
POST /apply/graphic
Content-Type: application/json

{
  "titulo": "Ventas por Región",
  "tipo": "bar",
  "datos": {}
}

Response:
{
  "success": true,
  "data": {
    "id": "graphic_...",
    "nombre": "Ventas por Región",
    "estado": "creado"
  }
}
```

### 📊 Módulo 2: Medidas DAX

#### Generar Medida DAX
```
POST /dax/generate
Content-Type: application/json

{
  "prompt": "Suma total de ventas",
  "context": {}
}

Response:
{
  "success": true,
  "data": {
    "nombre": "Total_Ventas",
    "formula": "SUMX(...)",
    "explicacion": "...",
    "tabla": "_Medidas"
  }
}
```

#### Aplicar Medida
```
POST /dax/apply
Content-Type: application/json

{
  "nombre": "Total_Ventas",
  "formula": "SUM(Ventas[Monto])",
  "explicacion": "Suma total de ventas",
  "tabla": "_Medidas"
}
```

#### Obtener Medidas
```
GET /dax/measures

Response:
{
  "success": true,
  "data": [...]
}
```

#### Validar DAX
```
POST /dax/validate
Content-Type: application/json

{
  "formula": "SUM(Tabla[Columna])"
}
```

### 🌐 Módulo 3: Traducciones

#### Generar Traducciones
```
POST /translations/generate
Content-Type: application/json

{
  "clave": "titulo_bienvenida",
  "idiomas": ["es", "en", "pt", "fr"]
}

Response:
{
  "success": true,
  "data": {
    "es": "Bienvenida",
    "en": "Welcome",
    "pt": "Bem-vindo",
    "fr": "Bienvenue"
  }
}
```

#### Aplicar Traducciones
```
POST /translations/apply
Content-Type: application/json

{
  "clave": "titulo_bienvenida",
  "es": "Bienvenida",
  "en": "Welcome",
  "pt": "Bem-vindo",
  "fr": "Bienvenue",
  "zh": "欢迎",
  "ja": "ようこそ"
}
```

#### Obtener Traducciones
```
GET /translations

Response:
{
  "success": true,
  "data": [...]
}
```

### 🗺️ Módulo 4: Rutas Dinámicas

#### Generar Ruta
```
POST /routes/generate
Content-Type: application/json

{
  "paginas": ["Almacén", "Stock", "Análisis", "Rotura"],
  "separador": ">"
}
```

#### Aplicar Ruta
```
POST /routes/apply
Content-Type: application/json

{
  "nombre": "Ruta_Almacen",
  "paginas": ["Almacén", "Stock"],
  "separador": ">",
  "formula": "..."
}
```

#### Obtener Páginas Ejemplo
```
GET /routes/pages/sample

Response:
{
  "success": true,
  "data": {
    "paginas": ["Inicio", "Ventas", "Análisis", "..."],
    "total": 7
  }
}
```

#### Vista Previa de Ruta
```
POST /routes/preview
Content-Type: application/json

{
  "paginas": ["Inicio", "Reportes"],
  "separador": "→"
}

Response:
{
  "success": true,
  "data": {
    "preview": "Inicio → Reportes"
  }
}
```

### 🎛️ Módulo 5: Filtros

#### Obtener Opciones de Filtro
```
GET /filters/options/Año

Response:
{
  "success": true,
  "data": {
    "columna": "Año",
    "opciones": ["2020", "2021", "2022", "2023", "2024"],
    "total": 5
  }
}
```

#### Crear Filtro
```
POST /filters/create
Content-Type: application/json

{
  "nombre": "Año",
  "tipo": "radio",
  "columna": "Tabla[Año]",
  "multiple": false,
  "busqueda": true,
  "menuAvanzado": true,
  "orden": "desc"
}
```

#### Obtener Filtros
```
GET /filters

Response:
{
  "success": true,
  "data": [...]
}
```

#### Aplicar Filtros
```
POST /filters/apply
Content-Type: application/json

{
  "filtros": {
    "Año": "2023",
    "Mes": ["Enero", "Febrero"],
    "Región": "Norte"
  }
}
```

#### Obtener Presets
```
GET /filters/presets

Response:
{
  "success": true,
  "data": [
    {
      "nombre": "Últimos 30 días",
      "filtros": {}
    }
  ]
}
```

## 🔑 Variables de Entorno

```env
# Servidor
PORT=3000
NODE_ENV=development

# Claude API
CLAUDE_API_KEY=your_key

# Power BI
POWER_BI_API_KEY=your_key
POWER_BI_TENANT_ID=your_tenant_id

# CORS
CORS_ORIGIN=http://localhost:5173

# Database
DATABASE_URL=mongodb://localhost:27017/powerbi-ai
```

## 📊 Estructura

```
backend/
├── src/
│   ├── controllers/       # Lógica de endpoints
│   ├── services/         # Servicios (Claude API)
│   ├── types/           # Tipos TypeScript
│   ├── middleware/      # Middlewares
│   └── server.ts        # Servidor principal
├── dist/                # Build output
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## 🧪 Testing

```bash
npm test
```

## 🚢 Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t powerbi-ai-backend .
docker run -p 3000:3000 -e CLAUDE_API_KEY=xxx powerbi-ai-backend
```

### Heroku
```bash
heroku create powerbi-ai-backend
git push heroku main
```

## 🔐 Seguridad

- Validación de inputs
- Rate limiting (agregar)
- Autenticación JWT (agregar)
- HTTPS en producción
- CORS configurado

## 📝 Logging

```bash
# Debug mode
LOG_LEVEL=debug npm run dev
```

## 🆘 Troubleshooting

### Error: "CLAUDE_API_KEY is not set"
→ Configura la variable en `.env`

### Puerto 3000 en uso
```bash
npm run dev -- --port 3001
```

### Error de CORS
→ Verifica que `CORS_ORIGIN` sea correcto

## 📚 Recursos

- [Claude API Docs](https://anthropic.com/api)
- [Express Docs](https://expressjs.com)
- [Power BI REST API](https://learn.microsoft.com/power-bi/developer/rest-api)

---

**Versión**: 1.0.0  
**Última actualización**: Mayo 2026
