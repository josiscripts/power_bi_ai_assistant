# 🚀 Guía de Inicio Rápido

Sigue estos pasos para tener el proyecto funcionando en 5 minutos.

## 1️⃣ Instalación de Dependencias

```bash
cd c:\Users\josia\Desktop\powerbi-ai-assistant
npm install
```

⏳ Esto descargará todas las dependencias de package.json (~500MB, 2-5 minutos según velocidad de internet)

## 2️⃣ Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# O en Windows PowerShell:
Copy-Item .env.example .env
```

Editar `.env` con tus credenciales:
```
VITE_API_URL=http://localhost:3000/api
VITE_POWER_BI_API_KEY=tu_clave_aqui
VITE_CLAUDE_API_KEY=tu_clave_aqui
```

## 3️⃣ Iniciar Servidor de Desarrollo

```bash
npm run dev
```

✅ La app se abrirá automáticamente en `http://localhost:5173`

## 4️⃣ Verificar que Todo Funciona

La página debe mostrar:
- ✅ Encabezado azul con "Power BI AI Assistant"
- ✅ 5 botones grandes (Gráficos, DAX, Traducciones, Rutas, Filtros)
- ✅ Pie de página oscuro

## 📋 Checklist de Inicio

- [ ] npm install completado sin errores
- [ ] .env creado y configurado
- [ ] npm run dev ejecutándose
- [ ] Página carga en navegador
- [ ] 5 módulos visibles en MainMenu
- [ ] DevTools abierto sin errores de consola

## 🎯 Siguientes Pasos

### Para Desarrolladores Frontend

1. **Abrir proyecto en VS Code**:
   ```bash
   code .
   ```

2. **Instalar extensiones recomendadas**:
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - TypeScript Vue Plugin

3. **Explorar componentes**:
   - Abre `src/App.tsx`
   - Navega a `src/components/Common/MainMenu.tsx`
   - Prueba hacer cambios (hot reload funcionará automáticamente)

### Para Integración con Backend

1. **Asegúrate que tu backend esté corriendo** en `http://localhost:3000`

2. **Verifica endpoints esperados** en `src/services/api.ts`

3. **Usa el hook `useApi`** en tus componentes:
   ```tsx
   const { generateDAX, loading, error } = useApi();
   await generateDAX("Suma de ventas", {});
   ```

### Para Testing

```bash
# Verificar tipos TypeScript
npm run type-check

# Ejecutar ESLint
npm run lint

# Build para producción
npm run build
```

## 🔧 Estructura Rápida

```
src/
├── components/       ← Aquí van los módulos React
├── services/        ← API calls y estado global
├── types/          ← Tipos TypeScript
├── hooks/          ← Hooks personalizados
├── constants/      ← Constantes y enumerados
├── utils/          ← Funciones de utilidad
└── styles/         ← CSS global
```

## 🎨 Componentes Tailwind Listos para Usar

```tsx
// Botón
<button className="btn-primary">Acción</button>

// Tarjeta
<div className="card">Contenido</div>

// Input
<input className="input" placeholder="Escribe..." />

// Badge
<span className="badge-success">Éxito</span>
```

## 🆘 Troubleshooting

### "npm: command not found"
→ Instala Node.js desde https://nodejs.org/

### "Cannot find module 'react'"
```bash
npm install
npm run dev
```

### Puerto 5173 en uso
```bash
# O cambia el puerto en vite.config.ts
npm run dev -- --port 3000
```

### Tailwind no funciona
```bash
# Asegúrate que postcss esté ejecutándose
npm run dev

# Si aún no funciona:
npm install -D tailwindcss postcss autoprefixer
```

## 📚 Recursos Útiles

| Recurso | Enlace |
|---------|--------|
| React Docs | https://react.dev |
| Tailwind CSS | https://tailwindcss.com |
| TypeScript | https://www.typescriptlang.org |
| Zustand | https://github.com/pmndrs/zustand |
| Vite | https://vitejs.dev |
| Axios | https://axios-http.com |

## 🎯 Tu Primera Tarea

Abre `src/components/Common/MainMenu.tsx` y:

1. ✅ Lee el código
2. ✅ Cambia el título de "¿Qué deseas hacer?" a otro texto
3. ✅ Guarda el archivo
4. ✅ Verifica que el cambio aparezca en el navegador (hot reload)

¡Felicidades! Ya estás desarrollando 🎉

## 📞 ¿Necesitas Ayuda?

- Revisa `DEVELOPMENT.md` para guía completa
- Revisa `PROJECT_STRUCTURE.md` para arquitectura
- Consulta el `README.md` para documentación

---

**¡Estás listo para empezar!** 🚀

Tiempo estimado: 5 minutos  
Dificultad: Muy fácil ⭐
