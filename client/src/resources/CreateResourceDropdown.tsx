import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@shared/components/button';
import {
  Dropdown,
  type DropdownItemDataType,
} from '@shared/components/Dropdown';
import { AddResourceIcon } from '@shared/icons/AddResourceIcon';
import { CoverLetter } from '@shared/icons/CoverLetter';
import { PortfolioIcon } from '@shared/icons/PortfolioIcon';
import { ResumeIcon } from '@shared/icons/ResumeIcon';

const fakeItems: DropdownItemDataType[] = [
  {
    key: 'Resume',
    label: 'Resume',
    className:
      'text-resume data-[hover=true]:bg-resume/10 data-[hover=true]:text-resume',
    icon: <ResumeIcon className="size-5" />,
  },
  {
    key: 'Cover Letter',
    label: 'Cover Letter',
    className:
      'text-cover data-[hover=true]:bg-cover/10 data-[hover=true]:text-cover',
    icon: <CoverLetter className="size-5" />,
  },
  {
    key: 'Portfolio',
    label: 'Portfolio',
    className:
      'text-portfolio data-[hover=true]:bg-portfolio/10 data-[hover=true]:text-portfolio',
    icon: <PortfolioIcon className="size-5" />,
  },
];
export const CreateResourceDropdown = () => {
  return (
    <Dropdown
      className="border-border"
      trigger={
        <Button variant="solid" color="primary" className="flex items-center">
          <AddResourceIcon className="size-7" />
          <p className="font-primary">Create</p>
        </Button>
      }
      items={fakeItems.map((item) => ({
        ...item,
        endContent: item.icon,
        icon: <PlusCircleIcon className="size-5" />,
      }))}
    />
  );
};
