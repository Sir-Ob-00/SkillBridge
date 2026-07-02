import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Rocket } from 'lucide-react-native';
import { colors } from '@shared/ui/colors';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  useEffect(() => {
    logoScale.value = withTiming(1, { duration: 800, easing: Easing.elastic(1.2) });
    logoOpacity.value = withTiming(1, { duration: 600 });
    textOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));

    const timer = setTimeout(() => {
      runOnJS(onFinish)();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Animated.View
        className="mb-6 h-28 w-28 items-center justify-center rounded-[44px] bg-primary/10"
        style={logoStyle}
      >
        <Rocket size={64} color={colors.primary} />
      </Animated.View>

      <Animated.View style={textStyle}>
        <Text className="font-heading text-4xl font-bold text-gray-900">
          SkillBridge
        </Text>
        <Text className="mt-2 text-center text-base text-gray-500">
          Bridging talent, on Campus
        </Text>
      </Animated.View>
    </View>
  );
};
