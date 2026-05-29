import { Request, Response } from 'express';
import claudeService from '@services/claudeService';
import { APIResponse, GraphicConfig } from '../types';

export const getGraphicPreview = async (
  req: Request,
  res: Response<APIResponse>
) => {
  try {
    const { prompt, tipo } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required',
      });
    }

    const result = await claudeService.generateGraphic(prompt, { tipo });

    return res.json({
      success: true,
      data: {
        ...result,
        tipo: tipo || result.tipo || 'bar',
      },
    });
  } catch (error) {
    console.error('Error generating graphic preview:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const applyGraphic = async (
  req: Request,
  res: Response<APIResponse>
) => {
  try {
    const { titulo, tipo, datos } = req.body;

    if (!titulo || !tipo) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // En un caso real, aquí se enviaría a Power BI REST API
    // Por ahora, simulamos la aplicación
    const mockPowerBIResponse = {
      id: `graphic_${Date.now()}`,
      nombre: titulo,
      tipo,
      estado: 'creado',
      fechaCreacion: new Date(),
    };

    return res.json({
      success: true,
      data: mockPowerBIResponse,
      message: 'Gráfico aplicado exitosamente',
    });
  } catch (error) {
    console.error('Error applying graphic:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const suggestGraphicStyle = async (
  req: Request,
  res: Response<APIResponse>
) => {
  try {
    const { dataTipo, paleta } = req.body;

    const suggestions = {
      dataTipo: dataTipo || 'numeric',
      paleta: paleta || 'corporativo',
      recomendaciones: [
        'Usar colores contrastantes',
        'Incluir leyenda clara',
        'Optimizar para mobile',
      ],
      coloresRecomendados: ['#3b82f6', '#2563eb', '#1e40af'],
    };

    return res.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error('Error suggesting graphic style:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
