import { backend } from '@client/shared/backend';
import { Button } from '@shared/components/button';
import { Modal, type ModalRefType } from '@shared/components/Modal';
import { PdfUploader } from '@shared/components/pdf/PdfUploader';
import { PdfIcon } from '@shared/icons/PdfIcon';
import { useRef } from 'react';

export const CreateResumeButton = () => {
  // const createModalRef = useRef<ModalRefType>(null);
  const uploadPdfModalRef = useRef<ModalRefType>(null);

  const uploadResume = async (urls: string[]) => {
    backend.resume.create({
      url: urls[0],
    });
  };

  return (
    <>
      <Button
        color="primary"
        size="sm"
        className="bg-resume"
        startContent={<PdfIcon className="size-3.5" />}
        onPress={() => uploadPdfModalRef.current?.open()}
      >
        Upload PDF resume
      </Button>
      {/*<Button
        size="sm"
        className="bg-resume m-2"
        startContent={<PlusCircleIcon className="size-3.5" />}
        onPress={() => createModalRef.current?.open()}
      >
        Create resume
      </Button>*/}
      <Modal
        modalRef={uploadPdfModalRef}
        isDismissable={true}
        isKeyboardDismissDisabled={false}
        hideCloseButton={true}
        className="bg-light p-4 rounded"
      >
        <PdfUploader type="resume" onUpload={(urls) => uploadResume(urls)} />
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
