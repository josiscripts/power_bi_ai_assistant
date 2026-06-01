# 🚀 Despliegue en la Nube - Punto de Inicio

Bienvenido. Esta guía te ayudará a desplegar **Power BI AI Assistant** en producción.

---

## ⚡ Inicio Rápido (5 minutos)

Si tienes prisa, lee esto primero:

**[CLOUD_DEPLOYMENT.md](./CLOUD_DEPLOYMENT.md)** - Guía de 5 minutos
- Tabla resumen de variables
- 3 pasos principales
- Urls finales

---

## 📚 Documentación Completa

### 1. **[DEPLOYMENT.md](./DEPLOYMENT.md)** ⭐ RECOMENDADO
Guía paso a paso completa (30 minutos)

**Contiene:**
- Explicación de arquitectura
- Pasos detallados para Vercel
- Pasos detallados para Render
- Pasos detallados para Railway
- Troubleshooting completo
- Monitoreo y escalado

**Cuándo leer:** Antes de tu primer despliegue

---

### 2. **[ENV_VARIABLES.md](./ENV_VARIABLES.md)**
Referencia técnica de variables (detallada)

**Contiene:**
- Todas las variables de entorno
- Valores de ejemplo
- Cómo obtener cada credencial
- Flujo de despliegue
- Sincronización de URLs
- Solución de problemas

**Cuándo leer:** Cuando configures variables en Vercel/Render

---

### 3. **[ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)**
Diagramas y flujos visuales

**Contiene:**
- Diagrama general de arquitectura
- Flujo de upload de archivo
- Flujo de variables de entorno
- Sincronización de URLs
- Validación CORS explicada
- Troubleshooting visual

**Cuándo leer:** Para entender cómo funciona todo junto

---

### 4. **[FILES_CONFIGURED.md](./FILES_CONFIGURED.md)**
Estructura de archivos configurados

**Contiene:**
- Árbol de carpetas del proyecto
- Qué archivos se modificaron
- Variables críticas a cambiar
- Archivos NO que no se commitean
- Cambios realizados (resumen)

**Cuándo leer:** Para saber exactamente qué cambió

---

### 5. **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)**
Checklist de configuración

**Contiene:**
- Qué archivos se crearon
- Qué debe hacer el usuario
- Checklist de despliegue
- Documentación de referencia

**Cuándo leer:** Para verificar que todo está listo

---

## 🎯 Flujo Recomendado

```
1. Lee esta página (README_DEPLOYMENT.md)
   ↓
2. Lee CLOUD_DEPLOYMENT.md (5 min, visión general)
   ↓
3. Lee DEPLOYMENT.md (30 min, pasos detallados)
   ↓
4. Mientras despliegas, abre ENV_VARIABLES.md
   ↓
5. Si algo falla, consulta ARCHITECTURE_DIAGRAM.md
```

---

## 🚀 Pasos Principales

### Paso 1: Reunir Credenciales
```
□ Claude API Key (console.anthropic.com)
□ Power BI API Key (Azure Portal)
□ Power BI Tenant ID (Azure Portal)
```

### Paso 2: Frontend (Vercel)
```
□ Crear cuenta en vercel.com
□ Conectar repositorio GitHub
□ Configurar variables:
  - VITE_API_URL (URL del backend)
  - VITE_CLAUDE_API_KEY
  - VITE_POWER_BI_API_KEY
  - VITE_POWER_BI_TENANT_ID
□ Deploy
□ Obtener URL (https://app-xyz.vercel.app)
```

### Paso 3: Backend (Render o Railway)
```
□ Crear cuenta en render.com (o railway.app)
□ Crear Web Service
□ Conectar repositorio GitHub
□ Configurar variables:
  - CORS_ORIGINS = URL de Vercel (CRÍTICO)
  - CLAUDE_API_KEY
  - POWER_BI_API_KEY
  - POWER_BI_TENANT_ID
  - Resto de variables
□ Deploy
□ Obtener URL (https://backend.onrender.com)
```

### Paso 4: Sincronizar
```
□ Frontend: Actualizar VITE_API_URL con URL del backend
□ Redeploy en Vercel
□ Verificar conexión
```

---

## 📁 Archivos Nuevos Creados

| Archivo | Descripción | Quién lo configura |
|---------|------------|-------------------|
| `.env.production` (frontend) | Config de Vercel | Vercel (panel web) |
| `backend/.env.production` | Config de Render/Railway | Render/Railway (panel web) |
| `DEPLOYMENT.md` | Guía paso a paso | Referencia |
| `CLOUD_DEPLOYMENT.md` | Guía rápida | Referencia |
| `ENV_VARIABLES.md` | Variables técnicas | Referencia |
| `SETUP_CHECKLIST.md` | Checklist | Referencia |
| `ARCHITECTURE_DIAGRAM.md` | Diagramas | Referencia |
| `FILES_CONFIGURED.md` | Estructura | Referencia |
| `README_DEPLOYMENT.md` | Este archivo | Referencia |

---

## 🔧 Lo Que Ya Está Configurado

### Frontend
✓ Variable `VITE_API_URL` lee desde entorno
✓ `src/config/index.ts` usa variable correctamente
✓ Fallback a localhost para desarrollo
✓ Archivo `.env.production` creado

### Backend
✓ Puerto dinámico: `process.env.PORT`
✓ CORS dinámico: lee `CORS_ORIGINS`
✓ Soporta múltiples orígenes
✓ Validación segura de CORS
✓ Archivo `backend/.env.production` creado
✓ Ambos compilados sin errores

---

## 🆘 Ayuda Rápida

### "No sé por dónde empezar"
→ Lee [DEPLOYMENT.md](./DEPLOYMENT.md) de principio a fin

### "Necesito una lista de pasos"
→ Lee [CLOUD_DEPLOYMENT.md](./CLOUD_DEPLOYMENT.md)

### "¿Qué variables necesito?"
→ Lee [ENV_VARIABLES.md](./ENV_VARIABLES.md)

### "¿Cómo funciona la arquitectura?"
→ Lee [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)

### "¿Qué cambió exactamente?"
→ Lee [FILES_CONFIGURED.md](./FILES_CONFIGURED.md)

### "¿Cómo verifico que está todo listo?"
→ Lee [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)

### "Tengo error CORS"
→ Ver sección Troubleshooting en [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)

### "Tengo error de credenciales"
→ Ver sección "API Key invalid" en [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)

---

## ⏱️ Tiempo Estimado

| Tarea | Tiempo |
|-------|--------|
| Leer documentación | 45 min |
| Preparar credenciales | 15 min |
| Desplegar Frontend | 5 min |
| Desplegar Backend | 5 min |
| Verificación final | 5 min |
| **TOTAL** | **75 min** |

---

## 🎯 URL Finales que Obtendrás

Después de desplegar:

```
Frontend (Vercel):
  https://tu-app-xyz.vercel.app

Backend API (Render):
  https://tu-backend.onrender.com/api

Backend Health Check:
  https://tu-backend.onrender.com/health
```

---

## ✅ Verificación Post-Deploy

```bash
# 1. Verificar backend online
curl https://tu-backend.onrender.com/health

# Debe retornar:
{
  "status": "OK",
  "timestamp": "2026-06-01T...",
  "uptime": 123.45
}

# 2. Probar en navegador
Abre: https://tu-app.vercel.app
- Carga página ✓
- Intenta subir archivo PBIP ✓
- Verifica en logs backend que recibió request ✓
```

---

## 🔐 Seguridad

✓ Credenciales NO se commitean en Git
✓ Variables configuradas en paneles web
✓ CORS solo permite frontend autenticado
✓ HTTPS obligatorio en producción
✓ Validación de orígenes

---

## 📞 Contacto / Soporte

Si tienes dudas:

1. Verifica [ENV_VARIABLES.md](./ENV_VARIABLES.md) - Solución de problemas
2. Revisa logs en Vercel/Render
3. Consulta [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)
4. Lee [DEPLOYMENT.md](./DEPLOYMENT.md) nuevamente

---

## 🎓 Recursos Externos

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)
- [CORS Explicado](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

## 🎉 ¡Listo!

Tu aplicación está completamente configurada para despliegue en la nube.

**Próximo paso:** Abre [DEPLOYMENT.md](./DEPLOYMENT.md) y comienza 🚀

---

*Última actualización: 2026-06-01*
*Versión: 1.0.0*
