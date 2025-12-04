interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  labelFormatter?: (label: string) => string;
  valueFormatter?: (value: any, name?: string) => string;
  className?: string;
}

export const ChartTooltip = ({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
  className,
}: ChartTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div
      className={`bg-light-50 border border-light-200 rounded-lg p-3 shadow-lg ${
        className || ''
      }`}
    >
      {label && (
        <p className="text-sm font-medium text-light-900 mb-2">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-light-700 capitalize">
              {entry.name}:
            </span>
            <span className="text-sm font-semibold text-light-900">
              {valueFormatter
                ? valueFormatter(entry.value, entry.name)
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
