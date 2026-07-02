export type NotificationType = 'booking' | 'system' | 'chat';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  entityId?: string;
  createdAt: string;
  read: boolean;
}

export interface SocketNotificationEvent {
  type: string;
  data: Record<string, unknown>;
}
