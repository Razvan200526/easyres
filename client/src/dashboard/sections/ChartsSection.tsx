import { Card } from '@client/common/components/card';
import { H6 } from '@client/common/components/typography';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartTooltip } from '../components/ChartTooltip';

export const ChartsSection = () => {
  const applicationTrendData = [
    { month: 'Jan', applications: 8, responses: 2, interviews: 1 },
    { month: 'Feb', applications: 12, responses: 4, interviews: 2 },
    { month: 'Mar', applications: 15, responses: 6, interviews: 3 },
    { month: 'Apr', applications: 20, responses: 8, interviews: 4 },
    { month: 'May', applications: 18, responses: 7, interviews: 3 },
    { month: 'Jun', applications: 25, responses: 10, interviews: 5 },
  ];

  const statusData = [
    { name: 'Pending', value: 45, color: '#cabdf5' },
    { name: 'Interviewed', value: 15, color: '#97caea' },
    { name: 'Rejected', value: 35, color: '#f5bdc6' },
    { name: 'Offered', value: 5, color: '#bdf5ca' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {/* Application Trend Chart */}
      <Card className="bg-background border border-border hover:border-border-hover duration-300">
        <div className="space-y-4">
          <H6 className="text-lg text-primary">Application Trends</H6>
          <div className="h-48 md:h-64">
            <ResponsiveContainer
              width="100%"
              height="100%"
              initialDimension={{ width: 320, height: 200 }}
            >
              <AreaChart data={applicationTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stackId="1"
                  stroke="#cabdf5"
                  fill="#cabdf5"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="responses"
                  stackId="2"
                  stroke="#97caea"
                  fill="#97caea"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="interviews"
                  stackId="3"
                  stroke="#bdf5ca"
                  fill="#bdf5ca"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Status Breakdown */}
      <Card className="bg-background border border-border hover:border-border-hover transition-border duration-300">
        <div className="space-y-4">
          <H6 className="text-lg text-primary">Application Status</H6>
          <div className="h-48 md:h-64 min-w-0" style={{ minHeight: 0 }}>
            <ResponsiveContainer
              className="min-w-0"
              minWidth={0}
              width="100%"
              height="100%"
              initialDimension={{ width: 320, height: 200 }}
            >
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${((percent as number) * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={
                    <ChartTooltip
                      valueFormatter={(value) => `${value} applications`}
                    />
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );
};
