export type ArtisanTabParamList = {
  Dashboard: undefined;
  Requests: undefined;
  Services: undefined;
  Earnings: undefined;
  Profile: undefined;
};

export type ArtisanStackParamList = {
  ArtisanTabs: undefined;
  ProfileSetup: undefined;
  Availability: undefined;
  BookingDetails: { bookingId: string };
  ChatList: undefined;
  ChatRoom: { chatId: string; otherUserName: string };
  Settings: undefined;
  Notifications: undefined;
};
