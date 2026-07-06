import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ArrowLeft, MoreVertical } from 'lucide-react-native';
import { Avatar } from '@shared/components';
import { colors } from '@shared/ui/colors';

interface ChatHeaderProps {
  name: string;
  avatarUrl?: string;
  isOnline?: boolean;
  onBack: () => void;
  onMenu: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  name,
  avatarUrl,
  isOnline,
  onBack,
  onMenu,
}) => (
  <View className="flex-row items-center justify-between border-b border-gray-100 pb-3">
    <View className="flex-row items-center flex-1">
      <Pressable onPress={onBack} className="mr-2 p-1">
        <ArrowLeft size={24} color={colors.gray800} />
      </Pressable>
      <View className="relative">
        <Avatar name={name} size="sm" imageUrl={avatarUrl} />
        {isOnline ? (
          <View className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
        ) : null}
      </View>
      <View className="ml-2.5 flex-1">
        <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
          {name}
        </Text>
        {isOnline ? (
          <Text className="text-[11px] text-green-600">Online</Text>
        ) : null}
      </View>
    </View>
    <Pressable onPress={onMenu} className="p-1" accessibilityLabel="Menu">
      <MoreVertical size={22} color={colors.gray600} />
    </Pressable>
  </View>
);

export default React.memo(ChatHeader);
