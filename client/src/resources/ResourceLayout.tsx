import { Button } from '@client/common/components/button';
import { NumberChip } from '@client/common/components/chips/NumberChip';
import {
  Dropdown,
  type DropdownItemDataType,
} from '@client/common/components/dropdown/Dropdown';
import type { ModalRefType } from '@client/common/components/Modal';
import { Modal } from '@client/common/components/Modal';
import { PdfUploader } from '@client/common/components/pdf/PdfUploader';
import { Toast } from '@client/common/components/toast';
import { H4 } from '@client/common/components/typography';
import { CoverLetterIcon } from '@client/common/icons/CoverletterIcon';
import { ResumeIcon } from '@client/common/icons/ResumeIcon';
import { backend } from '@client/shared/backend';
import { useAuth } from '@client/shared/hooks';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { cn, Tab, Tabs } from '@heroui/react';
import type { CoverLetterType, ResumeType } from '@sdk/types';
import { isUrlValid } from '@shared/validators/isUrlValid';
import { useMemo, useRef } from 'react';
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from 'react-router';
import { useChatSessions } from './hooks';
import { useCoverLetters, useResumes } from './resumes/hooks';
import { DeleteResourceModal } from './resumes/modals/DeleteResourceModal';
import {
  coverLetterFilterConfig,
  filterAndSortResources,
  ResourceFilterSidebar,
  resumeFilterConfig,
  useFilterStore,
} from './shared';
import { useDeleteStore } from './store';

export type ResourceOutletContext = {
  filteredResumes: ResumeType[];
  filteredCoverLetters: CoverLetterType[];
  resumesLoading: boolean;
  coverlettersLoading: boolean;
  totalResumes: number;
  totalCoverLetters: number;
};

export const useResourceContext = () =>
  useOutletContext<ResourceOutletContext>();

export const ResourceLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useAuth();
  const deleteModalRef = useRef<ModalRefType | null>(null);
  const uploadResumeRef = useRef<ModalRefType | null>(null);
  const uploadCoverLetterRef = useRef<ModalRefType | null>(null);
  const { data: resumes, isLoading: resumesLoading } = useResumes(
    user?.id || '',
  );
  const { data: coverletters, isLoading: coverlettersLoading } =
    useCoverLetters(user?.id || '');
  const { data: chats } = useChatSessions(user?.id || '');
  const {
    state,
    startDeleting,
    stopDeleting,
    deletingResumeIds,
    deletingCoverletterIds,
  } = useDeleteStore();

  const resumeFilters = useFilterStore((state) => state.resumeFilters);
  const coverLetterFilters = useFilterStore(
    (state) => state.coverLetterFilters,
  );

  const filteredResumes = useMemo(() => {
    if (!resumes) return [];
    return filterAndSortResources(resumes, resumeFilters);
  }, [resumes, resumeFilters]);

  const filteredCoverLetters = useMemo(() => {
    if (!coverletters) return [];
    return filterAndSortResources(coverletters, coverLetterFilters);
  }, [coverletters, coverLetterFilters]);

  const handleUploadResume = async (urls: string[]) => {
    if (!isUrlValid(urls[0])) {
      Toast.error({ description: 'Invalid pdf URL' });
      return;
    }
    backend.resume.create({
      url: urls[0],
    });
  };

  const handleUploadCoverLetter = async (urls: string[]) => {
    if (!isUrlValid(urls[0])) {
      Toast.error({ description: 'Invalid pdf URL' });
      return;
    }
    await backend.coverLetter.create({
      url: urls[0],
    });
  };

  const dropdownItems: DropdownItemDataType[] = [
    {
      key: 'resume',
      label: 'Resume',
      className:
        'text-resume data-[hover=true]:bg-resume/10 data-[hover=true]:text-secondary-text',
      icon: <ResumeIcon className="size-4" />,
      onAction: () => uploadResumeRef.current?.open(),
    },
    {
      key: 'cover-letter',
      label: 'Cover Letter',
      className:
        'text-coverletter data-[hover=true]:bg-coverletter/10 data-[hover=true]:text-secondary-text',
      icon: <CoverLetterIcon className="size-4" />,
      onAction: () => uploadCoverLetterRef.current?.open(),
    },
  ];

  const resourceItems = [
    {
      key: 'resume',
      label: 'Resumes',
      href: '.',
      className: 'text-resume data-[hover=true]:bg-resume/10',
      activeClassName: 'bg-resume/15 border-resume',
      count: resumes?.length || 0,
    },
    {
      key: 'cover',
      label: 'Cover Letters',
      href: 'coverletter',
      className: 'text-coverletter data-[hover=true]:bg-coverletter/10 ',
      activeClassName: 'bg-coverletter/15 border-coverletter',
      count: coverletters?.length || 0,
    },
    {
      key: 'chats',
      label: 'Chats',
      href: 'chats',
      className: 'text-chats data-[hover=true]:bg-chats/10',
      activeClassName: 'bg-chats/15 border-chats',
      count: chats?.length || 0,
    },
  ];

  const activeTabKey = useMemo(() => {
    const pathEnd = location.pathname.split('/').pop();
    if (pathEnd === 'resources') return 'resume';
    if (pathEnd === 'coverletter') return 'cover';
    if (pathEnd === 'chats') return 'chats';
    return 'resume';
  }, [location.pathname]);

  const activeTabItem = resourceItems.find((item) => item.key === activeTabKey);

  const handleSelectionChange = (key: string | number) => {
    const item = resourceItems.find((i) => i.key === key);
    if (item) {
      navigate(item.href);
    }
  };

  const isInspectPage =
    location.pathname.includes('/resumes/') ||
    location.pathname.includes('/coverletters/');
  const showFilterSidebar =
    !isInspectPage && (activeTabKey === 'resume' || activeTabKey === 'cover');
  const currentFilterConfig =
    activeTabKey === 'resume' ? resumeFilterConfig : coverLetterFilterConfig;

  const sidebarFilteredCount =
    activeTabKey === 'resume'
      ? filteredResumes.length
      : filteredCoverLetters.length;
  const sidebarLoading =
    activeTabKey === 'resume' ? resumesLoading : coverlettersLoading;

  return (
    <div className="h-[calc(100dvh)] bg-background flex flex-col">
      <nav className="px-4 py-2 flex flex-row items-center justify-between w-full border-b border-border bg-background">
        <H4 className="text-base font-primary">Resources</H4>
        <Tabs
          onSelectionChange={handleSelectionChange}
          selectedKey={activeTabKey}
          classNames={{
            base: 'w-full px-4 py-1',
            tabContent: 'text-primary',
            cursor: cn('rounded border-none', activeTabItem?.activeClassName),
            tab: cn(
              'rounded data-[hover-unselected=true]:bg-primary-100/80 py-4 shadow-none',
              'border-none transition-all duration-300 data-[hover-unselected=true]:opacity-100',
            ),
            panel: 'p-0',
          }}
          aria-label="resource-tabs"
          variant="light"
          radius="sm"
          size="sm"
        >
          {resourceItems.map((item) => (
            <Tab
              key={item.key}
              title={
                <div
                  className={cn(
                    'flex items-center space-x-1 font-medium',
                    item.className,
                  )}
                >
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count !== null && (
                    <NumberChip
                      className={cn(item.activeClassName, `text-${item.key}`)}
                      value={item.count}
                    />
                  )}
                </div>
              }
            />
          ))}
        </Tabs>

        {deletingResumeIds.length + deletingCoverletterIds.length > 0 ? (
          <Button
            variant="solid"
            color="danger"
            className="px-4 m-2"
            onPress={() => {
              deleteModalRef.current?.open();
            }}
          >
            Delete {deletingResumeIds.length + deletingCoverletterIds.length}
            {deletingResumeIds.length + deletingCoverletterIds.length === 1
              ? ' item'
              : ' items'}
          </Button>
        ) : null}
        {resumes?.length || coverletters?.length ? (
          <Button
            variant="light"
            isIconOnly={true}
            color="danger"
            radius="full"
            onPress={() => {
              state ? stopDeleting() : startDeleting();
            }}
          >
            <TrashIcon className="size-3.5" />
          </Button>
        ) : null}
        <div className="px-1">
          <Dropdown
            items={dropdownItems}
            onAction={(key) => {
              const item = dropdownItems.find((i) => i.key === key);
              item?.onAction?.();
            }}
            trigger={
              <Button variant="flat" isIconOnly={true} radius="md">
                <PlusIcon className="size-4" />
              </Button>
            }
          />
        </div>
      </nav>
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-scroll">
          <Outlet
            context={
              {
                filteredResumes,
                filteredCoverLetters,
                resumesLoading,
                coverlettersLoading: coverlettersLoading,
                totalResumes: resumes?.length || 0,
                totalCoverLetters: coverletters?.length || 0,
              } satisfies ResourceOutletContext
            }
          />
        </div>
        {showFilterSidebar && (
          <div className="py-2 pr-2">
            <ResourceFilterSidebar
              config={currentFilterConfig}
              filteredCount={sidebarFilteredCount}
              isLoading={sidebarLoading}
              onServerFilterChange={() => {}}
            />
          </div>
        )}
      </div>
      <DeleteResourceModal modalRef={deleteModalRef} />
      <Modal
        modalRef={uploadResumeRef}
        isDismissable={true}
        isKeyboardDismissDisabled={false}
        hideCloseButton={true}
        className="bg-light p-4 rounded"
      >
        <PdfUploader
          type="resume"
          onUpload={(urls) => handleUploadResume(urls)}
        />
      </Modal>
      <Modal
        modalRef={uploadCoverLetterRef}
        isDismissable={true}
        isKeyboardDismissDisabled={false}
        hideCloseButton={true}
        className="bg-light p-4 rounded"
      >
        <PdfUploader
          type="coverLetter"
          onUpload={(urls) => handleUploadCoverLetter(urls)}
        />
      </Modal>
    </div>
  );
};
