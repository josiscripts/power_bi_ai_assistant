# ⚠️ SECURITY WARNING - IMPORTANTE

## 🔑 API Keys Management

### API Key Compartida
⚠️ **ALERTA**: Una API key de Claude fue compartida en texto plano.

**Acción Requerida**:
1. ✅ Revocar inmediatamente esta key en Claude/Anthropic
2. ✅ Generar una nueva key
3. ✅ Actualizar los archivos `.env` locales

---

## 🛡️ Mejores Prácticas de Seguridad

### ❌ NUNCA HAGAS ESTO
```bash
# ❌ NO comitear keys a GitHub
git commit .env              # PELIGRO
git push origin main         # PELIGRO

# ❌ NO poner keys en código
const API_KEY = "sk-ant-..."
```

### ✅ SIEMPRE HAZ ESTO
```bash
# ✅ Usar archivos .env locales (ignorados en .gitignore)
CLAUDE_API_KEY=sk-ant-...   # En .env local

# ✅ Usar variables de entorno en CI/CD
export CLAUDE_API_KEY=${{ secrets.CLAUDE_API_KEY }}

# ✅ Rotar keys regularmente
# Cambiar keys cada 90 días mínimo
```

---

## 📁 Archivos de Configuración

### `.env` (NO versionado ❌)
```
.env              # Local development
.env.local        # Override local
.env.production   # Production (solo local)
```

### `.env.example` (Versionado ✅)
```
.env.example                # Template (sin keys reales)
backend/.env.example        # Template backend
```

---

## 🚀 Setup Local Correcto

### 1. Crear `.env` local
```bash
cp .env.example .env
# Editar .env con tus keys
```

### 2. Verificar `.gitignore`
```
.env              ✓ Ignorado
.env.local        ✓ Ignorado
backend/.env      ✓ Ignorado
```

### 3. Verificar que NO se comitee
```bash
git status              # No debe mostrar .env
git diff --cached       # No debe mostrar keys
```

---

## 🔐 Rotation de Keys

### Cada 90 días:
1. Generar key nueva en Claude/Anthropic
2. Actualizar `.env` local
3. Revocar key antigua
4. Verificar todas las aplicaciones usan key nueva

### Si se expone una key:
1. **INMEDIATAMENTE** revocar la key
2. Generar key nueva
3. Actualizar en todos los lugares
4. Verificar logs por acceso no autorizado

---

## 🚨 Checklist de Seguridad

Antes de cada commit:
- [ ] No hay keys en código
- [ ] `git status` no muestra `.env`
- [ ] `git diff --cached` no muestra secrets
- [ ] `.gitignore` contiene todas las rutas `.env`
- [ ] Commits no incluyen cualquier key

Antes de push a producción:
- [ ] Environment variables en CI/CD configuradas
- [ ] Secrets en GitHub/Vercel configurados
- [ ] Nunca usar `.env` file en producción
- [ ] Logs no muestran keys

---

## 📝 Para Este Proyecto

### Archivos Creados (Locales - NO versionados)
```
✅ .env                    # Frontend keys (local)
✅ backend/.env            # Backend keys (local)
✓ .gitignore actualizado   # Ignora ambos .env
```

### Setup Completado
```bash
# Frontend
cd .
npm install
# .env ya tiene CLAUDE_API_KEY

# Backend
cd backend
npm install
# .env ya tiene CLAUDE_API_KEY

# Run
npm run dev      # Frontend
npm run dev      # Backend (otra terminal)
```

---

## 🔑 Donde Guardar Keys en Producción

### GitHub Actions
```yaml
secrets:
  CLAUDE_API_KEY: ${{ secrets.CLAUDE_API_KEY }}
```

### Vercel
```
Settings → Environment Variables → CLAUDE_API_KEY
```

### Docker
```yaml
services:
  backend:
    environment:
      CLAUDE_API_KEY: ${CLAUDE_API_KEY}
```

---

## ✨ Estado de Seguridad

| Item | Status |
|------|--------|
| `.env` creado | ✅ |
| `.gitignore updated` | ✅ |
| Keys en archivo local | ✅ |
| No commiteado | ✅ |
| Ready para desarrollo | ✅ |

---

## 🚀 Próximos Pasos

1. **Revocar la key compartida** (si fue accidental)
2. **Generar nueva key** en Claude/Anthropic
3. **Actualizar `.env`** locales
4. **Verificar setup** correcto
5. **Comenzar desarrollo**

---

**Recuerda**: La seguridad es responsabilidad de todos. Nunca comparte keys, tokens o secrets en público. ⚠️

**Última actualización**: 29 de Mayo de 2026
