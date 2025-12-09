import type { BaseResource, ResourceFilters } from './types';

/**
 * Filters and sorts resources based on the provided filters
 * Works with any resource type that extends BaseResource
 */
export const filterAndSortResources = <T extends BaseResource>(
  resources: T[],
  filters: ResourceFilters,
): T[] => {
  let filtered = [...resources];

  // Apply search filter
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter((resource) =>
      resource.name.toLowerCase().includes(query),
    );
  }

  // Apply date range filter
  if (filters.dateRange !== 'all') {
    const now = new Date();
    const filterDate = getFilterDate(now, filters.dateRange);

    filtered = filtered.filter((resource) => {
      const uploadDate = new Date(resource.uploadedAt);
      return uploadDate >= filterDate;
    });
  }

  // Apply state filter
  if (filters.state !== 'all') {
    filtered = filtered.filter((resource) => resource.state === filters.state);
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let comparison = 0;

    switch (filters.sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'uploadedAt':
        comparison =
          new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
        break;
      case 'createdAt': {
        // Fall back to uploadedAt if createdAt doesn't exist
        const aDate = a.createdAt
          ? new Date(a.createdAt)
          : new Date(a.uploadedAt);
        const bDate = b.createdAt
          ? new Date(b.createdAt)
          : new Date(b.uploadedAt);
        comparison = aDate.getTime() - bDate.getTime();
        break;
      }
      default:
        comparison = 0;
    }

    return filters.sortOrder === 'asc' ? comparison : -comparison;
  });

  return filtered;
};

/**
 * Gets the filter date based on the date range selection
 */
const getFilterDate = (now: Date, dateRange: string): Date => {
  const date = new Date(now);

  switch (dateRange) {
    case 'today':
      date.setHours(0, 0, 0, 0);
      break;
    case 'week':
      date.setDate(date.getDate() - 7);
      break;
    case 'month':
      date.setMonth(date.getMonth() - 1);
      break;
    case '3months':
      date.setMonth(date.getMonth() - 3);
      break;
    case 'year':
      date.setFullYear(date.getFullYear() - 1);
      break;
    default:
      date.setFullYear(1970); // Beginning of time
  }

  return date;
};

/**
 * Builds server filter params from local filters
 * Only includes non-default values
 */
export const buildServerParams = (
  filters: ResourceFilters,
  defaultFilters: ResourceFilters,
): Record<string, string | number> => {
  const params: Record<string, string | number> = {};

  if (filters.searchQuery) {
    params.search = filters.searchQuery;
  }
  if (filters.sortBy !== defaultFilters.sortBy) {
    params.sort_by = filters.sortBy;
  }
  if (filters.sortOrder !== defaultFilters.sortOrder) {
    params.sort_order = filters.sortOrder;
  }
  if (filters.dateRange !== defaultFilters.dateRange) {
    params.date_range = filters.dateRange;
  }
  if (filters.state !== defaultFilters.state) {
    params.state = filters.state;
  }

  return params;
};
