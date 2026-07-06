export type StudentTabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  Bookings: undefined;
  Profile: undefined;
};

export type StudentStackParamList = {
  StudentTabs: undefined;
  ArtisanProfile: { artisanId: string };
  Booking: { artisanId: string; serviceId?: string };
  BookingDetails: { bookingId: string };
  BookingStatus: { bookingId: string };
  Reviews: { artisanId: string };
  ChatRoom: { chatId: string; otherUserName: string; targetUserId?: string };
  ChatList: undefined;
  WriteReview: { bookingId: string; artisanId: string };
  Settings: undefined;
  Notifications: undefined;
};
