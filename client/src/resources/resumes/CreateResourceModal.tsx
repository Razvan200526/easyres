import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@shared/components/button';
import { Modal, type ModalRefType } from '@shared/components/Modal';
import { useRef } from 'react';
import { CreateCoverLetterCard } from '../cover-letter/CreateCoverLetterCard';
// import { CreatePortfolioCard } from '../portfolio/CreatePortfolioCard';
import { CreateResumeCard } from './CreateResumeCard';

export const CreateResourceModal = () => {
  const ref = useRef<ModalRefType | null>(null);

  return (
    <>
      <Button
        variant="flat"
        isIconOnly={true}
        radius="md"
        onPress={() => ref.current?.open()}
      >
        <PlusIcon className="size-4" />
      </Button>

      <Modal
        size={'5xl'}
        className="bg-background rounded"
        modalRef={ref}
        hideCloseButton={true}
      >
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CreateResumeCard />
          <CreateCoverLetterCard />
        </div>
      </Modal>
    </>
  );
};
