import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import * as graphicController from '@controllers/graphicController';

describe('Graphic Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: vi.SpyInstance;
  let statusMock: vi.SpyInstance;

  beforeEach(() => {
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });

    req = {
      body: {},
    };

    res = {
      json: jsonMock,
      status: statusMock,
    };
  });

  describe('getGraphicPreview', () => {
    it('debe devolver error sin prompt', async () => {
      req.body = { tipo: 'bar' };

      await graphicController.getGraphicPreview(
        req as Request,
        res as Response
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Prompt is required',
        })
      );
    });

    it('debe procesar preview válido', async () => {
      req.body = {
        prompt: 'Gráfico de barras',
        tipo: 'bar',
      };

      await graphicController.getGraphicPreview(
        req as Request,
        res as Response
      );

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            tipo: 'bar',
          }),
        })
      );
    });
  });

  describe('applyGraphic', () => {
    it('debe validar campos requeridos', async () => {
      req.body = { titulo: 'Test' };

      await graphicController.applyGraphic(
        req as Request,
        res as Response
      );

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it('debe aplicar gráfico válido', async () => {
      req.body = {
        titulo: 'Ventas',
        tipo: 'bar',
      };

      await graphicController.applyGraphic(
        req as Request,
        res as Response
      );

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            nombre: 'Ventas',
            tipo: 'bar',
          }),
        })
      );
    });
  });

  describe('suggestGraphicStyle', () => {
    it('debe sugerir estilos', async () => {
      req.body = { dataTipo: 'numeric' };

      await graphicController.suggestGraphicStyle(
        req as Request,
        res as Response
      );

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            recomendaciones: expect.any(Array),
            coloresRecomendados: expect.any(Array),
          }),
        })
      );
    });
  });
});
