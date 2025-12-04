import { AiChatIcon } from '@shared/icons/AiChatIcon';
import { ApplicationsIcon } from '@shared/icons/ApplicationsIcon';
import { ResourceIcon } from '@shared/icons/ResourceIcon';
import { SettingsIcon } from '@shared/icons/SettingsIcon';
import { LayoutDashboard } from 'lucide-react';

export const useSideBarItems = () => {
  // const { id } = useParams();

  const mainItems = [
    {
      key: 'Dashboard',
      icon: LayoutDashboard,
      href: 'dashboard',
      title: 'Dashboard',
    },
    {
      key: 'Resources',
      icon: ResourceIcon,
      href: 'resources',
      title: 'Resources',
    },
    {
      key: 'applications',
      href: 'applications',
      icon: ApplicationsIcon,
      title: 'Applications',
    },
    {
      key: 'settings',
      href: 'settings',
      icon: SettingsIcon,
      title: 'Settings',
    },
  ];

  const secondaryItems = [
    {
      key: 'ask',
      href: 'ask',
      icon: AiChatIcon,
      title: 'ask',
    },
  ];

  return { secondaryItems, mainItems };
};
