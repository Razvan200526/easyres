import { PageLoader } from '@client/shared/components/PageLoader';
import { useAuth } from '@client/shared/hooks';
import { ScrollShadow } from '@heroui/react';
import type { CoverLetterType } from '@sdk/types';
import { Link } from 'react-router';
import { useCoverLetters } from '../resumes/hooks';
import { CoverLetterCard } from './CoverLetterCard';
import { NoCoverLetters } from './NoCoverLetters';

export const CoverLettersPage = () => {
  const { data: user } = useAuth();
  const {
    data: coverLetters,
    isLoading,
    error,
  } = useCoverLetters(user ? user.id : '');
  if (isLoading) return <PageLoader />;
  if (error) return <div>Error loading cover letters</div>;
  if (!coverLetters || coverLetters.length === 0) {
    return <NoCoverLetters />;
  }
  return (
    <ScrollShadow
      size={8}
      className="m-4 bg-background h-full overflow-y-scroll rounded"
    >
      <div className="p-4 grid grid-cols-6 gap-4">
        {coverLetters?.map((coverLetter: CoverLetterType) => (
          <Link
            to={`/home/resources/coverletters/${coverLetter.id}`}
            key={coverLetter.id}
          >
            <CoverLetterCard coverLetter={coverLetter} />
          </Link>
        ))}
      </div>
    </ScrollShadow>
  );
};
