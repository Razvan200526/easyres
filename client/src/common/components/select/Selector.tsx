import { Select, SelectItem, type SelectProps } from '@heroui/react';

interface SelectorItem {
  value: string;
  label: string;
}

type SelectItemClassNames = React.ComponentProps<
  typeof SelectItem
>['classNames'];

interface CustomSelectorProps
  extends Omit<SelectProps, 'children' | 'onSelectionChange'> {
  items: SelectorItem[];
  onSelectionChange: (value: string) => void;
  itemClassNames?: SelectItemClassNames;
}

export const Selector = ({
  items,
  onSelectionChange,
  ...props
}: CustomSelectorProps) => {
  return (
    <Select
      classNames={{
        popoverContent: 'bg-light rounded',
        innerWrapper: 'font-base',
        base: 'border border-border rounded hover:transition-all hover:border-border-hover hover:duration-300 hover:ease-in',
        value: 'text-primary font-semibold',
      }}
      {...props}
      onSelectionChange={(keys) => {
        const value = Array.from(keys)[0] as string;
        if (onSelectionChange) {
          onSelectionChange(value);
        }
      }}
    >
      {items.map((item) => (
        <SelectItem
          key={item.value}
          className="rounded-none"
          classNames={{
            base: 'data-hover:true:bg-primary', //TODO : Figure out how to make hover effect work
            title: 'text-primary font-base',
          }}
        >
          {item.label}
        </SelectItem>
      ))}
    </Select>
  );
};
