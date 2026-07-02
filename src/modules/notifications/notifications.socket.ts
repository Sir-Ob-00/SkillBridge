import { Socket } from 'socket.io-client';
import { mapSocketEventToNotification, getSupportedEvents } from './notifications.mapper';
import { useNotificationsStore } from './notifications.store';
import { logger } from '@utils/logger';

export function setupNotificationSocketListeners(socket: Socket): () => void {
  const events = getSupportedEvents();

  const handlers = events.map((eventName) => {
    const handler = (data: Record<string, unknown>) => {
      const notification = mapSocketEventToNotification(eventName, data);
      if (!notification) return;

      logger.info(`[NotificationSocket] Event received: ${eventName}`, notification.id);
      useNotificationsStore.getState().addNotification(notification);
    };

    socket.on(eventName, handler);
    return { eventName, handler };
  });

  return () => {
    handlers.forEach(({ eventName, handler }) => {
      socket.off(eventName, handler);
    });
  };
}
