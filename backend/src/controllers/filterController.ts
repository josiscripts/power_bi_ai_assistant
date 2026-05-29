import { Request, Response } from 'express';
import { APIResponse, FilterConfig } from '../types';

const filters: FilterConfig[] = [];

const mockColumnData: Record<string, string[]> = {
  Año: ['2020', '2021', '2022', '2023', '2024'],
  Mes: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
  Provincia: ['ADEJE', 'AGAETE', 'ARRECIFE', 'GÁLDAR', 'GÜÍMAR'],
  Artículo: ['Artículo 1', 'Artículo 2', 'Artículo 3', 'Artículo 4', 'Artículo 5'],
  Región: ['Norte', 'Centro', 'Sur', 'Este', 'Oeste'],
};

export const getFilterOptions = async (
  req: Request,
  res: Response<APIResponse>
) => {
  try {
    const { columna } = req.params;

    if (!columna) {
      return res.status(400).json({
        success: false,
        error: 'Columna es requerida',
      });
    }

    const opciones = mockColumnData[columna] || [];

    return res.json({
      success: true,
      data: {
        columna,
        opciones,
        total: opciones.length,
      },
    });
  } catch (error) {
    console.error('Error getting filter options:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const createFilter = async (
  req: Request,
  res: Response<APIResponse>
) => {
  try {
    const {
      nombre,
      tipo,
      columna,
      multiple,
      busqueda,
      menuAvanzado,
      orden,
    } = req.body;

    if (!nombre || !tipo || !columna) {
      return res.status(400).json({
        success: false,
        error: 'Campos requeridos faltantes',
      });
    }

    const filter: FilterConfig = {
      nombre,
      tipo,
      columna,
      multiple: multiple || false,
      busqueda: busqueda || true,
      menuAvanzado: menuAvanzado || true,
      orden: orden || 'desc',
    };

    filters.push(filter);

    const mockResponse = {
      id: `filter_${Date.now()}`,
      ...filter,
      estado: 'creado',
      fechaCreacion: new Date(),
    };

    return res.json({
      success: true,
      data: mockResponse,
      message: 'Filtro creado exitosamente',
    });
  } catch (error) {
    console.error('Error creating filter:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getFilters = async (
  req: Request,
  res: Response<APIResponse>
) => {
  try {
    return res.json({
      success: true,
      data: filters,
    });
  } catch (error) {
    console.error('Error getting filters:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const applyFilters = async (
  req: Request,
  res: Response<APIResponse>
) => {
  try {
    const { filtros } = req.body;

    if (!filtros || typeof filtros !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Filtros inválidos',
      });
    }

    // En un caso real, aquí se aplicarían los filtros a los datos
    const aplicados = Object.entries(filtros).map(([nombre, valores]) => ({
      nombre,
      valores: Array.isArray(valores) ? valores : [valores],
    }));

    const mockResponse = {
      id: `filterset_${Date.now()}`,
      filtros: aplicados,
      estado: 'aplicados',
      fechaAplicacion: new Date(),
      registrosAfectados: Math.floor(Math.random() * 10000),
    };

    return res.json({
      success: true,
      data: mockResponse,
      message: 'Filtros aplicados exitosamente',
    });
  } catch (error) {
    console.error('Error applying filters:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteFilter = async (
  req: Request,
  res: Response<APIResponse>
) => {
  try {
    const { nombre } = req.params;

    const index = filters.findIndex((f) => f.nombre === nombre);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Filtro no encontrado',
      });
    }

    filters.splice(index, 1);

    return res.json({
      success: true,
      data: { mensaje: `Filtro "${nombre}" eliminado` },
    });
  } catch (error) {
    console.error('Error deleting filter:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getFilterPreset = async (
  req: Request,
  res: Response<APIResponse>
) => {
  try {
    const presets = [
      {
        nombre: 'Últimos 30 días',
        filtros: { Fecha: 'últimos_30' },
      },
      {
        nombre: 'Este año',
        filtros: { Año: new Date().getFullYear().toString() },
      },
      {
        nombre: 'Ventas altas',
        filtros: { Región: ['Norte', 'Centro'] },
      },
    ];

    return res.json({
      success: true,
      data: presets,
    });
  } catch (error) {
    console.error('Error getting filter presets:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
