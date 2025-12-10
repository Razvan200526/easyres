import { Button } from '@client/common/components/button';
import { Modal, type ModalRefType } from '@client/common/components/Modal';
import { PdfUploader } from '@client/common/components/pdf/PdfUploader';
import { PdfIcon } from '@client/common/icons/PdfIcon';
import { backend } from '@client/shared/backend';
// import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useRef } from 'react';

export const CreateCoverLetterButton = () => {
  // const createModalRef = useRef<ModalRefType>(null);
  const uploadPdfModalRef = useRef<ModalRefType>(null);

  const uploadCoverLetter = async (urls: string[]) => {
    backend.coverLetter.create({
      url: urls[0],
    });
  };

  return (
    <>
      <Button
        color="primary"
        size="sm"
        className="bg-coverletter"
        startContent={<PdfIcon className="size-3.5" />}
        onPress={() => uploadPdfModalRef.current?.open()}
      >
        Upload PDF cover letter
      </Button>
      {/*<Button
        size="sm"
        className="bg-coverletter m-2"
        startContent={<PlusCircleIcon className="size-3.5" />}
        onPress={() => createModalRef.current?.open()}
      >
        Create cover letter
      </Button>*/}
      <Modal
        modalRef={uploadPdfModalRef}
        isDismissable={true}
        isKeyboardDismissDisabled={false}
        hideCloseButton={true}
        className="bg-light p-4 rounded"
      >
        <PdfUploader
          type="coverLetter"
          onUpload={(urls) => uploadCoverLetter(urls)}
        />
      </Modal>
      {/*<Modal
        modalRef={createModalRef}
        isDismissable={true}
        isKeyboardDismissDisabled={false}
        hideCloseButton={true}
        className="bg-light p-4 rounded"
      >
      </Modal>*/}
      {/*TODO : implement creating note from scratch thing.Like a mini word type of thing*/}
    </>
  );
};
