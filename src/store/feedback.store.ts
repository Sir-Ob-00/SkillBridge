import { create } from 'zustand';

export type FeedbackType = 'success' | 'error' | 'warning' | 'info';

interface FeedbackState {
  visible: boolean;
  type: FeedbackType;
  title: string;
  message: string;
  onDismiss?: () => void;
  show: (params: {
    type: FeedbackType;
    title: string;
    message: string;
    onDismiss?: () => void;
  }) => void;
  hide: () => void;
}

export const useFeedbackStore = create<FeedbackState>((set) => ({
  visible: false,
  type: 'info',
  title: '',
  message: '',
  onDismiss: undefined,
  show: (params) =>
    set({
      visible: true,
      type: params.type,
      title: params.title,
      message: params.message,
      onDismiss: params.onDismiss,
    }),
  hide: () => set({ visible: false, onDismiss: undefined }),
}));
