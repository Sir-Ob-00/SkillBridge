import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, Inbox, MessageCircle, Wallet, User } from 'lucide-react-native';
import { ArtisanTabParamList, ArtisanStackParamList } from '@features/artisan/artisan.types';
import { DashboardScreen } from '@features/artisan/screens/DashboardScreen';
import { RequestsScreen } from '@features/artisan/screens/RequestsScreen';
import { EarningsScreen } from '@features/artisan/screens/EarningsScreen';
import { ArtisanProfileScreen } from '@features/artisan/screens/ArtisanProfileScreen';
import { ProfileSetupScreen } from '@features/artisan/screens/ProfileSetupScreen';
import { AvailabilityScreen } from '@features/artisan/screens/AvailabilityScreen';
import { ArtisanSettingsScreen } from '@features/artisan/screens/ArtisanSettingsScreen';
import { ArtisanChatListScreen } from '@features/artisan/screens/ArtisanChatListScreen';
import { BookingDetailsScreen } from '@features/booking/screens/BookingDetailsScreen';
import { ChatRoomScreen } from '@features/chat/screens/ChatRoomScreen';
import { NotificationsScreen } from '@shared/screens/NotificationsScreen';
import { colors } from '@shared/ui/colors';

const Tab = createBottomTabNavigator<ArtisanTabParamList>();
const Stack = createNativeStackNavigator<ArtisanStackParamList>();

const ArtisanTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray400,
        tabBarStyle: { borderTopColor: colors.gray200 },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Requests"
        component={RequestsScreen}
        options={{ tabBarIcon: ({ color, size }) => <Inbox color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Chat"
        component={ArtisanChatListScreen}
        options={{ tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Earnings"
        component={EarningsScreen}
        options={{ tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ArtisanProfileScreen}
        options={{ tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
};

export const ArtisanNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="ArtisanTabs" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ArtisanTabs" component={ArtisanTabs} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="Availability" component={AvailabilityScreen} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
      <Stack.Screen name="Settings" component={ArtisanSettingsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};
