# 🏗️ Arquitectura de Despliegue - Diagrama

## Arquitectura General

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                           USUARIO FINAL                           ┃
┃                   (Abre navegador web)                           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                                  ↓
                                HTTPS
                                  ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                      VERCEL (Frontend)                            ┃
┃              https://tu-app-xyz.vercel.app                       ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                   ┃
┃ React + Vite                                                      ┃
┃ ├─ src/config/index.ts                                          ┃
┃ │  └─ baseURL: VITE_API_URL (desde .env.production)            ┃
┃ │                                                                ┃
┃ └─ Cuando usuario sube archivo:                                ┃
┃    POST https://tu-backend.onrender.com/api/pbip/upload        ┃
┃    ↑                                                             ┃
┃    └─ URL viene de VITE_API_URL                                ┃
┃                                                                   ┃
┃ Variables de entorno (.env.production):                          ┃
┃ ├─ VITE_API_URL=https://backend.onrender.com/api               ┃
┃ ├─ VITE_CLAUDE_API_KEY=sk-ant-xxxxx                            ┃
┃ ├─ VITE_POWER_BI_API_KEY=xxxxx                                 ┃
┃ └─ VITE_POWER_BI_TENANT_ID=xxxxx                               ┃
┃                                                                   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                                  ↓
                          HTTPS POST/GET
                   /api/pbip/upload
                   /api/pbip/analyze-relationships
                   /api/pbip/auto-repair
                                  ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃            RENDER o RAILWAY (Backend API)                        ┃
┃         https://tu-backend.onrender.com                         ┃
┃         (o https://tu-backend.railway.app)                      ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                   ┃
┃ Express.js + Node.js                                             ┃
┃ ├─ src/server.ts                                                ┃
┃ │  └─ CORS dinámico (lee CORS_ORIGINS)                         ┃
┃ │     ├─ Lee variable: process.env.CORS_ORIGINS                ┃
┃ │     ├─ Valida origen de request                              ┃
┃ │     └─ Si coincide: procesa; Si no: rechaza                  ┃
┃ │                                                                ┃
┃ ├─ src/controllers/pbipController.ts                            ┃
┃ │  └─ POST /api/pbip/upload → recibe y procesa ZIP            ┃
┃ │                                                                ┃
┃ ├─ src/controllers/relationshipRepairController.ts              ┃
┃ │  ├─ POST /api/pbip/analyze-relationships → llama a IA      ┃
┃ │  └─ POST /api/pbip/auto-repair → modifica TMDL             ┃
┃ │                                                                ┃
┃ └─ src/services/                                                ┃
┃    ├─ claudeService.ts (integración Claude IA)                 ┃
┃    ├─ relationshipAnalysisService.ts (análisis)                ┃
┃    └─ pbipService.ts (procesamiento de archivos)               ┃
┃                                                                   ┃
┃ Variables de entorno (.env.production):                          ┃
┃ ├─ PORT=3000 (asignado automáticamente)                        ┃
┃ ├─ NODE_ENV=production                                          ┃
┃ ├─ CORS_ORIGINS=https://tu-app.vercel.app ← CRÍTICA            ┃
┃ ├─ CLAUDE_API_KEY=sk-ant-xxxxx                                 ┃
┃ ├─ POWER_BI_API_KEY=xxxxx                                      ┃
┃ ├─ POWER_BI_TENANT_ID=xxxxx                                    ┃
┃ └─ LOG_LEVEL=info                                               ┃
┃                                                                   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                                  ↓
                         HTTPS Response
                    (archivo reparado o análisis)
                                  ↓
                   Vuelve a Frontend (Vercel)
                                  ↓
                    Usuario ve resultado
```

---

## Flujo de Upload de Archivo

```
1. Usuario abre Frontend
   ├─ URL: https://tu-app.vercel.app
   ├─ Frontend carga variables (.env.production)
   │  └─ VITE_API_URL=https://backend.onrender.com/api
   └─ PBIXUploader.tsx listo

2. Usuario selecciona archivo PBIP
   ├─ Click en "Seleccionar Archivo"
   └─ Elige file.pbip (o file.zip)

3. Frontend valida archivo
   ├─ Verifica extensión (.pbip o .zip)
   ├─ Prepara FormData
   └─ Listo para enviar

4. Frontend hace POST request
   ├─ URL: https://backend.onrender.com/api/pbip/upload
   │        ↑ Construida desde VITE_API_URL
   ├─ Headers: Content-Type: multipart/form-data
   ├─ Body: archivo binario
   └─ Espera respuesta

5. Backend recibe request
   ├─ Valida CORS
   │  ├─ Extrae Origin header: https://tu-app.vercel.app
   │  ├─ Lee CORS_ORIGINS: https://tu-app.vercel.app
   │  ├─ Compara: ¿coinciden? ✓ SÍ
   │  └─ Procesa request
   │
   ├─ pbipController.upload()
   │  ├─ Recibe archivo
   │  ├─ Descomprime ZIP/PBIP
   │  ├─ Extrae metadata (tablas, columnas, relaciones)
   │  ├─ Retorna: { success: true, data: { filePath, metadata } }
   │  └─ Guarda en: uploads/timestamp-file.zip
   │
   └─ Retorna response HTTPS → Frontend

6. Frontend recibe response
   ├─ Parsea JSON
   ├─ Muestra metadata de tablas
   ├─ Ofrece opción "Reparar Automáticamente"
   └─ Usuario puede elegir acciones

7. Usuario elige "Reparar"
   ├─ Frontend POST /analyze-relationships
   │  └─ Backend llama Claude IA → obtiene acciones
   │
   ├─ Frontend muestra acciones detectadas
   │  ├─ 8 relaciones a crear
   │  ├─ Explicación de IA
   │  └─ Usuario puede seleccionar cuáles aplicar
   │
   └─ Usuario confirma → POST /auto-repair
      ├─ Backend aplica acciones
      ├─ Modifica TMDL
      ├─ Valida archivo
      ├─ Guarda versión reparada
      └─ Retorna: { success: true, repairPath: "..." }

8. Frontend descarga archivo
   ├─ GET /download-repaired?filePath=...
   ├─ Backend retorna archivo ZIP modificado
   └─ Usuario recibe archivo REPARADO
```

---

## Variables de Entorno - Flujo

```
DESARROLLO (localhost)
══════════════════════════════════════════════════════════════════

Frontend .env:
  VITE_API_URL=http://localhost:3000/api
              ↓
        request a http://localhost:3000/api/pbip/upload

Backend .env:
  PORT=3000
  CORS_ORIGINS=http://localhost:5173,http://localhost:3000
              ↓
        valida origen de request
        ✓ http://localhost:5173 permitido
        ✓ http://localhost:3000 permitido


PRODUCCIÓN (Vercel + Render)
══════════════════════════════════════════════════════════════════

1. Desplegar Frontend en Vercel
   ├─ Get URL: https://app-xyz.vercel.app
   └─ Configura .env.production:
      VITE_API_URL=https://backend.onrender.com/api
                   ↓
            request a https://backend.onrender.com/api/pbip/upload

2. Desplegar Backend en Render
   ├─ Get URL: https://backend.onrender.com
   └─ Configura .env.production:
      CORS_ORIGINS=https://app-xyz.vercel.app
                   ↓
            valida origen de request
            ✓ https://app-xyz.vercel.app permitido
            ✗ http://localhost:5173 rechazado
            ✗ cualquier otro origen rechazado
```

---

## Sincronización de URLs

```
ANTES de desplegar:
═══════════════════════════════════════════════════════════════════

1. Frontend .env.production:
   VITE_API_URL=(NO CONOCEMOS AÚN LA URL DEL BACKEND)

2. Backend .env.production:
   CORS_ORIGINS=(NO CONOCEMOS AÚN LA URL DE VERCEL)

DESPUÉS de desplegar:
═══════════════════════════════════════════════════════════════════

1. Vercel te da: https://app-abc123.vercel.app
   ├─ Frontend está aquí
   └─ Backend debe permitir este origen:
      CORS_ORIGINS=https://app-abc123.vercel.app

2. Render te da: https://backend-xyz.onrender.com
   ├─ Backend está aquí
   └─ Frontend debe conocer esta URL:
      VITE_API_URL=https://backend-xyz.onrender.com/api

CICLO FINAL:
═══════════════════════════════════════════════════════════════════

Frontend (.env.production):
  VITE_API_URL=https://backend-xyz.onrender.com/api
                            ↓
                    request a Backend

Backend (.env.production):
  CORS_ORIGINS=https://app-abc123.vercel.app
                        ↓
                    valida request
                        ↓
                    ✓ PERMITIDO (coincide)
                        ↓
                    procesa request
                        ↓
                    retorna response
```

---

## Puertos

```
DESARROLLO
═══════════════════════════════════════════════════════════════════

Frontend (Vite dev server):
  http://localhost:5173  (puerto por defecto de Vite)
  └─ Desarrollador abre en navegador

Backend (Express server):
  http://localhost:3000  (configurado en .env)
  └─ Frontend hace requests aquí


PRODUCCIÓN
═══════════════════════════════════════════════════════════════════

Frontend (Vercel):
  https://app-abc.vercel.app  (HTTPS, sin puerto visible)
  └─ Usuario abre en navegador

Backend (Render/Railway):
  https://backend.onrender.com  (HTTPS, sin puerto visible)
  └─ Internamente escucha en:
     process.env.PORT (asignado por Render/Railway, ej: 10000)
     └─ Automático, no configurar manualmente


NOTA: En .env.production del backend:
  PORT=3000  ← Es ignorado en producción
            ← Render/Railway usan su propio puerto
            ← Pero el código respeta process.env.PORT
```

---

## Seguridad - CORS

```
¿QUÉ ES CORS?
═══════════════════════════════════════════════════════════════════

Cross-Origin Resource Sharing
├─ Protección del navegador
├─ Evita que scripts maliciosos accedan a APIs
└─ Backend DEBE permitir explícitamente orígenes

FLUJO DE VALIDACIÓN CORS
═══════════════════════════════════════════════════════════════════

1. Frontend hace request desde: https://app-abc123.vercel.app
   ├─ Request incluye header: Origin: https://app-abc123.vercel.app
   └─ Backend recibe request

2. Backend verifica:
   ├─ Lee: process.env.CORS_ORIGINS
   ├─ Valor: https://app-abc123.vercel.app,https://app2.vercel.app
   ├─ Extrae origen del header
   ├─ ¿Está en la lista permitida?
   │  ├─ ✓ SÍ: Agrega header CORS y procesa
   │  └─ ✗ NO: Rechaza con error CORS
   └─ Retorna response

3. Navegador recibe response:
   ├─ Si tiene header CORS: ✓ Acepta response
   └─ Si no tiene: ✗ Bloquea response (CORS error)

EJEMPLO - PERMITIDO
═══════════════════════════════════════════════════════════════════

.env.production:
  CORS_ORIGINS=https://app.vercel.app

Request from https://app.vercel.app
  ✓ Coincide exactamente
  ✓ PERMITIDO

EJEMPLO - RECHAZADO
═══════════════════════════════════════════════════════════════════

.env.production:
  CORS_ORIGINS=https://app.vercel.app

Request from http://localhost:5173
  ✗ NO coincide (diferente protocolo y puerto)
  ✗ RECHAZADO → CORS error

Request from https://otro-sitio.com
  ✗ NO coincide
  ✗ RECHAZADO → CORS error
```

---

## Troubleshooting Visual

```
PROBLEMA: "CORS Blocked"
═══════════════════════════════════════════════════════════════════

Error en navegador:
  Access to XMLHttpRequest from origin 'https://app.vercel.app'
  has been blocked by CORS policy

Causa probable:
  ┌─────────────────────────────────────────────────────────┐
  │ Backend CORS_ORIGINS no incluye tu Vercel URL         │
  └─────────────────────────────────────────────────────────┘

Solución:
  1. En Render/Railway → Settings
  2. Busca: CORS_ORIGINS
  3. Actualiza a: https://tu-app.vercel.app
  4. Redeploy
  5. Intenta de nuevo

PROBLEMA: "API Unreachable"
═══════════════════════════════════════════════════════════════════

Error en navegador:
  Failed to fetch: https://backend.onrender.com/api/pbip/upload

Causa probable:
  ┌─────────────────────────────────────────────────────────┐
  │ Frontend VITE_API_URL es incorrecto             │
  └─────────────────────────────────────────────────────────┘

Solución:
  1. En Vercel → Settings → Environment Variables
  2. Busca: VITE_API_URL
  3. Verifica que sea exacto: https://backend.onrender.com/api
  4. Redeploy
  5. Intenta de nuevo

PROBLEMA: "API Key Invalid"
═══════════════════════════════════════════════════════════════════

Error en Backend:
  Invalid API key for Claude

Causa probable:
  ┌─────────────────────────────────────────────────────────┐
  │ CLAUDE_API_KEY es inválido o incompleto       │
  └─────────────────────────────────────────────────────────┘

Solución:
  1. Ve a console.anthropic.com
  2. Obtén una clave nueva
  3. Copia completa: sk-ant-xxxxx...xxxxx
  4. En Render/Railway → CLAUDE_API_KEY → actualiza
  5. Redeploy
  6. Intenta de nuevo
```

---

## Resumen Arquitectura

```
┌──────────────────────────────────────────────────────────────┐
│                    USUARIO INTERNET                          │
└──────────────────────────────────────────────────────────────┘
                       ↑        ↓
                    HTTPS   HTTPS
                       ↑        ↓
      ┌────────────────┴────────┬─────────────────┐
      │                                            │
┌─────▼────────────────────┐      ┌──────────────▼─────────────┐
│  VERCEL (Frontend)       │      │ RENDER/RAILWAY (Backend)   │
│                          │      │                             │
│ ✓ React + Vite          │      │ ✓ Express.js               │
│ ✓ VITE_API_URL env      │      │ ✓ CORS_ORIGINS env         │
│ ✓ Puerto: 443 (HTTPS)   │      │ ✓ PORT env (dinámico)      │
│ ✓ Público en internet   │      │ ✓ Público en internet      │
│                          │      │                             │
│ Variables:              │      │ Variables:                 │
│ ├─ VITE_API_URL        │      │ ├─ CORS_ORIGINS           │
│ ├─ VITE_CLAUDE_API_KEY │      │ ├─ CLAUDE_API_KEY         │
│ └─ VITE_POWER_BI_*     │      │ └─ POWER_BI_*             │
└────────────────────────┘      └─────────────────────────────┘
```

---

✨ **Arquitectura lista para producción**
