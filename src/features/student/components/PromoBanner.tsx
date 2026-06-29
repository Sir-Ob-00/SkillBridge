import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '@shared/components/Button';

interface PromoBannerProps {
  onExplore: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onExplore }) => {
  return (
    <View className="mb-6 overflow-hidden rounded-2xl bg-primary px-6 py-5">
      <Text className="mb-1 font-heading text-xl font-bold text-white">
        Find Trusted{'\n'}Skilled Artisans
      </Text>
      <Text className="mb-4 text-sm leading-5 text-white/80">
        Browse verified professionals for your next project.
      </Text>
      <Button
        label="Explore"
        onPress={onExplore}
        variant="secondary"
        size="sm"
        className="self-start"
      />
    </View>
  );
};
