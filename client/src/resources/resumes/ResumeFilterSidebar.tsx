import { Button } from '@client/common/components/button';
import { InputSearch } from '@client/common/components/input/InputSearch';
import { Selector } from '@client/common/components/select/Selector';
import { H5, H6 } from '@client/common/components/typography';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export type ResumeFilters = {
  searchQuery: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  dateRange: string;
  state: string;
};

type ResumeFilterSidebarProps = {
  onFilterChange: (filters: ResumeFilters) => void;
  totalResumes: number;
};

export const ResumeFilterSidebar = ({
  onFilterChange,
  totalResumes,
}: ResumeFilterSidebarProps) => {
  const [filters, setFilters] = useState<ResumeFilters>({
    searchQuery: '',
    sortBy: 'uploadedAt',
    sortOrder: 'desc',
    dateRange: 'all',
    state: 'all',
  });

  const handleFilterChange = (key: keyof ResumeFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: ResumeFilters = {
      searchQuery: '',
      sortBy: 'uploadedAt',
      sortOrder: 'desc',
      dateRange: 'all',
      state: 'all',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const sortByItems = [
    { value: 'name', label: 'Name' },
    { value: 'uploadedAt', label: 'Upload Date' },
    { value: 'createdAt', label: 'Created Date' },
  ];

  const sortOrderItems = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
  ];

  const dateRangeItems = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Past Week' },
    { value: 'month', label: 'Past Month' },
    { value: '3months', label: 'Past 3 Months' },
    { value: 'year', label: 'Past Year' },
  ];

  const stateItems = [
    { value: 'all', label: 'All States' },
    { value: 'ready', label: 'Ready' },
    { value: 'processing', label: 'Processing' },
    { value: 'failed', label: 'Failed' },
  ];

  return (
    <div className="w-80 flex flex-col bg-background rounded border border-border h-full">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FunnelIcon className="size-5 text-primary" />
            <H5>Filters</H5>
          </div>
          <Button
            size="sm"
            variant="light"
            onPress={handleReset}
            className="text-xs"
          >
            Reset
          </Button>
        </div>
        <p className="text-xs text-muted">
          {totalResumes} {totalResumes === 1 ? 'resume' : 'resumes'} found
        </p>
      </div>

      <div className="p-5 border-b border-border">
        <InputSearch
          label="Search"
          name="resume-search"
          placeholder="Search by name..."
          className="w-full"
          value={filters.searchQuery}
          onChange={(value) => handleFilterChange('searchQuery', value)}
        />
      </div>

      {/* Sort Section */}
      <div className="p-5 border-b border-border space-y-4">
        <H6>Sort By</H6>
        <div className="space-y-3">
          <Selector
            label="Field"
            placeholder="Select field"
            selectedKeys={[filters.sortBy]}
            onSelectionChange={(value) => handleFilterChange('sortBy', value)}
            items={sortByItems}
            size="sm"
          />
          <Selector
            label="Order"
            placeholder="Select order"
            selectedKeys={[filters.sortOrder]}
            onSelectionChange={(value) =>
              handleFilterChange('sortOrder', value as 'asc' | 'desc')
            }
            items={sortOrderItems}
            size="sm"
          />
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="p-5 border-b border-border space-y-4">
        <H6>Upload Date</H6>
        <Selector
          label="Time Range"
          placeholder="Select date range"
          selectedKeys={[filters.dateRange]}
          onSelectionChange={(value) => handleFilterChange('dateRange', value)}
          items={dateRangeItems}
          size="sm"
        />
      </div>

      {/* State Filter */}
      <div className="p-5 border-b border-border space-y-4">
        <H6>Status</H6>
        <Selector
          label="Resume State"
          placeholder="Select state"
          selectedKeys={[filters.state]}
          onSelectionChange={(value) => handleFilterChange('state', value)}
          items={stateItems}
          size="sm"
        />
      </div>
    </div>
  );
};
