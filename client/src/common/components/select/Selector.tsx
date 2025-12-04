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
        base: 'border-medium border-border rounded-xl hover:transition-all hover:border-border-hover hover:duration-300 hover:ease-in font-semibold',
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
          classNames={{
            title:
              'text-primary hover:text-secondary-text hover:transition-all hover:duration-300 hover:ease-in',
          }}
        >
          {item.label}
        </SelectItem>
      ))}
    </Select>
  );
};
