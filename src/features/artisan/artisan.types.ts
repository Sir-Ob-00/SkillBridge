export type ArtisanTabParamList = {
  Dashboard: undefined;
  Requests: undefined;
  Chat: undefined;
  Earnings: undefined;
  Profile: undefined;
};

export type ArtisanStackParamList = {
  ArtisanTabs: undefined;
  ProfileSetup: undefined;
  Availability: undefined;
  BookingDetails: { bookingId: string };
  ChatRoom: { chatId: string; otherUserName: string };
  Settings: undefined;
  Notifications: undefined;
};
