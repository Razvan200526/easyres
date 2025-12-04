import { useAppSidebarStore } from '@client/appStore';
import { cn, Drawer, DrawerContent } from '@heroui/react';
import { Button } from '@shared/components/button';
import { BurgerIcon } from '@shared/icons/BurgerIcon';
import { Sidebar } from './Sidebar';
import { SidebarMinimize } from './SidebarMinimize';

export const SidebarDrawer = () => {
  const { isOpen, open, onOpenChange, isMinimized } = useAppSidebarStore();

  return (
    <>
      <div
        className={cn(
          'flex-col items-center gap-4 border-r border-border p-2 bg-background',
          isMinimized ? 'flex' : 'flex 2xl:hidden',
        )}
      >
        <Button
          variant="light"
          color="primary"
          isIconOnly={true}
          onPress={open}
          size="md"
          className="rounded-full"
        >
          <BurgerIcon className="size-5" />
        </Button>
        <div className="flex flex-col items-center gap-8 h-full">
          <SidebarMinimize onOpen={open} />
        </div>
      </div>
      <Drawer
        backdrop="transparent"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="left"
        size="sm"
        hideCloseButton={true}
        className="w-60"
      >
        <DrawerContent className="bg-background rounded-tr-none rounded-br-none flex w-72 flex-col gap-8 p-2">
          <Sidebar />
        </DrawerContent>
      </Drawer>
    </>
  );
};
