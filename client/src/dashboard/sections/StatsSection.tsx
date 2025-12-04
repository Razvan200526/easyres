import { useApplications } from '@client/applications/hooks/applicationHooks';
import { useAuth } from '@client/shared/hooks';
import { StatsCard } from '../components/StatsCard';
import { StatsSectionSkeleton } from './StatsSectionSkeleton';

export const StatsSection = () => {
  const { data: user } = useAuth();
  const { data: applications, isFetching } = useApplications(user?.id || '');

  const quickStats = [
    {
      label: 'Total Applications',
      value: applications?.length || 0,
      change: '+12',
      trend: 'up' as const,
    },
    {
      label: 'Response Rate',
      value: '32%',
      change: '+5%',
      trend: 'up' as const,
    },
    {
      label: 'Interviewing',
      value:
        applications?.filter((app) => app.status === 'interviewing').length ||
        0,
      change: '+3',
      trend: 'up' as const,
    },
    { label: 'This Week', value: 8, change: '-2', trend: 'down' as const },
  ];

  if (isFetching) {
    return <StatsSectionSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {quickStats.map((stat, index) => (
        <StatsCard
          key={index}
          label={stat.label}
          value={stat.value}
          change={stat.change}
          trend={stat.trend}
        />
      ))}
    </div>
  );
};
