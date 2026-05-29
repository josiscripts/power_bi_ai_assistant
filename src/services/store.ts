import { create } from 'zustand';
import type { AppState } from '../types';

interface AppStore extends AppState {
  setActiveModule: (module: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  activeModule: null,
  isLoading: false,
  error: null,

  setActiveModule: (module) => set({ activeModule: module }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

interface FilterStore {
  activeFilters: Record<string, any>;
  setFilter: (filterName: string, value: any) => void;
  removeFilter: (filterName: string) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  activeFilters: {},
  setFilter: (filterName, value) =>
    set((state) => ({
      activeFilters: { ...state.activeFilters, [filterName]: value },
    })),
  removeFilter: (filterName) =>
    set((state) => {
      const newFilters = { ...state.activeFilters };
      delete newFilters[filterName];
      return { activeFilters: newFilters };
    }),
  clearFilters: () => set({ activeFilters: {} }),
}));

interface PreviewStore {
  previewData: any;
  setPreviewData: (data: any) => void;
  clearPreview: () => void;
}

export const usePreviewStore = create<PreviewStore>((set) => ({
  previewData: null,
  setPreviewData: (data) => set({ previewData: data }),
  clearPreview: () => set({ previewData: null }),
}));
