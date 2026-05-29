import { Request, Response } from 'express';
import claudeService from '@services/claudeService';
import { APIResponse, DAXMeasure } from '../types';

const daxMeasures: DAXMeasure[] = [];

export const generateDAX = async (
  req: Request,
  res: Response<APIResponse>
) => {
  try {
    const { prompt, context } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required',
      });
    }

    const result = await claudeService.generateDAX(prompt, context);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error generating DAX:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const applyDAX = async (
  req: Request,
  res: Response<APIResponse>
) => {
  try {
    const { nombre, formula, explicacion, tabla } = req.body;

    if (!nombre || !formula) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    const measure: DAXMeasure = {
      nombre,
      formula,
      explicacion: explicacion || 'Sin descripción',
      tabla: tabla || '_Medidas',
    };

    daxMeasures.push(measure);

    // En un caso real, aquí se enviaría a Power BI REST API
    const mockResponse = {
      id: `measure_${Date.now()}`,
      ...measure,
      estado: 'aplicada',
      fechaCreacion: new Date(),
    };

    return res.json({
      success: true,
      data: mockResponse,
      message: 'Medida DAX aplicada exitosamente',
    });
  } catch (error) {
    console.error('Error applying DAX:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getMeasures = async (
  req: Request,
  res: Response<APIResponse>
) => {
  try {
    return res.json({
      success: true,
      data: daxMeasures,
    });
  } catch (error) {
    console.error('Error getting measures:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const validateDAX = async (
  req: Request,
  res: Response<APIResponse>
) => {
  try {
    const { formula } = req.body;

    if (!formula) {
      return res.status(400).json({
        success: false,
        error: 'Formula is required',
      });
    }

    // Validación básica
    const isValid =
      formula.includes('=') &&
      !formula.includes('<script>') &&
      formula.length > 0;

    return res.json({
      success: true,
      data: {
        valida: isValid,
        errores: isValid
          ? []
          : ['Fórmula inválida o sospechosa'],
        advertencias: formula.length > 500 ? ['Fórmula muy larga'] : [],
      },
    });
  } catch (error) {
    console.error('Error validating DAX:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
