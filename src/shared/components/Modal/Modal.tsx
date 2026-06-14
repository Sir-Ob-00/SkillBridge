import React from 'react';
import {
  Modal as RNModal,
  Pressable,
  Text,
  View,
  ModalProps as RNModalProps,
} from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '@shared/ui/colors';

interface ModalProps extends Omit<RNModalProps, 'visible'> {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** 'center' for dialogs, 'bottom' for action sheets / bottom sheets */
  placement?: 'center' | 'bottom';
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  placement = 'center',
  ...rest
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType={placement === 'bottom' ? 'slide' : 'fade'}
      onRequestClose={onClose}
      {...rest}
    >
      <Pressable
        onPress={onClose}
        className="flex-1 bg-black/40"
        accessibilityLabel="Close modal"
      >
        <View
          className={[
            'flex-1',
            placement === 'bottom' ? 'justify-end' : 'justify-center items-center',
          ].join(' ')}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className={[
              'bg-white p-5',
              placement === 'bottom'
                ? 'w-full rounded-t-2xl'
                : 'w-11/12 rounded-2xl',
            ].join(' ')}
          >
            {title || placement === 'bottom' ? (
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-gray-900">
                  {title}
                </Text>
                <Pressable onPress={onClose} accessibilityLabel="Close">
                  <X size={22} color={colors.gray600} />
                </Pressable>
              </View>
            ) : null}

            {children}
          </Pressable>
        </View>
      </Pressable>
    </RNModal>
  );
};
