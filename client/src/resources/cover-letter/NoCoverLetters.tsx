import { H6 } from '@client/common/components/typography';
import { PdfIcon } from '@client/common/icons/PdfIcon';
import { CreateCoverLetterButton } from './CreateCoverLetterButton';

export const NoCoverLetters = () => {
  return (
    <div className="h-[calc(100dvh-7rem)] m-4">
      <div className="flex items-center justify-center h-full border border-border rounded">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center">
            <PdfIcon className="size-7 m-2 text-coverletter" />
            <H6 className="text-coverletter text-base">
              Get started by adding your first cover letter!
            </H6>
          </div>
          <CreateCoverLetterButton />
        </div>
      </div>
    </div>
  );
};
