# Variables de Entorno - Referencia Completa

## 📍 Frontend (Vercel)

### Archivo: `.env.production`

```env
# URL del backend en producción (CRÍTICO)
# SIN la /api al final, se añade automáticamente
VITE_API_URL=https://tu-backend.onrender.com/api

# Power BI
VITE_POWER_BI_API_KEY=your_power_bi_api_key
VITE_POWER_BI_TENANT_ID=your_tenant_id

# Claude API
VITE_CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxx
```

### Cómo configurar en Vercel

1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. **Settings** → **Environment Variables**
3. Agrega cada variable:

| Variable | Valor |
|----------|-------|
| `VITE_API_URL` | `https://backend-url/api` |
| `VITE_CLAUDE_API_KEY` | Tu clave de Claude |
| `VITE_POWER_BI_API_KEY` | Tu clave de Power BI |
| `VITE_POWER_BI_TENANT_ID` | Tu Tenant ID |

4. Redeploy (puede ser automático)

---

## 📍 Backend (Render / Railway)

### Archivo: `.env.production`

```env
# Puerto (automático en Render/Railway)
PORT=3000

# Ambiente
NODE_ENV=production

# CORS - URL de tu frontend en Vercel (CRÍTICO)
# Múltiples orígenes: https://app1.vercel.app,https://app2.vercel.app
CORS_ORIGINS=https://tu-frontend.vercel.app

# Claves de API
CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxx
POWER_BI_API_KEY=your_power_bi_api_key
POWER_BI_TENANT_ID=your_tenant_id

# Logging
LOG_LEVEL=info
```

### Cómo configurar en Render

1. Ve a tu servicio en [render.com](https://render.com)
2. **Settings** → **Environment**
3. Haz clic en "Add Environment Variable"
4. Agrega cada variable:

```
PORT=3000
NODE_ENV=production
CORS_ORIGINS=https://tu-frontend.vercel.app
CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxx
POWER_BI_API_KEY=xxxxx
POWER_BI_TENANT_ID=xxxxx
LOG_LEVEL=info
```

5. Redeploy

### Cómo configurar en Railway

1. Ve a tu proyecto en [railway.app](https://railway.app)
2. Haz clic en el servicio (backend)
3. Tab **Variables**
4. Agrega las variables (igual que Render)
5. Redeploy

---

## 🔄 Flujo de Despliegue

### Primera vez

```
1. Deploy Frontend en Vercel
   → Obtienes: https://app-xyz.vercel.app
   
2. Deploy Backend en Render/Railway
   → Obtienes: https://backend-name.onrender.com
   
3. Actualizar CORS en Backend
   CORS_ORIGINS=https://app-xyz.vercel.app
   → Redeploy
   
4. Actualizar API URL en Frontend
   VITE_API_URL=https://backend-name.onrender.com/api
   → Redeploy
```

### Actualizaciones posteriores

```
Si cambias la URL del frontend:
1. Actualiza CORS_ORIGINS en backend
2. Redeploy backend

Si cambias la URL del backend:
1. Actualiza VITE_API_URL en frontend
2. Redeploy frontend
```

---

## ⚡ Variables Clave

### VITE_API_URL (Frontend)
- **Qué es**: URL base para todas las requests de la API
- **Dónde apunta**: Tu backend en Render/Railway
- **Formato**: `https://backend-url.onrender.com/api` (con `/api`)
- **Ejemplo**: `https://powerbi-api.onrender.com/api`

### CORS_ORIGINS (Backend)
- **Qué es**: Orígenes permitidos para requests desde el navegador
- **Dónde apunta**: Tu frontend en Vercel
- **Formato**: `https://frontend-url.vercel.app` (SIN `/api`)
- **Múltiples**: Separados por coma `https://app1.vercel.app,https://app2.vercel.app`
- **Ejemplo**: `https://powerbi-assistant.vercel.app`

---

## 🔐 Claves de API

### Obtener Claude API Key
1. Ve a [console.anthropic.com](https://console.anthropic.com)
2. **API Keys** → **Create Key**
3. Copia la clave (empieza con `sk-ant-`)

### Obtener Power BI Credentials
1. Ve a [Azure Portal](https://portal.azure.com)
2. App registrations → Crear nueva
3. Obtén: Client ID (API Key) y Tenant ID

---

## ✅ Checklist de Despliegue

- [ ] Frontend deployer en Vercel
- [ ] Obtuve URL de Vercel: `https://...vercel.app`
- [ ] Backend deployer en Render/Railway
- [ ] Obtuve URL de backend: `https://...onrender.com` o `https://...railway.app`
- [ ] Configuré `CORS_ORIGINS` en backend
- [ ] Configuré `VITE_API_URL` en frontend
- [ ] Ambos redeployed
- [ ] Test: `curl https://backend/health` funciona
- [ ] Test: Upload en frontend funciona

---

## 🚨 Solución de Problemas

### "CORS blocked"
```
Error: Access to XMLHttpRequest from origin 'https://app.vercel.app' 
       has been blocked by CORS policy
```

**Solución**:
1. Verifica que `CORS_ORIGINS` en backend = URL de Vercel
2. Sin protocolo de desarrollo (`http://`) en producción
3. Redeploy backend después de cambiar

### "API unreachable"
```
Error: Failed to fetch from https://backend/api
```

**Solución**:
1. Verifica que `VITE_API_URL` es correcto
2. Verifica que el backend está online (`/health` funciona)
3. Sin espacios en las URLs

### "API Key invalid"
```
Error: Invalid API key
```

**Solución**:
1. Verifica que la clave es correcta
2. Claude: Debe empezar con `sk-ant-`
3. No olvides copiar la clave completa

---

## 📝 Notas

- Las variables de `.env.production` NO se comitean en Git
- Configura todo en los paneles web de Vercel/Render
- Los redeploys automáticos detectan cambios en variables
- Las URLs DEBEN ser HTTPS en producción (no HTTP)

---

**Para más detalles, ver:** [DEPLOYMENT.md](./DEPLOYMENT.md)
