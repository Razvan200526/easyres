import { SearchIcon } from '@client/common/icons/SearchIcon';
import { PageLoader } from '@client/shared/components/PageLoader';
import { ScrollShadow } from '@heroui/react';
import type { CoverLetterType } from '@sdk/types';
import { Link } from 'react-router';
import { useResourceContext } from '../ResourceLayout';
import { CoverLetterCard } from './CoverLetterCard';
import { NoCoverLetters } from './NoCoverLetters';

export const CoverLettersPage = () => {
  const { filteredCoverLetters, coverlettersLoading, totalCoverLetters } =
    useResourceContext();

  if (coverlettersLoading) return <PageLoader />;
  if (totalCoverLetters === 0) {
    return <NoCoverLetters />;
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
                {filteredCoverLetters.length}
              </span>{' '}
              of{' '}
              <span className="font-bold text-secondary">
                {totalCoverLetters}
              </span>{' '}
              {totalCoverLetters === 1 ? 'cover letter' : 'cover letters'}
            </p>
          </div>

          {/* Cover letter grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredCoverLetters.length > 0 ? (
              filteredCoverLetters.map((coverLetter: CoverLetterType) => (
                <Link
                  to={`/home/resources/coverletters/${coverLetter.id}`}
                  key={coverLetter.id}
                >
                  <CoverLetterCard coverLetter={coverLetter} />
                </Link>
              ))
            ) : (
              <div className="col-span-full h-[calc(100dvh-7rem)] flex flex-col items-center justify-center py-16">
                <div className="p-4 rounded-full bg-primary/10 border border-border mb-4">
                  <SearchIcon className="size-8 text-secondary-text" />
                </div>
                <p className="text-primary font-medium mb-1">
                  No cover letters found
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
