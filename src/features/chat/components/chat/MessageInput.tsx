import React, { useState, useCallback } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Send } from 'lucide-react-native';
import { colors } from '@shared/ui/colors';

interface MessageInputProps {
  onSend: (text: string) => void;
  onTyping?: (isTyping: boolean) => void;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onTyping,
  placeholder = 'Type a message...',
}) => {
  const [text, setText] = useState('');

  const handleChangeText = useCallback(
    (value: string) => {
      setText(value);
      onTyping?.(value.length > 0);
    },
    [onTyping],
  );

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
    onTyping?.(false);
  }, [text, onSend, onTyping]);

  return (
    <View className="flex-row items-center rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm shadow-gray-100">
      <TextInput
        value={text}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.gray400}
        multiline
        maxLength={1000}
        className="max-h-24 flex-1 text-base text-gray-900"
        style={{ paddingVertical: 0 }}
      />
      <Pressable
        onPress={handleSend}
        disabled={!text.trim()}
        className={`ml-2 h-10 w-10 items-center justify-center rounded-full ${
          text.trim() ? 'bg-primary' : 'bg-gray-200'
        }`}
      >
        <Send
          size={18}
          color={text.trim() ? '#ffffff' : colors.gray400}
          fill={text.trim() ? '#ffffff' : 'none'}
        />
      </Pressable>
    </View>
  );
};

export default React.memo(MessageInput);
