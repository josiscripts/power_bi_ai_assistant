import { useState, useCallback } from 'react';
import api from '@services/api';
import type { PromptRequest } from '../types';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export const useApi = (options?: UseApiOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const executeRequest = useCallback(
    async (
      fn: () => Promise<any>,
      errorMessage: string = 'An error occurred'
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fn();
        setData(response);
        options?.onSuccess?.(response);
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : errorMessage;
        setError(message);
        options?.onError?.(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  const sendPrompt = useCallback(
    (request: PromptRequest) =>
      executeRequest(
        () => api.sendPrompt(request),
        'Error processing prompt'
      ),
    [executeRequest]
  );

  const getGraphicPreview = useCallback(
    (config: any) =>
      executeRequest(
        () => api.getGraphicPreview(config),
        'Error generating preview'
      ),
    [executeRequest]
  );

  const applyGraphic = useCallback(
    (config: any) =>
      executeRequest(
        () => api.applyGraphic(config),
        'Error applying graphic'
      ),
    [executeRequest]
  );

  const generateDAX = useCallback(
    (prompt: string, context: any) =>
      executeRequest(
        () => api.generateDAX(prompt, context),
        'Error generating DAX'
      ),
    [executeRequest]
  );

  const applyDAX = useCallback(
    (measure: any) =>
      executeRequest(
        () => api.applyDAX(measure),
        'Error applying measure'
      ),
    [executeRequest]
  );

  const generateTranslations = useCallback(
    (clave: string, idiomas: string[]) =>
      executeRequest(
        () => api.generateTranslations(clave, idiomas),
        'Error generating translations'
      ),
    [executeRequest]
  );

  const applyTranslations = useCallback(
    (data: any) =>
      executeRequest(
        () => api.applyTranslations(data),
        'Error applying translations'
      ),
    [executeRequest]
  );

  const generateDynamicRoute = useCallback(
    (paginas: string[]) =>
      executeRequest(
        () => api.generateDynamicRoute(paginas),
        'Error generating route'
      ),
    [executeRequest]
  );

  const getFilterOptions = useCallback(
    (columna: string) =>
      executeRequest(
        () => api.getFilterOptions(columna),
        'Error fetching filter options'
      ),
    [executeRequest]
  );

  const applyFilters = useCallback(
    (filters: any) =>
      executeRequest(
        () => api.applyFilters(filters),
        'Error applying filters'
      ),
    [executeRequest]
  );

  const clearError = useCallback(() => setError(null), []);
  const clearData = useCallback(() => setData(null), []);

  return {
    loading,
    error,
    data,
    clearError,
    clearData,
    sendPrompt,
    getGraphicPreview,
    applyGraphic,
    generateDAX,
    applyDAX,
    generateTranslations,
    applyTranslations,
    generateDynamicRoute,
    getFilterOptions,
    applyFilters,
  };
};
