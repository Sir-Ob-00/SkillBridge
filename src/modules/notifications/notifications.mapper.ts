import { AppNotification, NotificationType } from './notifications.types';

interface RawEventData {
  booking?: { id: string };
  artisan?: { id: string; businessName?: string };
  user?: { id: string; name?: string };
  report?: { id: string; reason?: string };
  review?: { id: string };
  message?: { chatId: string; text?: string };
  [key: string]: unknown;
}

const EVENT_MAP: Record<
  string,
  { type: NotificationType; build: (data: RawEventData) => { title: string; message: string; entityId?: string } }
> = {
  booking_created: {
    type: 'booking',
    build: (data) => ({
      title: 'New Booking Request',
      message: `Booking request received${data.booking ? ` #${(data.booking.id as string).slice(-6).toUpperCase()}` : ''}.`,
      entityId: data.booking?.id as string | undefined,
    }),
  },
  booking_accepted: {
    type: 'booking',
    build: (data) => ({
      title: 'Booking Accepted',
      message: `Your booking${data.booking ? ` #${(data.booking.id as string).slice(-6).toUpperCase()}` : ''} has been accepted.`,
      entityId: data.booking?.id as string | undefined,
    }),
  },
  booking_completed: {
    type: 'booking',
    build: (data) => ({
      title: 'Job Completed',
      message: `Booking${data.booking ? ` #${(data.booking.id as string).slice(-6).toUpperCase()}` : ''} has been marked as completed.`,
      entityId: data.booking?.id as string | undefined,
    }),
  },
  booking_cancelled: {
    type: 'booking',
    build: (data) => ({
      title: 'Booking Cancelled',
      message: `Booking${data.booking ? ` #${(data.booking.id as string).slice(-6).toUpperCase()}` : ''} has been cancelled.`,
      entityId: data.booking?.id as string | undefined,
    }),
  },
  artisan_verified: {
    type: 'system',
    build: (data) => ({
      title: 'Artisan Verified',
      message: `${data.artisan?.businessName ?? 'An artisan'} has been verified on SkillBridge.`,
      entityId: data.artisan?.id as string | undefined,
    }),
  },
  report_submitted: {
    type: 'system',
    build: (data) => ({
      title: 'Report Submitted',
      message: `Report${data.report ? ` #${(data.report.id as string).slice(-6).toUpperCase()}` : ''} has been submitted for review.`,
      entityId: data.report?.id as string | undefined,
    }),
  },
  review_flagged: {
    type: 'system',
    build: (data) => ({
      title: 'Review Flagged',
      message: `A review${data.review ? ` #${(data.review.id as string).slice(-6).toUpperCase()}` : ''} has been flagged for moderation.`,
      entityId: data.review?.id as string | undefined,
    }),
  },
  receive_message: {
    type: 'chat',
    build: (data) => ({
      title: 'New Message',
      message: (data.message?.text as string) ?? (data.text as string) ?? 'You have a new message.',
      entityId: (data.message?.chatId as string) ?? (data.chatId as string) ?? undefined,
    }),
  },
};

export function mapSocketEventToNotification(
  eventName: string,
  eventData: RawEventData
): AppNotification | null {
  const mapping = EVENT_MAP[eventName];
  if (!mapping) return null;

  const { title, message, entityId } = mapping.build(eventData);

  return {
    id: `${eventName}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: mapping.type,
    title,
    message,
    entityId,
    createdAt: new Date().toISOString(),
    read: false,
  };
}

export function getSupportedEvents(): string[] {
  return Object.keys(EVENT_MAP);
}
