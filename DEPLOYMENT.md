# Guía de Despliegue en la Nube

Esta guía te ayudará a desplegar la aplicación Power BI AI Assistant en producción.

## 📋 Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     Vercel (Frontend)                       │
│                   https://app.vercel.app                    │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS
                               ↓
┌─────────────────────────────────────────────────────────────┐
│             Render/Railway (Backend API)                    │
│                 https://api.railway.app                     │
│           Procesa archivos PBIP y analiza relaciones        │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Paso 1: Preparar el Frontend (Vercel)

### 1.1 Requisitos previos
- Cuenta en [Vercel](https://vercel.com) (gratis)
- Repositorio GitHub con el código del proyecto

### 1.2 Configuración en Vercel

1. **Conecta tu repositorio GitHub**
   - Ve a vercel.com y haz clic en "New Project"
   - Selecciona tu repositorio

2. **Configura las variables de entorno**
   
   En las configuraciones del proyecto, agrega:
   
   ```
   VITE_API_URL=https://tu-backend-url.com/api
   VITE_POWER_BI_API_KEY=tu_clave_api_power_bi
   VITE_POWER_BI_TENANT_ID=tu_tenant_id
   VITE_CLAUDE_API_KEY=tu_clave_api_claude
   ```

3. **Configura el build**
   
   - Framework: **Other**
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Deploy**
   - Haz clic en "Deploy"
   - Una vez completado, tendrás una URL como: `https://tu-app-xyz.vercel.app`

### 1.3 Nota importante
Después del despliegue, toma nota de tu URL de Vercel:
```
https://tu-app-xyz.vercel.app
```
La usarás para configurar el CORS del backend.

---

## 🛠️ Paso 2: Preparar el Backend (Render o Railway)

### Opción A: Despliegue en Render

#### 2A.1 Preparar el repositorio

1. Asegúrate de que tu backend esté en la raíz del repositorio o en una carpeta `/backend`
2. Si está en `/backend`, configura en Render:
   - **Root Directory**: `backend`

#### 2A.2 Crear el servicio en Render

1. Ve a [render.com](https://render.com) y crea una cuenta
2. Haz clic en "New +" → "Web Service"
3. Conecta tu repositorio GitHub
4. Configura:
   - **Name**: `powerbi-ai-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (o Paid según necesidad)

#### 2A.3 Configurar variables de entorno

En la sección de "Environment", agrega:

```
PORT=3000
NODE_ENV=production
CORS_ORIGINS=https://tu-app-xyz.vercel.app
CLAUDE_API_KEY=tu_clave_api_claude
POWER_BI_API_KEY=tu_clave_api_power_bi
POWER_BI_TENANT_ID=tu_tenant_id
LOG_LEVEL=info
```

#### 2A.4 Deploy

- Haz clic en "Create Web Service"
- Render desplegará automáticamente
- Obtén tu URL (algo como): `https://powerbi-ai-backend.onrender.com`

---

### Opción B: Despliegue en Railway

#### 2B.1 Preparar el repositorio

1. Asegúrate de que tu backend esté en la raíz o en `/backend`
2. Railway detectará automáticamente el tipo de proyecto

#### 2B.2 Crear el servicio en Railway

1. Ve a [railway.app](https://railway.app) y crea una cuenta
2. Haz clic en "New Project"
3. Selecciona "Deploy from GitHub"
4. Conecta tu repositorio
5. Railway detectará automáticamente que es un proyecto Node.js

#### 2B.3 Configurar variables de entorno

En los settings del proyecto, agrega:

```
PORT=3000
NODE_ENV=production
CORS_ORIGINS=https://tu-app-xyz.vercel.app
CLAUDE_API_KEY=tu_clave_api_claude
POWER_BI_API_KEY=tu_clave_api_power_bi
POWER_BI_TENANT_ID=tu_tenant_id
LOG_LEVEL=info
```

#### 2B.4 Deploy

- Railway desplegará automáticamente
- Obtén tu URL desde el dashboard

---

## 🔗 Paso 3: Conectar Frontend y Backend

### 3.1 Actualizar Vercel con la URL del Backend

Una vez que tengas la URL del backend (Render o Railway):

1. Ve a tu proyecto en Vercel
2. Haz clic en "Settings" → "Environment Variables"
3. Actualiza `VITE_API_URL`:

```
VITE_API_URL=https://tu-backend-url.railway.app/api
```
o
```
VITE_API_URL=https://powerbi-ai-backend.onrender.com/api
```

4. Redeploy el proyecto (o será automático si usas Git push)

### 3.2 Actualizar Backend con URL de Vercel

1. En tu plataforma de despliegue (Render/Railway)
2. Actualiza `CORS_ORIGINS` con tu URL de Vercel:

```
CORS_ORIGINS=https://tu-app-xyz.vercel.app
```

3. Redeploy

---

## 🧪 Paso 4: Probar la Conexión

### 4.1 Verificar que el backend está funcionando

Abre en el navegador:
```
https://tu-backend-url.com/health
```

Deberías ver:
```json
{
  "status": "OK",
  "timestamp": "2026-06-01T...",
  "uptime": 123.45
}
```

### 4.2 Probar upload de archivos

1. Ve a https://tu-app-xyz.vercel.app
2. Intenta subir un archivo PBIP
3. Verifica que el upload funciona sin errores CORS

### 4.3 Verificar logs

**En Render/Railway**:
- Ve al dashboard de tu servicio
- Abre la sección de "Logs"
- Deberías ver logs de requests exitosos

---

## 🔐 Configuración de Producción

### Variables sensibles

**NUNCA** commits credenciales al repositorio. En su lugar:

1. **Vercel**: Usa el panel de Environment Variables
2. **Render/Railway**: Usa sus paneles de configuración
3. **GitHub Secrets** (opcional): Para automatización

### Ejemplo seguro de .env en desarrollo

```bash
# .env.local (no comitear)
VITE_API_URL=http://localhost:3000/api
VITE_CLAUDE_API_KEY=sk-ant-xxxxx

# .env.production (plantilla, sin valores)
VITE_API_URL=https://api.produccion.com/api
```

---

## 📊 Monitoreo

### Render
- Dashboard muestra uptime y últimas requests
- Logs disponibles en tiempo real

### Railway
- Gráficos de CPU y memoria
- Historial de deployments

### Vercel
- Analytics de performance
- Logs de función (si usas serverless)

---

## 🚨 Troubleshooting

### Error de CORS
**Síntoma**: "Access to XMLHttpRequest blocked by CORS policy"

**Solución**:
1. Verifica que `CORS_ORIGINS` en el backend incluya tu URL de Vercel
2. Asegúrate de que sea HTTPS en producción
3. No olvides redeploy después de cambiar variables

### Error de puerto
**Síntoma**: "Port 3000 is already in use"

**Solución**:
- Render/Railway asignan puertos automáticamente
- No hardcodees el puerto, usa `process.env.PORT`
- Verifica que el código use `PORT` dinámicamente

### Error de API Key
**Síntoma**: "Invalid API key for Claude"

**Solución**:
1. Verifica que la clave sea correcta en el panel de variables
2. Copia desde https://console.anthropic.com
3. No olvides el prefijo `sk-ant-`

### Archivos no se guardan
**Síntoma**: "File not found after upload"

**Solución**:
- En Render/Railway, los archivos se guardan en `/tmp` durante despliegue gratuito
- Para guardar permanentemente, usa un servicio de storage (AWS S3, etc.)
- O usa plan pagado que mantiene el filesystem

---

## 📈 Escalado futuro

### Si necesitas más capacidad:

**Frontend**:
- Vercel maneja escalado automáticamente

**Backend**:
- **Render**: Upgrade a plan pagado
- **Railway**: Agrega recursos (CPU/RAM)
- Considera usar base de datos en la nube (MongoDB Atlas, etc.)

---

## ✅ Checklist de Despliegue

- [ ] Frontend desplegado en Vercel
- [ ] Backend desplegado en Render/Railway
- [ ] Variables de entorno configuradas correctamente
- [ ] CORS_ORIGINS apunta a URL de Vercel
- [ ] VITE_API_URL apunta a URL del backend
- [ ] Test de health check (/health) exitoso
- [ ] Test de upload de archivo exitoso
- [ ] Logs muestran requests sin errores
- [ ] HTTPS funciona en ambos
- [ ] Dominio personalizado (opcional)

---

## 🆘 Soporte

Si tienes problemas:

1. Revisa los logs en tu plataforma (Render/Railway)
2. Verifica que todas las variables de entorno estén presentes
3. Asegúrate que las URLs no tengan typos
4. Prueba con `/health` antes de subir archivos
5. Usa herramientas como Postman para probar la API

---

**¡Ahora tu aplicación está lista en producción!** 🎉
