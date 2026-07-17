import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { CompositeScreenProps, useIsFocused } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Wallet, ClipboardCheck } from 'lucide-react-native';
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

interface Revenue {
  artisanId: string;
  totalEarned: number;
  completedBookings: number;
}

export const EarningsScreen: React.FC<Props> = () => {
  const [revenue, setRevenue] = useState<Revenue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const fetchRevenue = useCallback(async () => {
    try {
      const data = await artisanApi.getMyRevenue();
      setRevenue(data);
    } catch {
      setRevenue({ artisanId: '', totalEarned: 0, completedBookings: 0 });
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      setIsLoading(true);
      fetchRevenue().finally(() => setIsLoading(false));
    }
  }, [isFocused, fetchRevenue]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchRevenue();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return <Loader fullScreen label="Loading earnings..." />;
  }

  const cards = [
    {
      label: 'Total earned',
      value: revenue?.totalEarned ?? 0,
      icon: Wallet,
      bg: 'bg-primary/10',
      color: colors.primary,
      format: (v: number) => formatCurrency(v),
    },
    {
      label: 'Completed bookings',
      value: revenue?.completedBookings ?? 0,
      icon: ClipboardCheck,
      bg: 'bg-success/10',
      color: colors.success,
      format: (v: number) => String(v),
    },
  ];

  return (
    <ScreenWrapper scrollable contentClassName="pt-2" onRefresh={handleRefresh} refreshing={isRefreshing}>
      <Text className="mb-4 font-heading text-2xl font-bold text-gray-900">
        Revenue
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
                  {card.format(card.value)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScreenWrapper>
  );
};
