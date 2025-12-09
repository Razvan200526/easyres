import type { ResumeType } from '@client/sdk/types';
import { Link } from 'react-router';
import { ResumeCard } from '../cards/ResumeCard';
import NoFilteredResumes from './NoFilteredResumes';

export const ResumeList = ({
  filteredResumes,
}: {
  filteredResumes: ResumeType[];
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {filteredResumes.length > 0 ? (
        filteredResumes.map((resume: ResumeType) => (
          <Link to={`/home/resources/resumes/${resume.id}`} key={resume.id}>
            <ResumeCard resume={resume} />
          </Link>
        ))
      ) : (
        <NoFilteredResumes />
      )}
    </div>
  );
};
