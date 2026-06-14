import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Wallet, TrendingUp, Clock } from 'lucide-react-native';
import { ArtisanTabParamList, ArtisanStackParamList } from '../artisan.types';
import { ScreenWrapper } from '@shared/layout';
import { Loader } from '@shared/components/Loader';
import { artisanApi } from '@services/api/artisan.api';
import { formatCurrency } from '@utils/currency';
import { colors } from '@shared/ui/colors';

type Props = CompositeScreenProps<
  BottomTabScreenProps<ArtisanTabParamList, 'Earnings'>,
  NativeStackScreenProps<ArtisanStackParamList>
>;

interface Earnings {
  total: number;
  thisMonth: number;
  pending: number;
}

export const EarningsScreen: React.FC<Props> = () => {
  const [earnings, setEarnings] = useState<Earnings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    artisanApi
      .getEarnings()
      .then(setEarnings)
      .catch(() => setEarnings({ total: 0, thisMonth: 0, pending: 0 }))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <Loader fullScreen label="Loading earnings..." />;
  }

  const cards = [
    {
      label: 'Total earnings',
      value: earnings?.total ?? 0,
      icon: Wallet,
      bg: 'bg-primary/10',
      color: colors.primary,
    },
    {
      label: 'This month',
      value: earnings?.thisMonth ?? 0,
      icon: TrendingUp,
      bg: 'bg-success/10',
      color: colors.success,
    },
    {
      label: 'Pending payout',
      value: earnings?.pending ?? 0,
      icon: Clock,
      bg: 'bg-secondary/20',
      color: colors.secondary,
    },
  ];

  return (
    <ScreenWrapper scrollable contentClassName="pt-2">
      <Text className="mb-4 font-heading text-2xl font-bold text-gray-900">
        Earnings
      </Text>

      <View className="gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <View
              key={card.label}
              className="flex-row items-center rounded-2xl bg-white p-4"
            >
              <View className={['mr-4 h-12 w-12 items-center justify-center rounded-2xl', card.bg].join(' ')}>
                <Icon size={22} color={card.color} />
              </View>
              <View>
                <Text className="text-sm text-gray-500">{card.label}</Text>
                <Text className="text-xl font-bold text-gray-900">
                  {formatCurrency(card.value)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScreenWrapper>
  );
};
