import { useAuth } from '@client/shared/hooks';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@shared/components/button';
import { NumberChip } from '@shared/components/chips/NumberChip';
import { NumberChipSkeleton } from '@shared/components/chips/NumberChipSkeleton';
import { H4 } from '@shared/components/typography';
import { useState } from 'react';
import { Outlet } from 'react-router';
import { CreateApplicationModal } from '../components/CreateApplicationModal';
import { useApplications } from '../hooks/applicationHooks';

export const ApplicationsLayout = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: user } = useAuth();
  const { data: applications, isFetching } = useApplications(user?.id || '');
  const handleCreateApplication = () => {
    setShowCreateForm(true);
  };

  return (
    <div className="h-[calc(100dvh)] bg-background flex flex-col">
      <nav className="p-4 flex flex-row items-center justify-between w-full border-b border-border bg-background">
        <div className="flex items-center justify-center gap-2">
          <H4>Applications</H4>
          {isFetching ? (
            <NumberChipSkeleton />
          ) : (
            <NumberChip value={applications?.length || 0} />
          )}
        </div>
        <Button
          color="primary"
          variant="solid"
          size="sm"
          startContent={<PlusIcon className="size-4" />}
          onPress={handleCreateApplication}
        >
          Create
        </Button>
      </nav>
      <div className="flex-1">
        <Outlet />
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            <CreateApplicationModal onClose={() => setShowCreateForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
