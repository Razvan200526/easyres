import { Card } from '@client/common/components/card';
import { H6 } from '@client/common/components/typography';
import { ProgressBar } from '../components/ProgressBar';

export const GoalsSection = () => {
  return (
    <Card className="bg-background border border-border hover:border-border-hover transition-border duration-300">
      <div className="space-y-4">
        <H6 className="text-lg text-primary">Monthly Goals</H6>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <ProgressBar
            label="Applications This Month"
            current={25}
            target={30}
            color="bg-primary-400"
          />
          <ProgressBar
            label="Follow-ups Sent"
            current={8}
            target={15}
            color="bg-secondary-400"
          />
        </div>
      </div>
    </Card>
  );
};
