import { useAppSidebarStore } from '@client/appStore';
import { useAuth } from '@client/shared/hooks';
import { cn } from '@heroui/react';
import { Outlet } from 'react-router';
import { PageLoader } from '../PageLoader';
import { Sidebar } from './sidebar/Sidebar';
import { SidebarDrawer } from './sidebar/SidebarDrawer';

export const AuthLayout = () => {
  const { isLoading: isAuthLoading, error } = useAuth();
  const { isMinimized } = useAppSidebarStore();

  if (error) {
    throw error;
  }
  if (isAuthLoading) {
    return <PageLoader />;
  }
  return (
    <div className="min-h-dvh flex flex-row font-medium">
      <SidebarDrawer />
      <div
        className={cn(
          'border-r border-border relative w-52 flex-col gap-8 p-2',
          isMinimized ? 'hidden' : 'hidden 2xl:flex',
        )}
      >
        <Sidebar />
      </div>
      <div className="min-h-dvh w-full font-normal">
        <Outlet />
      </div>
    </div>
  );
};
