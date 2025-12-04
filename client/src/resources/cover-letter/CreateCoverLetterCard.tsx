import { Card } from '@shared/components/card';
import { H6 } from '@shared/components/typography';
import { CreateCoverLetterButton } from './CreateCoverLetterButton';

export const CreateCoverLetterCard = () => {
  return (
    <Card className="rounded border-coverletter/10 bg-coverletter/5 h-full flex flex-col">
      <div className="flex items-center justify-center">
        <div className="h-[150px] flex flex-col items-center justify-center">
          <H6 className="text-coverletter p-4 text-xl">
            Create or upload a cover letter
          </H6>
          <CreateCoverLetterButton />
        </div>
      </div>
    </Card>
  );
};
