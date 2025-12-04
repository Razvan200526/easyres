import { H6 } from '@client/common/components/typography';
import { formatDate } from '@client/common/utils';
import { Checkbox } from '@heroui/react';
import type { ResumeType } from '@sdk/types';
import { Card } from '@shared/components/card';
import { PdfPreviewImage } from '@shared/components/pdf/PDFPreviewImage';
import { useDeleteStore } from '../store';

type ResumeCardProps = {
  resume: ResumeType;
};
export const ResumeCard = ({ resume }: ResumeCardProps) => {
  const { state, addToDeleteResumes, removeFromDeleteResumes } =
    useDeleteStore();
  return (
    <Card className="relative flex flex-col border border-border transition-all duration-300 hover:border-resume/50 ease-in-out w-full">
      <div className="h-[250px] w-full rounded flex items-center justify-center">
        {state && (
          <Checkbox
            radius="sm"
            className="absolute top-7 right-5 z-50"
            color="danger"
            onValueChange={(isSelected) => {
              if (isSelected) {
                addToDeleteResumes(resume.id);
              } else {
                removeFromDeleteResumes(resume.id);
              }
            }}
          />
        )}
        <PdfPreviewImage src={resume.url} />
        <div className="absolute bottom-0 left-0 z-10 w-full flex flex-col bg-background rounded-b-lg border-t border-border transition-all duration-300 hover:border-resume/50 h-1/3 p-2">
          <div className="flex text-center justify-center">
            <H6>{resume.name.split('.')[0]}</H6>
          </div>
          <div className="flex-1 flex items-end justify-between">
            <p className="text-primary text-sm">
              Uploaded {formatDate(resume.uploadedAt)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
