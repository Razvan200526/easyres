import { useAuth } from '@client/shared/hooks';
import { ScrollShadow } from '@heroui/react';
import type { ResumeType } from '@sdk/types';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { filterAndSortResumes } from './filterUtils';
import { useResumes } from './hooks';
import { NoResumes } from './NoResumes';
import { ResumeCard } from './ResumeCard';
import { ResumeFilterSidebar, type ResumeFilters } from './ResumeFilterSidebar';

export const ResumePage = () => {
  const { data: user } = useAuth();
  const {
    data: resumes,
    isLoading: resumesLoading,
    error,
  } = useResumes(user ? user.id : '');

  const [filters, setFilters] = useState<ResumeFilters>({
    searchQuery: '',
    sortBy: 'uploadedAt',
    sortOrder: 'desc',
    dateRange: 'all',
    state: 'all',
  });

  const filteredResumes = useMemo(() => {
    if (!resumes) return [];
    return filterAndSortResumes(resumes, filters);
  }, [resumes, filters]);

  if (resumesLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading resumes</div>;
  if (!resumes || resumes.length === 0) {
    return <NoResumes />;
  }

  return (
    <div className="m-4 bg-background h-[calc(100dvh-7rem)] rounded flex">
      <ScrollShadow size={8} className="flex-1 overflow-y-scroll">
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredResumes.length > 0 ? (
            filteredResumes.map((resume: ResumeType) => (
              <Link to={`/home/resources/resumes/${resume.id}`} key={resume.id}>
                <ResumeCard resume={resume} />
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted">
                No resumes found matching your filters.
              </p>
            </div>
          )}
        </div>
      </ScrollShadow>

      <ResumeFilterSidebar
        onFilterChange={setFilters}
        totalResumes={filteredResumes.length}
      />
    </div>
  );
};
