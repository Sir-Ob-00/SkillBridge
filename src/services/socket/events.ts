export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',

  SEND_MESSAGE: 'send_message',
  RECEIVE_MESSAGE: 'receive_message',
  TYPING_INDICATOR: 'typing_indicator',

  JOIN_CHAT: 'join_chat',
  LEAVE_CHAT: 'leave_chat',

  MESSAGE_READ: 'message_read',

  BOOKING_CREATED: 'booking_created',
  BOOKING_ACCEPTED: 'booking_accepted',
  BOOKING_COMPLETED: 'booking_completed',
  BOOKING_CANCELLED: 'booking_cancelled',

  ARTISAN_VERIFIED: 'ARTISAN_VERIFIED',
} as const;

export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];
