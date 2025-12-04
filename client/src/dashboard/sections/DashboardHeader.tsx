import { H4 } from '@shared/components/typography';

export const DashboardHeader = () => {
  return (
    <nav className="p-4 flex flex-row items-center justify-between w-full border-b border-border bg-background">
      <H4 className="text-primary">Dashboard</H4>
    </nav>
  );
};
