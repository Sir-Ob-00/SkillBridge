import React from 'react';
import { Image, Text, View } from 'react-native';
import { getInitials } from '@utils/helpers';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: AvatarSize;
  /** Small dot indicating online/verified status */
  showBadge?: boolean;
  badgeColor?: string;
}

const sizeMap: Record<AvatarSize, { box: string; text: string; badge: string }> = {
  xs: { box: 'w-6 h-6', text: 'text-[10px]', badge: 'w-2 h-2' },
  sm: { box: 'w-8 h-8', text: 'text-xs', badge: 'w-2.5 h-2.5' },
  md: { box: 'w-12 h-12', text: 'text-base', badge: 'w-3 h-3' },
  lg: { box: 'w-16 h-16', text: 'text-xl', badge: 'w-3.5 h-3.5' },
  xl: { box: 'w-24 h-24', text: 'text-3xl', badge: 'w-4 h-4' },
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  imageUrl,
  size = 'md',
  showBadge = false,
  badgeColor = '#08540a',
}) => {
  const { box, text, badge } = sizeMap[size];

  return (
    <View className="relative">
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          className={[box, 'rounded-full bg-gray-200'].join(' ')}
          accessibilityLabel={name}
        />
      ) : (
        <View
          className={[
            box,
            'items-center justify-center rounded-full bg-primary/10',
          ].join(' ')}
        >
          <Text className={[text, 'font-semibold text-primary'].join(' ')}>
            {getInitials(name)}
          </Text>
        </View>
      )}

      {showBadge ? (
        <View
          className={[
            badge,
            'absolute bottom-0 right-0 rounded-full border-2 border-white',
          ].join(' ')}
          style={{ backgroundColor: badgeColor }}
        />
      ) : null}
    </View>
  );
};
