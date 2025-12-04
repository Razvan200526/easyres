import { PageLoader } from '@client/shared/components/PageLoader';
import { useAuth } from '@client/shared/hooks';
import { Skeleton } from '@heroui/react';
import { PdfViewer } from '@shared/components/pdf/PDFViewer';
import { useGetResume } from './hooks';
import { NoResumes } from './NoResumes';
import { ResumeChat } from './ResumeChat';

export const ResumeInspectPage = () => {
  const { data: user } = useAuth();
  const {
    data: resumeData,
    isFetching,
    isError,
  } = useGetResume(user?.id || '');

  if (isFetching) return <PageLoader />;
  if (isError) {
    console.error('There was an error');
    console.error(isError.valueOf);
  }
  if (!resumeData) {
    return <NoResumes />;
  }
  return (
    <div className="m-4 border border-border rounded h-[calc(100dvh-7rem)] flex flex-row">
      <div className="m-4 rounded-xl flex-1">
        {!isFetching ? (
          <PdfViewer
            toolbar={true}
            src={resumeData.url}
            initialPage={0}
            className="rounded border border-resume/20"
          />
        ) : (
          <Skeleton />
        )}
      </div>
      <div className="m-4 flex-1">
        <ResumeChat resume={resumeData} />
      </div>
    </div>
  );
};
