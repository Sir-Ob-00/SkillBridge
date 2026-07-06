import React from 'react';
import { Text, View } from 'react-native';

interface TypingIndicatorProps {
  name: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ name }) => (
  <View className="px-3 pb-1">
    <Text className="text-xs italic text-gray-400">{name} is typing...</Text>
  </View>
);

export default React.memo(TypingIndicator);
