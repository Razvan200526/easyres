import { cn, Input as HeroInput, type InputProps } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Button } from '@shared/components/button';
import { forwardRef } from 'react';

export type InputChatProps = Omit<
  InputProps,
  'variant' | 'radius' | 'size' | 'onChange'
> & {
  size?: 'sm' | 'md';
  inputClassName?: string;
  inputWrapperClassName?: string;
  onChange?: (value: string) => void;
  onEnter: (value: string) => void;
  onStop: () => void;
  isPending?: boolean;
  theme?: 'resume' | 'coverletter' | 'portfolio';
  showStopButton?: boolean;
};

export const InputChat = forwardRef<HTMLInputElement, InputChatProps>(
  (props, ref) => {
    const {
      size = 'sm',
      className,
      inputClassName,
      inputWrapperClassName,
      onChange,
      onEnter,
      isPending,
      onStop,
      theme = 'coverletter',
      value,
      showStopButton = false,
      ...rest
    } = props;

    const themeColors = {
      resume: {
        text: 'text-resume',
        placeholder: 'placeholder-resume/50',
        border: 'border-resume/20',
        borderHover: 'data-[hover=true]:border-resume',
        borderFocus: 'data-[focus=true]:border-resume',
        button: 'text-resume',
      },
      coverletter: {
        text: 'text-coverletter',
        placeholder: 'placeholder-coverletter/50',
        border: 'border-coverletter/20',
        borderHover: 'data-[hover=true]:border-coverletter',
        borderFocus: 'data-[focus=true]:border-coverletter',
        button: 'text-coverletter',
      },
      portfolio: {
        text: 'text-portfolio',
        placeholder: 'placeholder-portfolio/50',
        border: 'border-portfolio/20',
        borderHover: 'data-[hover=true]:border-portfolio',
        borderFocus: 'data-[focus=true]:border-portfolio',
        button: 'text-portfolio',
      },
    };

    const colors = themeColors[theme];

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!showStopButton) {
          onEnter?.(value || '');
        }
      }
    };

    return (
      <HeroInput
        ref={ref}
        type="text"
        {...rest}
        size={size}
        radius="lg"
        variant="bordered"
        autoComplete="off"
        value={value}
        onKeyDown={handleKeyDown}
        startContent={
          <Icon
            icon="heroicons:chat-bubble-oval-left"
            className={cn('size-4', `${colors.text}`)}
          />
        }
        endContent={
          showStopButton ? (
            <Button
              type="button"
              isIconOnly
              size="sm"
              variant="light"
              className={cn(
                colors.button,
                'bg-danger/10 text-danger hover:bg-danger/20',
              )}
              onPress={onStop}
            >
              <Icon icon="heroicons:stop" className="size-4" />
            </Button>
          ) : (
            <Button
              type="button"
              isIconOnly={true}
              radius="full"
              size="sm"
              variant="light"
              isDisabled={!value?.toString().trim()}
              className={colors.button}
              onPress={() => (isPending ? onStop() : onEnter(value || ''))}
            >
              <Icon icon="heroicons:paper-airplane" className="size-4" />
            </Button>
          )
        }
        classNames={{
          base: cn('w-full border-none shadow-none', className),
          input: [
            'bg-light font-medium shadow-none placeholder:font-normal',
            'selection:bg-primary selection:text-primary-50 border-none',
            size === 'sm' ? 'text-sm' : 'text-base',
            size === 'sm' ? 'placeholder:text-xs' : 'placeholder:text-sm',
            colors.text,
            colors.placeholder,
            'font-semibold',
            inputClassName,
          ],
          inputWrapper: cn(
            'relative rounded-xl border bg-light shadow-none',
            'flex items-center gap-2 px-3 py-2',
            colors.border,
            colors.borderHover,
            colors.borderFocus,
            inputWrapperClassName,
          ),
        }}
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
      />
    );
  },
);

InputChat.displayName = 'InputChat';
