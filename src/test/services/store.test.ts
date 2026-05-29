import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppStore, useFilterStore, usePreviewStore } from '@services/store';

describe('Zustand Stores', () => {
  describe('useAppStore', () => {
    it('debe inicializar con valores por defecto', () => {
      const { result } = renderHook(() => useAppStore());

      expect(result.current.activeModule).toBe(null);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('debe establecer módulo activo', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setActiveModule('graficos');
      });

      expect(result.current.activeModule).toBe('graficos');
    });

    it('debe establecer estado de carga', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('debe establecer error', () => {
      const { result } = renderHook(() => useAppStore());
      const errorMessage = 'Test error';

      act(() => {
        result.current.setError(errorMessage);
      });

      expect(result.current.error).toBe(errorMessage);
    });

    it('debe limpiar error', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setError('Error');
      });

      expect(result.current.error).toBe('Error');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe('useFilterStore', () => {
    it('debe inicializar con filtros vacíos', () => {
      const { result } = renderHook(() => useFilterStore());

      expect(result.current.activeFilters).toEqual({});
    });

    it('debe agregar filtro', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setFilter('Año', 2023);
      });

      expect(result.current.activeFilters).toEqual({ Año: 2023 });
    });

    it('debe remover filtro', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setFilter('Año', 2023);
      });

      expect(result.current.activeFilters.Año).toBe(2023);

      act(() => {
        result.current.removeFilter('Año');
      });

      expect(result.current.activeFilters.Año).toBeUndefined();
    });

    it('debe limpiar todos los filtros', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setFilter('Año', 2023);
        result.current.setFilter('Mes', 'Enero');
      });

      expect(Object.keys(result.current.activeFilters).length).toBe(2);

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.activeFilters).toEqual({});
    });
  });

  describe('usePreviewStore', () => {
    it('debe inicializar con preview nulo', () => {
      const { result } = renderHook(() => usePreviewStore());

      expect(result.current.previewData).toBe(null);
    });

    it('debe establecer datos de preview', () => {
      const { result } = renderHook(() => usePreviewStore());
      const mockData = { titulo: 'Test', tipo: 'bar' };

      act(() => {
        result.current.setPreviewData(mockData);
      });

      expect(result.current.previewData).toEqual(mockData);
    });

    it('debe limpiar preview', () => {
      const { result } = renderHook(() => usePreviewStore());

      act(() => {
        result.current.setPreviewData({ test: 'data' });
      });

      expect(result.current.previewData).not.toBe(null);

      act(() => {
        result.current.clearPreview();
      });

      expect(result.current.previewData).toBe(null);
    });
  });
});
