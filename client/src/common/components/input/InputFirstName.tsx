import { ProfileIcon } from '@client/common/icons/ProfileIcon';
import { cn } from '@heroui/react';
import { isNameValid } from '@shared/validators/isNameValid';
import { useImperativeHandle, useState } from 'react';
import { Input } from './Input';

export type InputNameRefType = {
  getValue: () => string;
  setValue: (value: string) => void;
  isValid: () => boolean;
  getErrorMessage: () => string;
};

export type InputNameProps = {
  name?: string;
  size?: 'sm' | 'md';
  placeholder?: string;
  label?: string;
  value?: string;
  required?: boolean;
  isRequired?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  ref?: React.RefObject<InputNameRefType | null>;
};

export const InputName = ({
  name,
  size,
  placeholder = 'Enter your first name',
  label = 'First Name',
  value,
  required,
  isRequired,
  className,
  onChange,
  ref,
}: InputNameProps) => {
  const [initialValue, setValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);

  const icon = (
    <ProfileIcon
      className={cn(
        'size-4.5',
        isFocused || initialValue.length > 0
          ? 'text-primary'
          : 'text-border-hover',
      )}
    />
  );

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return initialValue;
      },
      setValue(value: string) {
        setValue(value);
      },
      isValid() {
        return isNameValid(initialValue);
      },
      getErrorMessage() {
        if (!initialValue.trim()) {
          return 'errors.firstName.required';
        }

        return isNameValid(initialValue)
          ? ''
          : 'errors.firstName.notValidFormat';
      },
    };
  }, [initialValue]);

  return (
    <Input
      size={size}
      name={name}
      startContent={icon}
      type="text"
      placeholder={placeholder}
      label={label}
      className={className}
      value={initialValue}
      isRequired={isRequired || required}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onChange={(value) => {
        setValue(value);
        onChange?.(value);
      }}
    />
  );
};
