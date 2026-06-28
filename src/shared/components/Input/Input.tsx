import React, { useState } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '@shared/ui/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  isPassword?: boolean;
  leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  isPassword = false,
  leftIcon,
  className,
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  ...rest
}) => {
  const [isSecure, setIsSecure] = useState(isPassword);

  return (
    <View className="mb-4 w-full">
      {label ? (
        <Text className="mb-1.5 text-sm font-medium text-gray-700">
          {label}
        </Text>
      ) : null}

      <View className="flex-row items-center rounded-2xl border border-transparent bg-gray-50 px-4 h-14">
        {leftIcon ? <View className="mr-2">{leftIcon}</View> : null}

        <TextInput
          className={['flex-1 py-3 text-base text-gray-900', className ?? ''].join(' ')}
          placeholderTextColor={colors.gray400}
          secureTextEntry={isSecure}
          onFocus={onFocusProp}
          onBlur={onBlurProp}
          {...rest}
        />

        {isPassword ? (
          <Text onPress={() => setIsSecure((prev) => !prev)} className="ml-2">
            {isSecure ? (
              <Eye size={20} color={colors.gray400} />
            ) : (
              <EyeOff size={20} color={colors.gray400} />
            )}
          </Text>
        ) : null}
      </View>

      {error ? (
        <Text className="mt-1 text-xs text-red-500">{error}</Text>
      ) : helperText ? (
        <Text className="mt-1 text-xs text-gray-500">{helperText}</Text>
      ) : null}
    </View>
  );
};
