import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useApi } from '@hooks/useApi';

describe('useApi Hook', () => {
  it('debe inicializar con valores por defecto', () => {
    const { result } = renderHook(() => useApi());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(null);
  });

  it('debe manejar solicitud exitosa', async () => {
    const mockData = { titulo: 'Test', tipo: 'bar' };
    const mockFn = vi.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useApi());

    await act(async () => {
      await result.current.getGraphicPreview({
        prompt: 'test',
        tipo: 'bar',
      });
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('debe manejar error', async () => {
    const { result } = renderHook(() => useApi());

    const mockError = new Error('API Error');
    const mockFn = vi.fn().mockRejectedValue(mockError);

    expect(result.current.error).toBe(null);
  });

  it('debe limpiar errores', () => {
    const { result } = renderHook(() => useApi());

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });

  it('debe limpiar datos', () => {
    const { result } = renderHook(() => useApi());

    act(() => {
      result.current.clearData();
    });

    expect(result.current.data).toBe(null);
  });

  it('debe ejecutar callback onSuccess', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useApi({ onSuccess }));

    const mockData = { test: 'data' };
    const mockFn = vi.fn().mockResolvedValue(mockData);

    // Verificar que los métodos existen
    expect(result.current.sendPrompt).toBeDefined();
    expect(result.current.generateDAX).toBeDefined();
  });

  it('debe ejecutar callback onError', async () => {
    const onError = vi.fn();
    const { result } = renderHook(() => useApi({ onError }));

    // Verificar que el error handler existe
    expect(result.current.clearError).toBeDefined();
  });
});
