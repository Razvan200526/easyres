import { useAuth } from '@client/shared/hooks';
import { cn, ScrollShadow, Spinner, Tab, Tabs } from '@heroui/react';
import { Icon } from '@iconify/react';
import type { ApplicationType } from '@sdk/types';
import { Button } from '@shared/components/button';
import { InputSearch } from '@shared/components/input/InputSearch';
import { H4 } from '@shared/components/typography';
import { useState } from 'react';
import { Link } from 'react-router';
import { ApplicationCard } from '../components/ApplicationCard';
import { ErrorPage } from '../components/ErrorPage';
import { useApplications } from '../hooks/applicationHooks';

export const ApplicationPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { data: user } = useAuth();
  const {
    data: applications,
    isLoading,
    error,
  } = useApplications(user?.id || '');

  if (isLoading) {
    return (
      <div className="flex flex-col h-[calc(100dvh-7rem)] overflow-y-scroll bg-background">
        <div className="flex items-center justify-center h-full">
          <Spinner />
        </div>
      </div>
    );
  }

  if (error) {
    <ErrorPage />;
  }

  const applicationsData: ApplicationType[] = applications || [];

  const filteredApplications = applicationsData.filter((app) => {
    const matchesSearch =
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.employer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applicationsData.length,
    applied: applicationsData.filter((app) => app.status === 'applied').length,
    interviewing: applicationsData.filter(
      (app) => app.status === 'interviewing',
    ).length,
    accepted: applicationsData.filter((app) => app.status === 'accepted')
      .length,
    rejected: applicationsData.filter((app) => app.status === 'rejected')
      .length,
  };

  const statusFilters = [
    {
      key: 'all',
      label: 'All',
      count: stats.total,
      className: 'text-primary data-[hover=true]:bg-primary/10',
      activeClassName: 'bg-primary/15 border-primary',
    },
    {
      key: 'applied',
      label: 'Applied',
      count: stats.applied,
      className: 'text-blue-600 data-[hover=true]:bg-blue-600/10',
      activeClassName: 'bg-blue-600/15 border-blue-600',
    },
    {
      key: 'interviewing',
      label: 'Interviewing',
      count: stats.interviewing,
      className: 'text-amber-600 data-[hover=true]:bg-amber-600/10',
      activeClassName: 'bg-amber-600/15 border-amber-600',
    },
    {
      key: 'accepted',
      label: 'Accepted',
      count: stats.accepted,
      className: 'text-green-600 data-[hover=true]:bg-green-600/10',
      activeClassName: 'bg-green-600/15 border-green-600',
    },
    {
      key: 'rejected',
      label: 'Rejected',
      count: stats.rejected,
      className: 'text-red-600 data-[hover=true]:bg-red-600/10',
      activeClassName: 'bg-red-600/15 border-red-600',
    },
  ];

  const activeTabItem = statusFilters.find((item) => item.key === statusFilter);

  const handleSelectionChange = (key: React.Key) => {
    setStatusFilter(key as string);
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-7rem)] overflow-y-scroll bg-background">
      <div className="bg-background">
        <div className="max-w-7xl mx-4 px-6 py-4">
          <div className="relative my-4">
            <InputSearch
              placeholder="Search by job title, company, or location..."
              size="md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e)}
            />
            {searchQuery && (
              <Button
                isIconOnly={true}
                onPress={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
              >
                <Icon icon="heroicons:x-mark" className="size-5" />
              </Button>
            )}
          </div>

          <Tabs
            onSelectionChange={handleSelectionChange}
            selectedKey={statusFilter}
            classNames={{
              base: 'w-full',
              tabContent: 'text-primary',
              cursor: cn('rounded border-none', activeTabItem?.activeClassName),
              tab: cn(
                'rounded data-[hover-unselected=true]:bg-primary-100/80 py-3 shadow-none',
                'border-none transition-all duration-300 data-[hover-unselected=true]:opacity-100',
              ),
              panel: 'p-0',
            }}
            aria-label="status-filter-tabs"
            variant="light"
            radius="lg"
            size="md"
          >
            {statusFilters.map((filter) => (
              <Tab
                key={filter.key}
                className={filter.className}
                title={
                  <div
                    className={cn('flex items-center gap-2', filter.className)}
                  >
                    <span>{filter.label}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-current/10">
                      {filter.count}
                    </span>
                  </div>
                }
              />
            ))}
          </Tabs>
        </div>
      </div>

      <ScrollShadow className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-4 px-6 py-6">
          {applicationsData?.length > 0 ? (
            <>
              <div className="mb-4">
                <p className="text-sm text-muted font-medium">
                  Showing {filteredApplications.length} of {stats.total}{' '}
                  application{stats.total !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
                {filteredApplications.map((application) => (
                  <Link
                    to={`/home/applications/${application.id}`}
                    key={application.id}
                  >
                    <ApplicationCard application={application} />
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
              <div className="p-4 rounded-full bg-primary/5 mb-4">
                <Icon
                  icon="heroicons:magnifying-glass"
                  className="size-12 text-muted"
                />
              </div>
              <H4 className="text-secondary-text mb-2">
                No applications found
              </H4>
              <p className="text-muted text-sm max-w-md">
                {searchQuery
                  ? `No results for "${searchQuery}". Try adjusting your search or filters.`
                  : 'Start tracking your job applications to see them here.'}
              </p>
              {(searchQuery || statusFilter !== 'all') && (
                <Button
                  onPress={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>
      </ScrollShadow>
    </div>
  );
};
