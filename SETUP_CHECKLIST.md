# ✅ Checklist de Configuración para Despliegue en la Nube

## 📦 Archivos Configurados

### ✓ Frontend

#### `.env.production` (NUEVO)
```env
VITE_API_URL=https://tu-backend-url.com/api
VITE_POWER_BI_API_KEY=your_key
VITE_POWER_BI_TENANT_ID=your_tenant_id
VITE_CLAUDE_API_KEY=sk-ant-xxxxx
```
**Ubicación**: Raíz del proyecto
**Propósito**: Configuración de producción para Vercel

---

#### `.env.example` (ACTUALIZADO)
**Ubicación**: Raíz del proyecto
**Propósito**: Plantilla para desarrolladores

---

#### `src/config/index.ts` (SIN CAMBIOS NECESARIOS)
✓ Ya usa `VITE_API_URL` correctamente
✓ Tiene fallback a `http://localhost:3000/api`

---

### ✓ Backend

#### `.env.production` (NUEVO)
```env
PORT=3000
NODE_ENV=production
CORS_ORIGINS=https://tu-frontend.vercel.app
CLAUDE_API_KEY=sk-ant-xxxxx
POWER_BI_API_KEY=your_key
POWER_BI_TENANT_ID=your_tenant_id
LOG_LEVEL=info
```
**Ubicación**: Backend root
**Propósito**: Configuración de producción para Render/Railway

---

#### `.env.example` (ACTUALIZADO)
```env
PORT=3000
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
CLAUDE_API_KEY=your_key
POWER_BI_API_KEY=your_key
POWER_BI_TENANT_ID=your_tenant_id
LOG_LEVEL=debug
```
**Ubicación**: Backend root
**Propósito**: Plantilla actualizada

---

#### `.env` (ACTUALIZADO)
```env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```
**Cambio**: `CORS_ORIGIN` → `CORS_ORIGINS` (con s)
**Propósito**: Soportar múltiples orígenes

---

#### `backend/src/server.ts` (ACTUALIZADO)
**Cambios principales**:
1. ✓ Lectura dinámmica de `CORS_ORIGINS` (soporta múltiples)
2. ✓ Validación de orígenes CORS
3. ✓ Configuración segura de CORS:
   - `credentials: true` para cookies
   - `methods` incluye POST, OPTIONS, etc.
   - `maxAge` de 24 horas
4. ✓ Mensaje de inicio mejorado
5. ✓ Logging de orígenes CORS

**Verificación**:
```bash
npm run build  # ✓ Compila sin errores
```

---

### 📚 Documentación

#### `DEPLOYMENT.md` (NUEVA)
- Guía completa paso a paso
- Instrucciones para Vercel
- Instrucciones para Render
- Instrucciones para Railway
- Troubleshooting

#### `CLOUD_DEPLOYMENT.md` (NUEVA)
- Guía rápida (5 minutos)
- Tabla de variables
- Pasos resumidos

#### `ENV_VARIABLES.md` (NUEVA)
- Referencia completa de variables
- Cómo obtener cada clave
- Flujo de despliegue
- Solución de problemas

---

## 🚀 Pasos Siguientes (Para el Usuario)

### 1. Recopilar Credenciales
- [ ] Claude API Key de [console.anthropic.com](https://console.anthropic.com)
- [ ] Power BI API Key y Tenant ID
- [ ] Credencial de Power BI (si aplica)

### 2. Frontend - Vercel
- [ ] Crear cuenta en [vercel.com](https://vercel.com)
- [ ] Conectar repositorio GitHub
- [ ] Configurar variables de entorno
- [ ] Deploy
- [ ] Obtener URL: `https://...vercel.app`

### 3. Backend - Render (o Railway)
- [ ] Crear cuenta en [render.com](https://render.com)
- [ ] Crear Web Service
- [ ] Conectar repositorio GitHub
- [ ] Configurar variables de entorno:
  - `CORS_ORIGINS=https://tu-frontend.vercel.app`
  - `CLAUDE_API_KEY=sk-ant-xxxxx`
  - Resto de variables
- [ ] Deploy
- [ ] Obtener URL: `https://...onrender.com`

### 4. Conectar Frontend ↔ Backend
- [ ] En Vercel, actualizar `VITE_API_URL` con URL del backend
- [ ] Redeploy en Vercel
- [ ] En Render, ya está configurado `CORS_ORIGINS`

### 5. Probar
- [ ] Verificar `/health` endpoint del backend
- [ ] Probar upload en frontend
- [ ] Verificar logs

---

## 📋 Configuración Automática

### Lo que ya está hecho:
✓ Frontend lee `VITE_API_URL` automáticamente
✓ Backend puerto dinámico: `process.env.PORT || 3000`
✓ Backend CORS dinámico con múltiples orígenes
✓ Validación de orígenes CORS
✓ Fallbacks para desarrollo local

### Lo que el usuario debe hacer:
1. Configurar variables en paneles web (Vercel, Render)
2. Hacer redeploy
3. Actualizar URLs cruzadas (Frontend ↔ Backend)

---

## 🔐 Seguridad

✓ Credenciales NO se comitean en Git
✓ Variables de entorno configuradas en paneles web
✓ CORS valida orígenes exactos
✓ NODE_ENV se cambia a "production" automáticamente
✓ Logging reducido en producción (LOG_LEVEL=info)

---

## 🆘 Si Algo Falla

**Error de CORS**: 
- Actualiza `CORS_ORIGINS` en backend con URL exacta de Vercel
- Redeploy

**Error de API inaccesible**:
- Verifica `VITE_API_URL` en frontend
- Verifica que `/health` funciona en el backend

**Error de credenciales**:
- Verifica que las claves son exactas
- Claude keys empiezan con `sk-ant-`

Ver: [ENV_VARIABLES.md](./ENV_VARIABLES.md) para troubleshooting completo

---

## 📞 Documentación de Referencia

Para despliegues específicos, consulta:

| Pregunta | Ver |
|----------|-----|
| ¿Cómo despliego en Vercel? | [DEPLOYMENT.md](./DEPLOYMENT.md) - Paso 1 |
| ¿Cómo despliego en Render? | [DEPLOYMENT.md](./DEPLOYMENT.md) - Paso 2 Opción A |
| ¿Cómo despliego en Railway? | [DEPLOYMENT.md](./DEPLOYMENT.md) - Paso 2 Opción B |
| ¿Qué variables necesito? | [ENV_VARIABLES.md](./ENV_VARIABLES.md) |
| Resumen rápido | [CLOUD_DEPLOYMENT.md](./CLOUD_DEPLOYMENT.md) |

---

## ✨ Tu Aplicación Está Lista para Producción

Todos los archivos están configurados para:
1. ✓ Variable de entorno dinámica para URL del backend (Frontend)
2. ✓ Puerto dinámico del servidor (Backend)
3. ✓ CORS dinámico y seguro con múltiples orígenes (Backend)
4. ✓ Documentación completa para el despliegue

¡Solo configura las variables en los paneles de Vercel/Render y haz deploy! 🚀
