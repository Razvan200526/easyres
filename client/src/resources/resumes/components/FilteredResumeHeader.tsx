import type { ResumeType } from '@client/sdk/types';

export const FilteredResumeHeader = ({
  filteredResumesMemo,
  totalResumes,
}: {
  filteredResumesMemo: ResumeType[];
  totalResumes: number;
}) => {
  return (
    <div className="mb-4">
      <p className="text-sm text-primary font-semibold">
        Showing{' '}
        <span className="font-bold text-secondary">
          {filteredResumesMemo.length}
        </span>{' '}
        of <span className="font-bold text-secondary">{totalResumes}</span>{' '}
        {totalResumes === 1 ? 'resume' : 'resumes'}
      </p>
    </div>
  );
};
