import { Request, Response } from 'express';
import claudeService from '@services/claudeService';
import { APIResponse, Translation } from '../types';

const translations: Translation[] = [];

export const generateTranslations = async (
  req: Request,
  res: Response<APIResponse>
) => {
  try {
    const { clave, idiomas } = req.body;

    if (!clave || !idiomas || idiomas.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Clave e idiomas son requeridos',
      });
    }

    const result = await claudeService.generateTranslations(clave, idiomas);

    // Asegurar que incluye todos los idiomas (llenar con la clave si no hay traducción)
    const completeTranslations: Record<string, string> = {
      es: result.es || clave,
      en: result.en || clave,
      pt: result.pt || clave,
      fr: result.fr || clave,
      zh: result.zh || clave,
      ja: result.ja || clave,
    };

    return res.json({
      success: true,
      data: completeTranslations,
    });
  } catch (error) {
    console.error('Error generating translations:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const applyTranslations = async (
  req: Request,
  res: Response<APIResponse>
) => {
  try {
    const { clave, es, en, pt, fr, zh, ja } = req.body;

    if (!clave) {
      return res.status(400).json({
        success: false,
        error: 'Clave es requerida',
      });
    }

    // Verificar si ya existe
    const existe = translations.find((t) => t.clave === clave);
    if (existe) {
      // Actualizar
      Object.assign(existe, {
        clave,
        es: es || existe.es,
        en: en || existe.en,
        pt: pt || existe.pt,
        fr: fr || existe.fr,
        zh: zh || existe.zh,
        ja: ja || existe.ja,
      });
    } else {
      // Crear nueva
      const translation: Translation = {
        clave,
        es: es || clave,
        en: en || clave,
        pt: pt || clave,
        fr: fr || clave,
        zh: zh || clave,
        ja: ja || clave,
      };
      translations.push(translation);
    }

    // En un caso real, aquí se enviaría a Power BI para crear la tabla
    const mockResponse = {
      id: `translation_${Date.now()}`,
      clave,
      estado: 'aplicada',
      fechaCreacion: new Date(),
      idiomas: ['es', 'en', 'pt', 'fr', 'zh', 'ja'],
    };

    return res.json({
      success: true,
      data: mockResponse,
      message: 'Traducciones aplicadas exitosamente',
    });
  } catch (error) {
    console.error('Error applying translations:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getTranslations = async (
  req: Request,
  res: Response<APIResponse>
) => {
  try {
    return res.json({
      success: true,
      data: translations,
    });
  } catch (error) {
    console.error('Error getting translations:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteTranslation = async (
  req: Request,
  res: Response<APIResponse>
) => {
  try {
    const { clave } = req.params;

    const index = translations.findIndex((t) => t.clave === clave);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Traducción no encontrada',
      });
    }

    translations.splice(index, 1);

    return res.json({
      success: true,
      data: { mensaje: `Traducción "${clave}" eliminada` },
    });
  } catch (error) {
    console.error('Error deleting translation:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
