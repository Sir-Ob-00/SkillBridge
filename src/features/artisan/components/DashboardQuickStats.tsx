import React from 'react';
import { Text, View } from 'react-native';
import { Wallet, Star, Inbox, ClipboardCheck } from 'lucide-react-native';
import { Booking } from '@app-types/index';
import { formatCurrency } from '@utils/currency';
import { colors } from '@shared/ui/colors';

interface DashboardQuickStatsProps {
  bookings: Booking[];
  earningsThisMonth: number;
  averageRating: number;
  reviewCount: number;
}

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
}> = ({ icon, label, value, bg }) => (
  <View className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm shadow-gray-200">
    <View className={['mb-2 h-9 w-9 items-center justify-center rounded-xl', bg].join(' ')}>
      {icon}
    </View>
    <Text className="text-xs text-gray-500">{label}</Text>
    <Text className="mt-0.5 text-base font-bold text-gray-900">{value}</Text>
  </View>
);

export const DashboardQuickStats: React.FC<DashboardQuickStatsProps> = ({
  bookings,
  earningsThisMonth,
  averageRating,
  reviewCount,
}) => {
  return (
    <View className="mb-6">
      <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
        Overview
      </Text>
      <View className="flex-row flex-wrap gap-3">
        <View className="w-[calc(50%-6px)]">
          <StatCard
            icon={<Wallet size={18} color={colors.success} />}
            label="Earnings"
            value={formatCurrency(earningsThisMonth)}
            bg="bg-success/10"
          />
        </View>
        <View className="w-[calc(50%-6px)]">
          <StatCard
            icon={<Star size={18} color={colors.secondary} />}
            label={`Rating (${reviewCount})`}
            value={reviewCount > 0 ? `${averageRating.toFixed(1)} ★` : '—'}
            bg="bg-secondary/20"
          />
        </View>
        <View className="w-[calc(50%-6px)]">
          <StatCard
            icon={<Inbox size={18} color={colors.primary} />}
            label="Pending"
            value={String(bookings.filter((b) => b.status === 'pending').length)}
            bg="bg-primary/10"
          />
        </View>
        <View className="w-[calc(50%-6px)]">
          <StatCard
            icon={<ClipboardCheck size={18} color="#0891b2" />}
            label="Completed"
            value={String(bookings.filter((b) => b.status === 'completed').length)}
            bg="bg-cyan-50"
          />
        </View>
      </View>
    </View>
  );
};
