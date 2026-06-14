import React, { useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Send } from 'lucide-react-native';
import { colors } from '@shared/ui/colors';

interface ChatInputProps {
  onSend: (text: string) => void;
  onTypingChange?: (isTyping: boolean) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, onTypingChange }) => {
  const [text, setText] = useState('');
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChangeText = (value: string) => {
    setText(value);

    if (onTypingChange) {
      onTypingChange(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => onTypingChange(false), 1500);
    }
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
    onTypingChange?.(false);
  };

  return (
    <View className="flex-row items-end gap-2 border-t border-gray-200 bg-white px-3 py-2">
      <TextInput
        value={text}
        onChangeText={handleChangeText}
        placeholder="Type a message"
        placeholderTextColor={colors.gray400}
        multiline
        className="max-h-28 flex-1 rounded-2xl bg-gray-100 px-4 py-2.5 text-base text-gray-900"
      />
      <Pressable
        onPress={handleSend}
        disabled={!text.trim()}
        className={[
          'h-11 w-11 items-center justify-center rounded-full',
          text.trim() ? 'bg-primary' : 'bg-gray-200',
        ].join(' ')}
      >
        <Send size={18} color={text.trim() ? '#ffffff' : colors.gray400} />
      </Pressable>
    </View>
  );
};
