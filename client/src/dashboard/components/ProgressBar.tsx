interface ProgressBarProps {
  label: string;
  current: number;
  target: number;
  color?: string;
  className?: string;
}

export const ProgressBar = ({
  label,
  current,
  target,
  color = 'bg-primary-400',
  className,
}: ProgressBarProps) => {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className={`space-y-2 ${className || ''}`}>
      <div className="flex justify-between text-sm">
        <span className="text-light-700">{label}</span>
        <span className="font-medium text-light-900">
          {current}/{target}
        </span>
      </div>
      <div className="w-full bg-light-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
