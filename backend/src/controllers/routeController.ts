import { Request, Response } from 'express';
import claudeService from '@services/claudeService';
import { APIResponse, DynamicRoute } from '../types';

const routes: DynamicRoute[] = [];

export const generateDynamicRoute = async (
  req: Request,
  res: Response<APIResponse>
) => {
  try {
    const { paginas, separador } = req.body;

    if (!paginas || paginas.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren al menos 2 páginas',
      });
    }

    const result = await claudeService.generateDynamicRoute(paginas);

    return res.json({
      success: true,
      data: {
        ...result,
        paginas,
        separador: separador || '>',
      },
    });
  } catch (error) {
    console.error('Error generating dynamic route:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const applyRoute = async (
  req: Request,
  res: Response<APIResponse>
) => {
  try {
    const { nombre, paginas, separador, formula } = req.body;

    if (!nombre || !paginas || !formula) {
      return res.status(400).json({
        success: false,
        error: 'Campos requeridos faltantes',
      });
    }

    const route: DynamicRoute = {
      nombre,
      paginas,
      separador: separador || '>',
      formula,
    };

    routes.push(route);

    const mockResponse = {
      id: `route_${Date.now()}`,
      ...route,
      estado: 'aplicada',
      fechaCreacion: new Date(),
    };

    return res.json({
      success: true,
      data: mockResponse,
      message: 'Ruta dinámina aplicada exitosamente',
    });
  } catch (error) {
    console.error('Error applying route:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getRoutes = async (
  req: Request,
  res: Response<APIResponse>
) => {
  try {
    return res.json({
      success: true,
      data: routes,
    });
  } catch (error) {
    console.error('Error getting routes:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getSamplePages = async (
  req: Request,
  res: Response<APIResponse>
) => {
  try {
    // En un caso real, obtendría las páginas de Power BI
    const samplePages = [
      'Inicio',
      'Ventas',
      'Análisis',
      'Reportes',
      'Almacén',
      'Inventario',
      'Detalles',
    ];

    return res.json({
      success: true,
      data: {
        paginas: samplePages,
        total: samplePages.length,
      },
    });
  } catch (error) {
    console.error('Error getting sample pages:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const previewRoute = async (
  req: Request,
  res: Response<APIResponse>
) => {
  try {
    const { paginas, separador } = req.body;

    if (!paginas || paginas.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Páginas requeridas',
      });
    }

    const preview = paginas.join(` ${separador || '>'} `);

    return res.json({
      success: true,
      data: {
        preview,
        paginas,
        separador: separador || '>',
      },
    });
  } catch (error) {
    console.error('Error previewing route:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
