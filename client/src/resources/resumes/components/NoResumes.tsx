import { H6 } from '@shared/components/typography';
import { PdfIcon } from '@shared/icons/PdfIcon';
import { CreateResumeButton } from '../buttons/CreateResumeButton';

export const NoResumes = () => {
  return (
    <div className="h-[calc(100dvh-7rem)] m-4">
      <div className="flex items-center justify-center h-full border border-border rounded">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center">
            <PdfIcon className="size-7 m-2 text-resume" />
            <H6 className="text-resume text-base">
              Get started by adding your first resume!
            </H6>
          </div>
          <CreateResumeButton />
        </div>
      </div>
    </div>
  );
};
