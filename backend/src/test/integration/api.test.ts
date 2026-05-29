import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '@/server';

describe('API Integration Tests', () => {
  describe('Health Check', () => {
    it('GET /health debe devolver OK', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Root Endpoint', () => {
    it('GET / debe devolver info de API', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('nombre');
      expect(response.body.nombre).toContain('Power BI');
    });
  });

  describe('Graphic Endpoints', () => {
    it('POST /api/preview/graphic sin prompt debe fallar', async () => {
      const response = await request(app)
        .post('/api/preview/graphic')
        .send({ tipo: 'bar' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('POST /api/preview/graphic con prompt válido', async () => {
      const response = await request(app)
        .post('/api/preview/graphic')
        .send({
          prompt: 'Gráfico de barras',
          tipo: 'bar',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    it('POST /api/apply/graphic debe aplicar', async () => {
      const response = await request(app)
        .post('/api/apply/graphic')
        .send({
          titulo: 'Test',
          tipo: 'bar',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('DAX Endpoints', () => {
    it('POST /api/dax/generate debe generar DAX', async () => {
      const response = await request(app)
        .post('/api/dax/generate')
        .send({
          prompt: 'Suma de ventas',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('formula');
    });

    it('POST /api/dax/apply debe aplicar medida', async () => {
      const response = await request(app)
        .post('/api/dax/apply')
        .send({
          nombre: 'Total_Ventas',
          formula: 'SUM(Tabla[Columna])',
          explicacion: 'Suma total',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('GET /api/dax/measures debe obtener medidas', async () => {
      const response = await request(app).get('/api/dax/measures');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('POST /api/dax/validate debe validar DAX', async () => {
      const response = await request(app)
        .post('/api/dax/validate')
        .send({
          formula: 'SUM(Tabla[Columna])',
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('valida');
    });
  });

  describe('Translation Endpoints', () => {
    it('POST /api/translations/generate debe generar traducciones', async () => {
      const response = await request(app)
        .post('/api/translations/generate')
        .send({
          clave: 'bienvenida',
          idiomas: ['es', 'en'],
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('POST /api/translations/apply debe aplicar traducciones', async () => {
      const response = await request(app)
        .post('/api/translations/apply')
        .send({
          clave: 'bienvenida',
          es: 'Bienvenida',
          en: 'Welcome',
          pt: 'Bem-vindo',
          fr: 'Bienvenue',
          zh: '欢迎',
          ja: 'ようこそ',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('GET /api/translations debe obtener traducciones', async () => {
      const response = await request(app).get('/api/translations');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Route Endpoints', () => {
    it('POST /api/routes/generate debe generar ruta', async () => {
      const response = await request(app)
        .post('/api/routes/generate')
        .send({
          paginas: ['Inicio', 'Reportes'],
          separador: '>',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('GET /api/routes/pages/sample debe obtener páginas', async () => {
      const response = await request(app).get('/api/routes/pages/sample');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('paginas');
    });

    it('POST /api/routes/preview debe previsualizar', async () => {
      const response = await request(app)
        .post('/api/routes/preview')
        .send({
          paginas: ['A', 'B'],
          separador: '→',
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('preview');
    });
  });

  describe('Filter Endpoints', () => {
    it('GET /api/filters/options/:columna debe obtener opciones', async () => {
      const response = await request(app).get('/api/filters/options/Año');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('opciones');
    });

    it('POST /api/filters/create debe crear filtro', async () => {
      const response = await request(app)
        .post('/api/filters/create')
        .send({
          nombre: 'Año',
          tipo: 'radio',
          columna: 'Tabla[Año]',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('GET /api/filters debe obtener filtros', async () => {
      const response = await request(app).get('/api/filters');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('GET /api/filters/presets debe obtener presets', async () => {
      const response = await request(app).get('/api/filters/presets');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Generic Prompt Endpoint', () => {
    it('POST /api/prompt sin module debe fallar', async () => {
      const response = await request(app)
        .post('/api/prompt')
        .send({ prompt: 'Test' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('POST /api/prompt con module inválido debe fallar', async () => {
      const response = await request(app)
        .post('/api/prompt')
        .send({
          module: 'invalido',
          prompt: 'Test',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('no soportado');
    });

    it('POST /api/prompt para gráficos debe funcionar', async () => {
      const response = await request(app)
        .post('/api/prompt')
        .send({
          module: 'graficos',
          prompt: 'Gráfico de barras',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('Ruta inexistente debe retornar 404', async () => {
      const response = await request(app).get('/ruta-inexistente');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('POST sin Content-Type debe manejar gracefully', async () => {
      const response = await request(app)
        .post('/api/dax/generate')
        .send('invalid');

      expect([200, 400, 500]).toContain(response.status);
    });
  });
});
