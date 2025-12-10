import type { FilterConfig, ResourceFilters } from './types';

const defaultFilters: ResourceFilters = {
  searchQuery: '',
  sortBy: 'uploadedAt',
  sortOrder: 'desc',
  dateRange: 'all',
  state: 'all',
};

const commonDateRangeOptions = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Past Week' },
  { value: 'month', label: 'Past Month' },
  { value: '3months', label: 'Past 3 Months' },
  { value: 'year', label: 'Past Year' },
];

const commonStateOptions = [
  { value: 'all', label: 'All States', color: 'bg-primary' },
  { value: 'ready', label: 'Ready', color: 'bg-green-500' },
  { value: 'processing', label: 'Processing', color: 'bg-amber-500' },
  { value: 'failed', label: 'Failed', color: 'bg-red-500' },
];

export const resumeFilterConfig: FilterConfig = {
  resourceType: 'resumes',
  resourceLabel: 'resume',
  resourceLabelPlural: 'resumes',
  accentColor: 'resume',
  sortByOptions: [
    { value: 'name', label: 'Name' },
    { value: 'uploadedAt', label: 'Upload Date' },
    { value: 'createdAt', label: 'Created Date' },
  ],
  dateRangeOptions: commonDateRangeOptions,
  stateOptions: commonStateOptions,
  defaultFilters,
};

export const coverLetterFilterConfig: FilterConfig = {
  resourceType: 'coverLetters',
  resourceLabel: 'cover letter',
  resourceLabelPlural: 'cover letters',
  accentColor: 'coverletter',
  sortByOptions: [
    { value: 'name', label: 'Name' },
    { value: 'uploadedAt', label: 'Upload Date' },
  ],
  dateRangeOptions: commonDateRangeOptions,
  stateOptions: commonStateOptions,
  defaultFilters,
};

export const getFilterConfig = (
  resourceType: 'resume' | 'coverLetter',
): FilterConfig => {
  return resourceType === 'resume'
    ? resumeFilterConfig
    : coverLetterFilterConfig;
};
