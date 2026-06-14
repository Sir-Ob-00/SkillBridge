import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Search, Heart, Calendar, User } from 'lucide-react-native';
import {
  StudentTabParamList,
  StudentStackParamList,
} from '@features/student/student.types';
import { HomeScreen } from '@features/student/screens/HomeScreen';
import { SearchScreen } from '@features/student/screens/SearchScreen';
import { FavoritesScreen } from '@features/student/screens/FavoritesScreen';
import { ProfileScreen } from '@features/student/screens/ProfileScreen';
import { BookingHistoryScreen } from '@features/booking/screens/BookingHistoryScreen';
import { ArtisanProfileScreen } from '@features/student/screens/ArtisanProfileScreen';
import { BookingScreen } from '@features/student/screens/BookingScreen';
import { BookingDetailsScreen } from '@features/booking/screens/BookingDetailsScreen';
import { BookingStatusScreen } from '@features/booking/screens/BookingStatusScreen';
import { ReviewsScreen } from '@features/student/screens/ReviewsScreen';
import { WriteReviewScreen } from '@features/reviews/screens/WriteReviewScreen';
import { ChatListScreen } from '@features/chat/screens/ChatListScreen';
import { ChatRoomScreen } from '@features/chat/screens/ChatRoomScreen';
import { SettingsScreen } from '@shared/screens/SettingsScreen';
import { NotificationsScreen } from '@shared/screens/NotificationsScreen';
import { colors } from '@shared/ui/colors';

const Tab = createBottomTabNavigator<StudentTabParamList>();
const Stack = createNativeStackNavigator<StudentStackParamList>();

const StudentTabs: React.FC = () => {
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
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarIcon: ({ color, size }) => <Search color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingHistoryScreen}
        options={{ tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ tabBarIcon: ({ color, size }) => <Heart color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
};

export const StudentNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="StudentTabs" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentTabs" component={StudentTabs} />
      <Stack.Screen name="ArtisanProfile" component={ArtisanProfileScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
      <Stack.Screen name="BookingStatus" component={BookingStatusScreen} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} />
      <Stack.Screen name="WriteReview" component={WriteReviewScreen} />
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};
