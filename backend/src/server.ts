import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import multer from 'multer';

// Controllers
import * as graphicController from '@controllers/graphicController';
import * as daxController from '@controllers/daxController';
import * as translationController from '@controllers/translationController';
import * as routeController from '@controllers/routeController';
import * as filterController from '@controllers/filterController';
import * as pbipController from '@controllers/pbipController';
import * as relationshipRepairController from '@controllers/relationshipRepairController';
import * as dataController from '@controllers/dataController';

// Multer para upload de archivos
const uploadDir = './uploads';
const storage = multer.diskStorage({
  destination: (_req: Express.Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadDir);
  },
  filename: (_req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const ext = file.originalname.toLowerCase().split('.').pop();
    const allowedFormats = ['zip', 'pbip', 'csv', 'xlsx', 'xls', 'json'];
    if (allowedFormats.includes(ext || '')) {
      cb(null, true);
    } else {
      cb(new Error('Formatos permitidos: .csv, .xlsx, .xls, .json, .zip, .pbip'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 * 1024 }, // 10GB max
});

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Configuración CORS: soporta múltiples orígenes separados por coma
const CORS_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(',').map(o => o.trim());

// Función para validar orígenes CORS
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Permitir requests sin origen (como requests desde aplicaciones móviles)
    if (!origin || CORS_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Origen rechazado: ${origin}`);
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 horas
};

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors(corsOptions));

// Log de configuración CORS
console.log(`[CORS] Orígenes permitidos:`, CORS_ORIGINS);

// Logger middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// API Routes
const apiRouter = express.Router();

// ======= MÓDULO 1: GRÁFICOS =======
apiRouter.post('/preview/graphic', graphicController.getGraphicPreview);
apiRouter.post('/apply/graphic', graphicController.applyGraphic);
apiRouter.post('/suggest/graphic-style', graphicController.suggestGraphicStyle);

// ======= MÓDULO 2: MEDIDAS DAX =======
apiRouter.post('/dax/generate', daxController.generateDAX);
apiRouter.post('/dax/apply', daxController.applyDAX);
apiRouter.get('/dax/measures', daxController.getMeasures);
apiRouter.post('/dax/validate', daxController.validateDAX);

// ======= MÓDULO 3: TRADUCCIONES =======
apiRouter.post('/translations/generate', translationController.generateTranslations);
apiRouter.post('/translations/apply', translationController.applyTranslations);
apiRouter.get('/translations', translationController.getTranslations);
apiRouter.delete('/translations/:clave', translationController.deleteTranslation);

// ======= MÓDULO 4: RUTAS DINÁMICAS =======
apiRouter.post('/routes/generate', routeController.generateDynamicRoute);
apiRouter.post('/routes/apply', routeController.applyRoute);
apiRouter.get('/routes', routeController.getRoutes);
apiRouter.get('/routes/pages/sample', routeController.getSamplePages);
apiRouter.post('/routes/preview', routeController.previewRoute);

// ======= MÓDULO 5: FILTROS =======
apiRouter.get('/filters/options/:columna', filterController.getFilterOptions);
apiRouter.post('/filters/create', filterController.createFilter);
apiRouter.get('/filters', filterController.getFilters);
apiRouter.post('/filters/apply', filterController.applyFilters);
apiRouter.delete('/filters/:nombre', filterController.deleteFilter);
apiRouter.get('/filters/presets', filterController.getFilterPreset);

// ======= PBIP FILE HANDLING =======
apiRouter.post('/pbip/upload', upload.single('file'), pbipController.uploadPBIP);
apiRouter.get('/pbip/metadata', pbipController.getMetadata);
apiRouter.get('/pbip/visualizations', pbipController.getVisualizations);
apiRouter.post('/pbip/add-visualization', pbipController.addVisualization);
apiRouter.post('/pbip/remove-visualization', pbipController.removeVisualization);
apiRouter.post('/pbip/add-measure', pbipController.addMeasure);
apiRouter.get('/pbip/download', pbipController.downloadPBIP);
apiRouter.post('/pbip/cleanup', pbipController.cleanupFile);

// ======= RELATIONSHIP REPAIR (AUTO-FIX) =======
apiRouter.post('/pbip/analyze-relationships', relationshipRepairController.analyzeRelationships);
apiRouter.post('/pbip/auto-repair', relationshipRepairController.autoRepair);
apiRouter.get('/pbip/download-repaired', relationshipRepairController.downloadRepaired);

// ======= UNIVERSAL DATA EXPLORER =======
apiRouter.post('/data/upload', upload.single('file'), dataController.uploadData);
apiRouter.get('/data/catalog', dataController.getCatalog);
apiRouter.get('/data/table/:tableName', dataController.getTable);
apiRouter.get('/data/table/:tableName/data', dataController.getTablePreview);
apiRouter.post('/data/query', dataController.queryData);
apiRouter.post('/data/clear', dataController.clearData);

// ======= GENÉRICO =======
apiRouter.post('/prompt', async (req: Request, res: Response) => {
  try {
    const { module, prompt, context } = req.body;

    if (!module || !prompt) {
      return res.status(400).json({
        success: false,
        error: 'Module y prompt son requeridos',
      });
    }

    // Rutear según el módulo
    switch (module) {
      case 'graficos':
        return graphicController.getGraphicPreview(req, res);
      case 'dax':
        return daxController.generateDAX(req, res);
      case 'traducciones':
        return translationController.generateTranslations(req, res);
      case 'rutas':
        return routeController.generateDynamicRoute(req, res);
      case 'filtros':
        return filterController.createFilter(req, res);
      default:
        return res.status(400).json({
          success: false,
          error: `Módulo no soportado: ${module}`,
        });
    }
  } catch (error) {
    console.error('Error processing prompt:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Montar rutas en /api
app.use('/api', apiRouter);

// Rutas raíz
app.get('/', (req: Request, res: Response) => {
  res.json({
    nombre: 'Power BI AI Assistant API',
    versión: '1.0.0',
    descripción:
      'API backend para generación de gráficos, medidas DAX, traducciones y filtros',
    endpoints: {
      gráficos: '/api/preview/graphic, /api/apply/graphic',
      dax: '/api/dax/generate, /api/dax/apply',
      traducciones: '/api/translations/generate, /api/translations/apply',
      rutas: '/api/routes/generate, /api/routes/apply',
      filtros: '/api/filters/create, /api/filters/apply',
    },
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Ruta no encontrada: ${req.path}`,
  });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║   Power BI AI Assistant - Backend Server                      ║
║   Puerto: ${PORT}                                                    ║
║   Ambiente: ${NODE_ENV}                                           ║
║   CORS Orígenes: ${CORS_ORIGINS.length} permitido(s)                    ║
║   ${CORS_ORIGINS.map(o => `✓ ${o}`).join('\n║   ')}          ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido. Cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

export default app;
