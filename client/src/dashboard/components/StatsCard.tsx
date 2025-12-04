import { Card } from '@shared/components/card';
import { H6 } from '@shared/components/typography';

interface StatsCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  className?: string;
}

export const StatsCard = ({
  label,
  value,
  change,
  trend,
  className,
}: StatsCardProps) => {
  return (
    <Card
      className={`bg-background border-border hover:border-border-hover transition-all duration-200 cursor-pointer group ${className || ''}`}
    >
      <div className="space-y-2">
        <H6>{label}</H6>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-secondary-text">{value}</span>
          {change && (
            <span
              className={`text-sm font-semibold transition-all duration-200 ${
                trend === 'up'
                  ? 'text-success-600 group-hover:text-success-700'
                  : 'text-danger-600 group-hover:text-danger-700'
              }`}
            >
              {change}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
