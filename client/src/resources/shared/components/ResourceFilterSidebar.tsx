import { Button } from '@client/common/components/button';
import { InputSearch } from '@client/common/components/input/InputSearch';
import { Selector } from '@client/common/components/select/Selector';
import {
  AdjustmentsHorizontalIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { useFilterStore } from '../filterStore';
import { buildServerParams } from '../filterUtils';
import type { FilterConfig, ResourceFilterParams, ResourceFilters } from '../types';
import { CollapsibleSection } from './CollapsibleSection';
import { DateRangeFilter } from './DateRangeFilter';
import { FilterHeader } from './FilterHeader';
import { StateFilter } from './StateFilter';

type ResourceFilterSidebarProps = {
  config: FilterConfig;
  filteredCount: number;
  isLoading?: boolean;
  onServerFilterChange?: (params: ResourceFilterParams) => void;
};

export const ResourceFilterSidebar = ({
  config,
  filteredCount,
  isLoading = false,
  onServerFilterChange,
}: ResourceFilterSidebarProps) => {
  const {
    resumeFilters,
    coverLetterFilters,
    setResumeFilters,
    setCoverLetterFilters,
  } = useFilterStore();

  // Get the appropriate state based on resource type
  const filters = config.resourceType === 'resume' ? resumeFilters : coverLetterFilters;
  const setFilters = config.resourceType === 'resume' ? setResumeFilters : setCoverLetterFilters;

  const handleFilterChange = (key: keyof ResourceFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onServerFilterChange?.(buildServerParams(newFilters, config.defaultFilters));
  };

  const handleReset = () => {
    setFilters(config.defaultFilters);
    onServerFilterChange?.({});
  };

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.sortBy !== config.defaultFilters.sortBy ||
    filters.sortOrder !== config.defaultFilters.sortOrder ||
    filters.dateRange !== config.defaultFilters.dateRange ||
    filters.state !== config.defaultFilters.state;

  const activeFilterCount = [
    filters.searchQuery !== '',
    filters.sortBy !== config.defaultFilters.sortBy ||
    filters.sortOrder !== config.defaultFilters.sortOrder,
    filters.dateRange !== config.defaultFilters.dateRange,
    filters.state !== config.defaultFilters.state,
  ].filter(Boolean).length;

  const sortOrderItems = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
  ];

  return (
    <div className="w-72 flex flex-col bg-light rounded-xl border border-border/40 h-fit shadow-sm overflow-hidden">
      <FilterHeader
        activeFilterCount={activeFilterCount}
        hasActiveFilters={hasActiveFilters}
        onReset={handleReset}
        totalCount={filteredCount}
        isLoading={isLoading}
        resourceLabel={config.resourceLabel}
        resourceLabelPlural={config.resourceLabelPlural}
        accentColor={config.accentColor}
      />

      {/* Search */}
      <div className="p-4 border-b border-border/50">
        <InputSearch
          name={`${config.resourceType}-search`}
          placeholder={`Search ${config.resourceLabelPlural}...`}
          className="w-full"
          size="sm"
          value={filters.searchQuery}
          onChange={(value) => handleFilterChange('searchQuery', value)}
        />
      </div>

      {/* Collapsible Sections */}
      <div className="flex-1 overflow-y-auto">
        {/* Sort Section */}
        <CollapsibleSection
          title="Sort"
          icon={<AdjustmentsHorizontalIcon className="size-4" />}
          defaultOpen={true}
        >
          <Selector
            label="Sort by"
            placeholder="Select field"
            selectedKeys={[filters.sortBy]}
            onSelectionChange={(value) => handleFilterChange('sortBy', value)}
            items={config.sortByOptions}
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
        </CollapsibleSection>

        {/* Date Range Filter */}
        <CollapsibleSection
          title="Date Range"
          icon={<CalendarDaysIcon className="size-4" />}
          defaultOpen={false}
        >
          <DateRangeFilter
            options={config.dateRangeOptions}
            selectedValue={filters.dateRange}
            onSelect={(value) => handleFilterChange('dateRange', value)}
          />
        </CollapsibleSection>

        {/* Status Filter */}
        <CollapsibleSection
          title="Status"
          icon={
            <div className="size-4 flex items-center justify-center">
              <div className="size-2.5 rounded-full bg-current" />
            </div>
          }
          defaultOpen={false}
        >
          <StateFilter
            options={config.stateOptions}
            selectedValue={filters.state}
            onSelect={(value) => handleFilterChange('state', value)}
          />
        </CollapsibleSection>
      </div>

      {/* Footer - Apply button for server-side filtering */}
      {onServerFilterChange && (
        <div className="p-4 border-t border-border/40 bg-primary-50/30">
          <Button
            className="w-full font-semibold"
            color="primary"
            size="sm"
            isLoading={isLoading}
            onPress={() =>
              onServerFilterChange(buildServerParams(filters, config.defaultFilters))
            }
          >
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
};
