import { PageLoader } from '@client/shared/components/PageLoader';
import { ScrollShadow } from '@heroui/react';
import type { ResumeType } from '@sdk/types';
import { Link } from 'react-router';
import { NoResumes } from './components/NoResumes';
import { ResumeCard } from './cards/ResumeCard';
import { SearchIcon } from '@client/common/icons/SearchIcon';
import { useResourceContext } from '../ResourceLayout';

export const ResumePage = () => {
  const {
    filteredResumes,
    resumesLoading,
    totalResumes,
  } = useResourceContext();

  if (resumesLoading) return <PageLoader />;
  if (totalResumes === 0) {
    return <NoResumes />;
  }

  return (
    <div className="m-4 bg-background h-[calc(100dvh-7rem)] rounded">
      <ScrollShadow size={8} className="h-full overflow-y-scroll">
        <div className="p-4">
          {/* Results summary */}
          <div className="mb-4">
            <p className="text-sm text-primary font-semibold">
              Showing{' '}
              <span className="font-bold text-secondary">
                {filteredResumes.length}
              </span>{' '}
              of{' '}
              <span className="font-bold text-secondary">{totalResumes}</span>{' '}
              {totalResumes === 1 ? 'resume' : 'resumes'}
            </p>
          </div>

          {/* Resume grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredResumes.length > 0 ? (
              filteredResumes.map((resume: ResumeType) => (
                <Link
                  to={`/home/resources/resumes/${resume.id}`}
                  key={resume.id}
                >
                  <ResumeCard resume={resume} />
                </Link>
              ))
            ) : (
              <div className="col-span-full h-[calc(100dvh-7rem)] flex flex-col items-center justify-center py-16">
                <div className="p-4 rounded-full bg-primary/10 border border-border mb-4">
                  <SearchIcon className="size-8 text-secondary-text" />
                </div>
                <p className="text-primary font-medium mb-1">
                  No resumes found
                </p>
                <p className="text-sm text-secondary-text">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </div>
        </div>
      </ScrollShadow>
    </div>
  );
};
