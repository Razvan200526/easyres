import { useAuth } from '@client/shared/hooks';
import { Button } from '@shared/components/button';
import { Card } from '@shared/components/card';
import type { ModalRefType } from '@shared/components/Modal';
import { Toast } from '@shared/components/toast';
import { H6 } from '@shared/components/typography';
import { useDeleteStore } from '../store';
import { useDeleteCoverLetters, useDeleteResumes } from './hooks';

export const DeleteResourceCard = ({ ref }: { ref: ModalRefType | null }) => {
  const { deletingResumeIds, stopDeleting, deletingCoverletterIds } =
    useDeleteStore();
  const { data: user } = useAuth();
  // biome-ignore lint/style/noNonNullAssertion: <trust me>˝˝
  const { mutateAsync: deleteResumeMutation } = useDeleteResumes(user!.id);
  const { mutateAsync: deleteCoverletterMutation } = useDeleteCoverLetters(
    user?.id || '',
  );
  const handleDelete = async () => {
    try {
      if (deletingResumeIds.length > 0) {
        const deletedResumes = await deleteResumeMutation(deletingResumeIds);
        if (deletedResumes?.success) {
          Toast.success({ description: 'Resumes deleted succesfully' });
          ref?.close();
          stopDeleting();
        } else {
          throw new Error('Delete resume operation failed');
        }
      }
      if (deletingCoverletterIds.length > 0) {
        const deletedCoverletters = await deleteCoverletterMutation(
          deletingCoverletterIds,
        );
        if (deletedCoverletters?.success) {
          Toast.success({ description: 'Cover letters deleted succesfully' });
          ref?.close();
          stopDeleting();
        } else {
          throw new Error('Delete cover letter operation failed');
        }
      }
    } catch (error) {
      console.error('Delete error:', error);
      Toast.error({ description: 'Failed to delete resources' });
    }
  };

  const handleCancel = () => {
    ref?.close();
    stopDeleting(); // This will close delete mode and clear the array
  };

  return (
    <Card className="rounded border-resume/10 bg-resume/5 flex flex-col gap-4">
      <H6 className="text-danger">Delete</H6>
      <p>This action is permanent and cannot be undone.</p>
      <p>
        You are about to delete{' '}
        {deletingResumeIds.length + deletingCoverletterIds.length} item(s).
      </p>

      <div className="flex flex-row gap-2 justify-end">
        <Button variant="light" color="primary" onPress={handleCancel}>
          Cancel
        </Button>
        <Button variant="solid" color="danger" onPress={handleDelete}>
          Delete {deletingResumeIds.length + deletingCoverletterIds.length}{' '}
          item(s)
        </Button>
      </div>
    </Card>
  );
};
