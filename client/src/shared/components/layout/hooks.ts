import { AiChatIcon } from '@client/common/icons/AiChatIcon';
import { ApplicationsIcon } from '@client/common/icons/ApplicationsIcon';
import { ResourceIcon } from '@client/common/icons/ResourceIcon';
import { SettingsIcon } from '@client/common/icons/SettingsIcon';
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
      key: 'ask',
      href: 'ask',
      icon: AiChatIcon,
      title: 'Ask AI',
    },
  ];

  const secondaryItems = [
    {
      key: 'settings',
      href: 'settings',
      icon: SettingsIcon,
      title: 'Settings',
    },
  ];

  return { secondaryItems, mainItems };
};
