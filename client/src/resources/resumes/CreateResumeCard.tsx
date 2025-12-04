import { Card } from '@shared/components/card';
import { H6 } from '@shared/components/typography';
import { CreateResumeButton } from './CreateResumeButton';

export const CreateResumeCard = () => {
  return (
    <Card className="rounded border-resume/10 bg-resume/5 flex flex-col gap-4">
      <div className="h-[150px] flex flex-col items-center justify-center">
        <H6 className="text-resume p-4 text-xl">Upload resume</H6>
        <CreateResumeButton />
      </div>
    </Card>
  );
};
