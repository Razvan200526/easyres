import { Checkbox } from '@heroui/react';
import type { CoverLetterType } from '@sdk/types';
import { Card } from '@shared/components/card';
import { PdfPreviewImage } from '@shared/components/pdf/PDFPreviewImage';
import { useDeleteStore } from '../store';

type CoverLetterCardProps = {
  coverLetter: CoverLetterType;
};

export const CoverLetterCard = ({ coverLetter }: CoverLetterCardProps) => {
  const { state, addToDeleteCoverletters, removeFromDeleteCoverletters } =
    useDeleteStore();
  return (
    <Card className="relative flex flex-col hover:border-book w-full gap-4">
      <div className="h-[250px] w-full border border-border-hover rounded p-2 flex items-center justify-center">
        {state && (
          <Checkbox
            className="absolute top-7 right-5 z-50"
            color="danger"
            onValueChange={(isSelected) => {
              if (isSelected) {
                addToDeleteCoverletters(coverLetter.id);
              } else {
                removeFromDeleteCoverletters(coverLetter.id);
              }
            }}
          />
        )}
        <PdfPreviewImage src={coverLetter.url} />
      </div>
    </Card>
  );
};
