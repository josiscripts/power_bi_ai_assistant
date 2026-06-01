# 📁 Estructura de Archivos Configurados para Despliegue

## 📦 Proyecto Root

```
powerbi-ai-assistant/
├── 📄 .env                          (Desarrollo local)
│   ├─ VITE_API_URL=http://localhost:3000/api
│   └─ Otras variables de desarrollo
│
├── 📄 .env.example                  (Template para desarrolladores)
│   └─ Variables de referencia
│
├── 📄 .env.production              ✨ NUEVO - Producción (Vercel)
│   ├─ VITE_API_URL=https://backend-url.com/api  ← Cambiar aquí
│   ├─ VITE_CLAUDE_API_KEY=sk-ant-xxxxx
│   ├─ VITE_POWER_BI_API_KEY=xxxxx
│   └─ VITE_POWER_BI_TENANT_ID=xxxxx
│
├── 📄 vite.config.ts               (Config de build - sin cambios)
├── 📄 tsconfig.json                (TypeScript - sin cambios)
├── 📄 package.json                 (Dependencias - sin cambios)
│
├── 📄 DEPLOYMENT.md               ✨ NUEVO - Guía completa de despliegue
├── 📄 CLOUD_DEPLOYMENT.md         ✨ NUEVO - Guía rápida (5 min)
├── 📄 ENV_VARIABLES.md            ✨ NUEVO - Referencia técnica
├── 📄 SETUP_CHECKLIST.md          ✨ NUEVO - Checklist de configuración
├── 📄 FILES_CONFIGURED.md         ✨ NUEVO - Este archivo
│
└── 📁 src/
    ├── config/
    │   └── index.ts               (Lee VITE_API_URL automáticamente)
    │
    ├── services/
    │   ├── api.ts                 (Usa config.api.baseURL)
    │   └── ... (servicios)
    │
    ├── components/
    │   └── ModuloAnalisisPBIX/
    │       ├── PBIXUploader.tsx    (Upload de archivos)
    │       └── AutoRepairWizard.tsx (Wizard de reparación)
    │
    └── ... (resto del código)
```

---

## 🔧 Backend

```
backend/
├── 📄 .env                         (Desarrollo local)
│   ├─ PORT=3000
│   ├─ NODE_ENV=development
│   ├─ CORS_ORIGINS=http://localhost:5173,http://localhost:3000
│   └─ Otras variables
│
├── 📄 .env.example                 (Template - ACTUALIZADO)
│   └─ Incluye CORS_ORIGINS
│
├── 📄 .env.production             ✨ NUEVO - Producción (Render/Railway)
│   ├─ PORT=3000
│   ├─ NODE_ENV=production
│   ├─ CORS_ORIGINS=https://tu-app.vercel.app  ← Cambiar aquí
│   ├─ CLAUDE_API_KEY=sk-ant-xxxxx
│   ├─ POWER_BI_API_KEY=xxxxx
│   ├─ POWER_BI_TENANT_ID=xxxxx
│   └─ LOG_LEVEL=info
│
├── 📄 package.json                (Dependencias - sin cambios)
├── 📄 tsconfig.json               (TypeScript - sin cambios)
│
└── 📁 src/
    ├── server.ts                 ✨ ACTUALIZADO - CORS dinámico mejorado
    │   ├─ Lee CORS_ORIGINS desde env
    │   ├─ Soporta múltiples orígenes
    │   ├─ Validación segura de orígenes
    │   └─ Puerto dinámico: process.env.PORT
    │
    ├── services/
    │   ├── pbipService.ts        (Procesa archivos PBIP)
    │   ├── relationshipAnalysisService.ts (Análisis con IA)
    │   └── claudeService.ts      (Integración con Claude)
    │
    ├── controllers/
    │   ├── pbipController.ts
    │   └── relationshipRepairController.ts
    │
    └── types/
        └── index.ts              (Tipos TypeScript)
```

---

## 🔑 Variables Críticas para Cambiar

### Antes de desplegar en Vercel - Frontend

Archivo: `.env.production`

```bash
# CAMBIAR ESTA LÍNEA con la URL de tu backend
VITE_API_URL=https://tu-backend-url.onrender.com/api
           ↑ Tu URL aquí (incluir /api)

# Estas también, obtén de tus servicios
VITE_CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxx
VITE_POWER_BI_API_KEY=tu_clave_api
VITE_POWER_BI_TENANT_ID=tu_tenant_id
```

### Antes de desplegar en Render/Railway - Backend

Archivo: `.env.production` (Backend)

```bash
# CAMBIAR ESTA LÍNEA con la URL de Vercel
CORS_ORIGINS=https://tu-app-xyz.vercel.app
         ↑ Tu URL aquí (SIN /api)

# Estas también
CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxx
POWER_BI_API_KEY=tu_clave_api
POWER_BI_TENANT_ID=tu_tenant_id
```

---

## ✅ Checklist de Archivos

### Frontend
- [ ] `.env.production` - Contiene VITE_API_URL para producción
- [ ] `src/config/index.ts` - Lee VITE_API_URL automáticamente
- [ ] Compilación: `npm run build` ✓

### Backend  
- [ ] `backend/.env.production` - Contiene CORS_ORIGINS para producción
- [ ] `backend/src/server.ts` - CORS dinámico mejorado
- [ ] `backend/.env` - Actualizado a CORS_ORIGINS (plural)
- [ ] `backend/.env.example` - Actualizado con nuevas variables
- [ ] Compilación: `npm run build` ✓

### Documentación
- [ ] `DEPLOYMENT.md` - Guía paso a paso (30+ min)
- [ ] `CLOUD_DEPLOYMENT.md` - Guía rápida (5 min)
- [ ] `ENV_VARIABLES.md` - Referencia técnica
- [ ] `SETUP_CHECKLIST.md` - Checklist de configuración
- [ ] `FILES_CONFIGURED.md` - Este archivo

---

## 🚀 Flujo de Despliegue

```
1. Preparar Credenciales
   ├─ Claude API Key
   ├─ Power BI API Key
   └─ Power BI Tenant ID

2. Desplegar en Vercel (Frontend)
   ├─ Conectar GitHub
   ├─ Configurar .env.production
   ├─ Deploy automático
   └─ Obtener URL: https://app-xyz.vercel.app

3. Desplegar en Render/Railway (Backend)
   ├─ Conectar GitHub
   ├─ Configurar .env.production
   ├─ Deploy automático
   └─ Obtener URL: https://backend.onrender.com

4. Conectar Frontend → Backend
   ├─ Actualizar VITE_API_URL en Vercel
   ├─ Apuntar a: https://backend.onrender.com/api
   └─ Redeploy en Vercel

5. Verificar Conexión
   ├─ curl https://backend/health ✓
   ├─ Probar upload en frontend ✓
   └─ Revisar logs ✓
```

---

## 🔐 Archivos NO Commiteados

Estos archivos contienen credenciales y NO deben estar en Git:

```
❌ .env.production       (variables secretas)
❌ .env.local            (desarrollo local)
❌ backend/.env.production (variables secretas)

✓ .gitignore debe incluir:
  *.local
  .env.production
  .env.local
```

Verifica tu `.gitignore`:

```bash
# Debe tener:
.env.local
.env.production
.env*.local
```

---

## 📊 Cambios Realizados Resumen

| Archivo | Cambio | Razón |
|---------|--------|-------|
| `src/config/index.ts` | Ya usa VITE_API_URL | ✓ Sin cambios necesarios |
| `.env.production` | NUEVO | Para Vercel producción |
| `backend/src/server.ts` | CORS dinámico mejorado | Soportar múltiples orígenes |
| `backend/.env` | CORS_ORIGINS → plural | Múltiples orígenes |
| `backend/.env.example` | ACTUALIZADO | Documentar new CORS_ORIGINS |
| `backend/.env.production` | NUEVO | Para Render/Railway |
| `DEPLOYMENT.md` | NUEVO | Guía completa |
| `CLOUD_DEPLOYMENT.md` | NUEVO | Guía rápida |
| `ENV_VARIABLES.md` | NUEVO | Referencia técnica |
| `SETUP_CHECKLIST.md` | NUEVO | Checklist |

---

## 🎯 Lo que hace cada archivo de configuración

### Frontend `.env.production`
- Se usa cuando Vercel deploya en producción
- `VITE_API_URL` dice dónde está el backend
- Las requests del navegador van a esa URL

### Backend `.env.production`
- Se usa cuando Render/Railway deploya en producción
- `CORS_ORIGINS` dice qué frontend puede hacer requests
- `PORT` se asigna automáticamente

### Sincronización
```
Frontend .env.production:
  VITE_API_URL = URL del backend
                ↓
        Usado en requests
                ↓
        Va a /api/pbip/*

Backend .env.production:
  CORS_ORIGINS = URL del frontend
                ↓
        Valida requests
                ↓
        Si no coincide, rechaza
```

**Deben coincidir:**
- Frontend: `VITE_API_URL=https://backend.com/api`
- Backend: `CORS_ORIGINS=https://frontend.com`

---

## 🧪 Verificación Post-Deploy

```bash
# 1. Verificar backend está online
curl https://tu-backend.onrender.com/health

# 2. Debe retornar
{
  "status": "OK",
  "timestamp": "2026-06-01T...",
  "uptime": 123.45
}

# 3. Probar desde navegador
https://tu-app.vercel.app
- Intenta cargar archivo
- Debe funcionar sin errores CORS

# 4. Verificar logs
- En Render: Dashboard → Logs
- En Railway: Dashboard → Logs
- Debe ver requests POST exitosas
```

---

## 📞 Si Algo Falla

Ver: [ENV_VARIABLES.md](./ENV_VARIABLES.md#-solución-de-problemas)

Problemas más comunes:
1. **CORS bloqueado** → Actualizar CORS_ORIGINS
2. **API inaccesible** → Verificar VITE_API_URL
3. **Credenciales inválidas** → Verificar claves de API

---

✅ **Todos los archivos están configurados y listos para producción**
