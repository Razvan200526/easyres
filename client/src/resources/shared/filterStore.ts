import { create } from 'zustand';
import type { ResourceFilters, ResourceType } from './types';

const defaultFilters: ResourceFilters = {
  searchQuery: '',
  sortBy: 'uploadedAt',
  sortOrder: 'desc',
  dateRange: 'all',
  state: 'all',
};

type FilterStoreType = {
  // Filter state per resource type
  resumeFilters: ResourceFilters;
  coverLetterFilters: ResourceFilters;

  // Actions for filters
  setResumeFilters: (filters: ResourceFilters) => void;
  setCoverLetterFilters: (filters: ResourceFilters) => void;
  setFilters: (resourceType: ResourceType, filters: ResourceFilters) => void;
  resetFilters: (resourceType: ResourceType) => void;

  // Getters
  getFilters: (resourceType: ResourceType) => ResourceFilters;
};

export const useFilterStore = create<FilterStoreType>((set, get) => ({
  // Initial state
  resumeFilters: { ...defaultFilters },
  coverLetterFilters: { ...defaultFilters },

  // Filter actions
  setResumeFilters: (filters) => set({ resumeFilters: filters }),
  setCoverLetterFilters: (filters) => set({ coverLetterFilters: filters }),
  setFilters: (resourceType, filters) => {
    if (resourceType === 'resume') {
      set({ resumeFilters: filters });
    } else {
      set({ coverLetterFilters: filters });
    }
  },
  resetFilters: (resourceType) => {
    if (resourceType === 'resume') {
      set({ resumeFilters: { ...defaultFilters } });
    } else {
      set({ coverLetterFilters: { ...defaultFilters } });
    }
  },

  // Getters
  getFilters: (resourceType) => {
    const state = get();
    return resourceType === 'resume' ? state.resumeFilters : state.coverLetterFilters;
  },
}));
