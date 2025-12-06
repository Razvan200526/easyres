import { type ButtonProps, cn, Button as HeroButton } from '@heroui/react';

export type ButtonPropsType = ButtonProps;

export const Button = (props: ButtonPropsType) => {
  const {
    className,
    children,
    size = 'sm',
    variant = 'primary',
    isIconOnly = false,
    ...rest
  } = props;

  return (
    <HeroButton
      size={size}
      {...rest}
      variant={variant}
      isIconOnly={isIconOnly}
      className={cn(
        'font-medium tracking-wide min-w-3 min-h-0 py-0 flex items-center justify-center',
        'data-[focus=true]:outline-2 data-[focus=true]:outline-offset-2',
        size === 'sm' ? 'text-xs h-7.5' : 'text-sm',
        variant === 'bordered' ? 'border-small' : '',
        color === 'primary' && variant === 'light'
          ? 'data-[hover=true]:bg-primary-200/40'
          : '',
        color === 'primary' && variant === 'flat' ? 'text-primary' : '',
        radius === 'full' ? 'rounded-full' : 'rounded',
        isIconOnly ? 'p-0' : 'px-3',

        className,
      )}
    >
      {children}
    </HeroButton>
  );
};
