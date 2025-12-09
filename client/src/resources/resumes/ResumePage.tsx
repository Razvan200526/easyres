import { PageLoader } from '@client/shared/components/PageLoader';
import { ScrollShadow } from '@heroui/react';
import { useMemo } from 'react';
import { useResourceContext } from '../ResourceLayout';
import { FilteredResumeHeader } from './components/FilteredResumeHeader';
import { NoResumes } from './components/NoResumes';
import { ResumeList } from './components/ResumeList';

export const ResumePage = () => {
  const { filteredResumes, resumesLoading, totalResumes } =
    useResourceContext();
  const filteredResumesMemo = useMemo(() => {
    return filteredResumes;
  }, [filteredResumes]);

  if (resumesLoading) return <PageLoader />;
  if (totalResumes === 0) {
    return <NoResumes />;
  }

  return (
    <div className="m-4 bg-background h-[calc(100dvh-7rem)] rounded">
      <ScrollShadow size={8} className="h-full overflow-y-scroll">
        <div className="p-4">
          <FilteredResumeHeader
            filteredResumesMemo={filteredResumesMemo}
            totalResumes={totalResumes}
          />
          <ResumeList filteredResumes={filteredResumesMemo} />
        </div>
      </ScrollShadow>
    </div>
  );
};
