import { useAuth } from '@client/shared/hooks';
import { TrashIcon } from '@heroicons/react/24/outline';
import { cn, Tab, Tabs } from '@heroui/react';
import { Button } from '@shared/components/button';
import { NumberChip } from '@shared/components/chips/NumberChip';
import type { ModalRefType } from '@shared/components/Modal';
import { H4 } from '@shared/components/typography';
import { useQueryState } from 'nuqs';
import { useRef } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { useChatSessions } from './hooks';
import { CreateResourceModal } from './resumes/CreateResourceModal';
import { DeleteResourceModal } from './resumes/DeleteResourceModal';
import { useCoverLetters, useResumes } from './resumes/hooks';
import { useDeleteStore } from './store';
export const ResourceLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useAuth();
  const deleteModalRef = useRef<ModalRefType | null>(null);
  const { data: resumes } = useResumes(user?.id || '');
  const { data: coverletters } = useCoverLetters(user?.id || '');
  const { data: chats } = useChatSessions(user?.id || '');
  const {
    state,
    startDeleting,
    stopDeleting,
    deletingResumeIds,
    deletingCoverletterIds,
  } = useDeleteStore();

  const [tab, setTab] = useQueryState('resourceTab', {
    defaultValue: 'resume',
  });

  const fakeItems = [
    {
      key: 'resume',
      label: 'Resumes',
      href: '.',
      content: 'Resume content',
      className: 'text-resume data-[hover=true]:bg-resume/10',
      activeClassName: 'bg-resume/15 border-resume',
      count: resumes?.length || 0,
    },
    {
      key: 'cover',
      label: 'Cover Letters',
      href: 'coverletter',
      content: 'Cover Letter content',
      className: 'text-coverletter data-[hover=true]:bg-coverletter/10 ',
      activeClassName: 'bg-coverletter/15 border-coverletter',
      count: coverletters?.length || 0,
    },
    {
      key: 'chats',
      label: 'Chats',
      href: 'chats',
      content: 'All chats',
      className: 'text-chats data-[hover=true]:bg-chats/10',
      activeClassName: 'bg-chats/15 border-chats',
      count: chats?.length || 0,
    },
  ];

  const handleSelectionChange = (key: string | number) => {
    const item = fakeItems.find((i) => i.key === key);
    if (item) {
      setTab(item.key);
      navigate(item.href);
    }
  };

  const activeTabKey =
    fakeItems.find((item) => {
      const pathEnd = location.pathname.split('/').pop();
      if (item.href === '.') {
        return pathEnd === 'resources';
      }
      return item.href === pathEnd;
    })?.key || 'Resume';

  const activeTabItem = fakeItems.find((item) => item.key === tab);
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
          {fakeItems.map((item) => (
            <Tab
              key={item.key}
              title={
                <div
                  className={cn(
                    'flex items-center space-x-1 font-medium',
                    item.className,
                  )}
                >
                  <NavLink to={item.href}>{item.label}</NavLink>
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
          <CreateResourceModal />
        </div>
      </nav>
      <div className="flex-1 overflow-y-scroll">
        <Outlet />
      </div>
      <DeleteResourceModal modalRef={deleteModalRef} />
    </div>
  );
};
