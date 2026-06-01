# Despliegue en la Nube - Guía Rápida

## 🎯 Resumen de Configuración

| Componente | Plataforma | Variable de Entorno | Valor Ejemplo |
|-----------|-----------|-------------------|--|
| **Frontend** | Vercel | `VITE_API_URL` | `https://api.railway.app/api` |
| **Backend** | Render/Railway | `PORT` | `3000` (automático) |
| **Backend** | Render/Railway | `CORS_ORIGINS` | `https://app.vercel.app` |
| **Backend** | Render/Railway | `CLAUDE_API_KEY` | `sk-ant-xxxxx` |

---

## ⚡ Pasos Rápidos

### 1️⃣ Frontend - Vercel (5 min)

```bash
# Push a GitHub
git push origin main

# En vercel.com:
# 1. Conecta tu repositorio
# 2. Configura variables de entorno:
VITE_API_URL=https://backend-url.railway.app/api
VITE_CLAUDE_API_KEY=sk-ant-xxxxx
VITE_POWER_BI_API_KEY=xxxxx
VITE_POWER_BI_TENANT_ID=xxxxx

# 3. Deploy automáticamente
```

**Resultado**: `https://tu-app-xyz.vercel.app`

---

### 2️⃣ Backend - Render (5 min)

```bash
# En render.com:
# 1. "New Web Service" → Conecta GitHub
# 2. Build Command: npm install && npm run build
# 3. Start Command: npm start
# 4. Configura variables:

PORT=3000
NODE_ENV=production
CORS_ORIGINS=https://tu-app-xyz.vercel.app
CLAUDE_API_KEY=sk-ant-xxxxx
POWER_BI_API_KEY=xxxxx
POWER_BI_TENANT_ID=xxxxx
LOG_LEVEL=info

# 5. Deploy automáticamente
```

**Resultado**: `https://backend-name.onrender.com`

---

### 3️⃣ Conectar Frontend ↔ Backend (1 min)

**En Vercel**, actualiza `VITE_API_URL`:
```
VITE_API_URL=https://backend-name.onrender.com/api
```

Redeploy automáticamente.

---

## 🔧 Archivos de Configuración

### Frontend
```
.env.production
├─ VITE_API_URL=https://backend-url/api
├─ VITE_CLAUDE_API_KEY=...
├─ VITE_POWER_BI_API_KEY=...
└─ VITE_POWER_BI_TENANT_ID=...
```

### Backend
```
.env.production
├─ PORT=3000 (automático)
├─ NODE_ENV=production
├─ CORS_ORIGINS=https://vercel-url
├─ CLAUDE_API_KEY=...
├─ POWER_BI_API_KEY=...
├─ POWER_BI_TENANT_ID=...
└─ LOG_LEVEL=info
```

---

## ✅ Verificación

### Probar Backend
```bash
curl https://backend-url/health
# Debe retornar: {"status":"OK",...}
```

### Probar Frontend
1. Abre https://tu-app.vercel.app
2. Intenta subir un archivo PBIP
3. Verifica en logs del backend que recibió la request

---

## 🚨 Errores Comunes

| Error | Causa | Solución |
|------|-------|---------|
| CORS bloqueado | Backend no permite origen | Actualiza `CORS_ORIGINS` con URL de Vercel |
| API Key inválida | Clave expirada o incorrecta | Verifica en consola de Anthropic |
| Upload falla | Backend no accesible | Verifica URL en `VITE_API_URL` |

---

## 📊 URLs Finales

Después de desplegar:

- **Frontend**: https://tu-app-xyz.vercel.app
- **Backend API**: https://backend-name.onrender.com/api
- **Health Check**: https://backend-name.onrender.com/health

---

**¡Listo para producción!** 🚀
