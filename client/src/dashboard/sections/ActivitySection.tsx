import { Card } from '@client/common/components/card';
import { H6 } from '@client/common/components/typography';
import { ScrollShadow } from '@heroui/react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ActivityItem } from '../components/ActivityItem';
import { ChartTooltip } from '../components/ChartTooltip';

export const ActivitySection = () => {
  const weeklyData = [
    { day: 'Mon', count: 3 },
    { day: 'Tue', count: 7 },
    { day: 'Wed', count: 5 },
    { day: 'Thu', count: 8 },
    { day: 'Fri', count: 4 },
    { day: 'Sat', count: 2 },
    { day: 'Sun', count: 1 },
  ];

  const recentActivities = [
    {
      action: 'Applied to Software Engineer at TechCorp',
      time: '2 hours ago',
      type: 'application' as const,
    },
    {
      action: 'Interview scheduled with DataFlow Inc',
      time: '5 hours ago',
      type: 'interview' as const,
    },
    {
      action: 'Received response from StartupXYZ',
      time: '1 day ago',
      type: 'response' as const,
    },
    {
      action: 'Updated resume version 2.1',
      time: '2 days ago',
      type: 'resource' as const,
    },
    {
      action: 'Applied to Backend Developer at CloudTech',
      time: '3 days ago',
      type: 'application' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      {/* Weekly Activity Chart */}
      <Card className="bg-background border border-border hover:border-border-hover duration-300">
        <div className="space-y-4">
          <H6 className="text-lg text-primary">This Week</H6>
          <div className="h-40 md:h-48">
            <ResponsiveContainer
              width="100%"
              height="100%"
              initialDimension={{ width: 320, height: 200 }}
            >
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  content={
                    <ChartTooltip
                      valueFormatter={(value) => `${value} applications`}
                    />
                  }
                />
                <Bar dataKey="count" fill="#cabdf5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-background border border-border lg:col-span-2 hover:border-border-hover duration-300">
        <div className="space-y-4">
          <H6 className="text-lg text-primary">Recent Activity</H6>
          <ScrollShadow
            size={4}
            className="space-y-3 max-h-40 md:max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-light-300 scrollbar-track-transparent"
          >
            {recentActivities.map((activity, index) => (
              <ActivityItem
                key={index}
                action={activity.action}
                time={activity.time}
                type={activity.type}
              />
            ))}
          </ScrollShadow>
        </div>
      </Card>
    </div>
  );
};
