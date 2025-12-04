interface ActivityItemProps {
  action: string;
  time: string;
  type: 'application' | 'interview' | 'response' | 'resource';
  className?: string;
}

export const ActivityItem = ({
  action,
  time,
  type,
  className,
}: ActivityItemProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'application':
        return 'bg-primary-400';
      case 'interview':
        return 'bg-success-400';
      case 'response':
        return 'bg-secondary-400';
      case 'resource':
        return 'bg-light-400';
      default:
        return 'bg-light-400';
    }
  };

  return (
    <div
      className={`flex items-start space-x-3 p-3 rounded-lg bg-background border border-light-200 ${className || ''}`}
    >
      <div className={`w-2 h-2 rounded-full mt-2 ${getTypeColor(type)}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-light-900">{action}</p>
        <p className="text-xs text-light-600">{time}</p>
      </div>
    </div>
  );
};
