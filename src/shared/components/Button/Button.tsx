import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
} from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary shadow-sm shadow-primary/30 active:bg-primary/90',
  secondary: 'bg-secondary shadow-sm shadow-secondary/30 active:bg-secondary/90',
  outline: 'bg-transparent border-2 border-primary active:bg-primary/5',
  ghost: 'bg-transparent active:bg-gray-100',
  danger: 'bg-red-600 shadow-sm shadow-red-600/30 active:bg-red-700',
};

const variantTextStyles: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-gray-900',
  outline: 'text-primary',
  ghost: 'text-primary',
  danger: 'text-white',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 rounded-xl',
  md: 'px-6 py-3.5 rounded-2xl',
  lg: 'px-8 py-4 rounded-[20px]',
};

const sizeTextStyles: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  ...rest
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      disabled={isDisabled}
      className={[
        'flex-row items-center justify-center active:scale-[0.98] active:opacity-90',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50' : '',
        className ?? '',
      ].join(' ')}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'secondary' ? '#1f2937' : '#ffffff'}
        />
      ) : (
        <>
          {leftIcon}
          <Text
            className={[
              'font-semibold text-center',
              variantTextStyles[variant],
              sizeTextStyles[size],
              leftIcon ? 'ml-2' : '',
              rightIcon ? 'mr-2' : '',
            ].join(' ')}
          >
            {label}
          </Text>
          {rightIcon}
        </>
      )}
    </Pressable>
  );
};
