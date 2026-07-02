import { create } from 'zustand';
import { reviewsApi } from '@services/api/reviews.api';
import { ReviewWithMeta, ReviewsCache, CreateReviewRequest } from './reviews.types';

interface ReviewsState {
  cache: ReviewsCache;
  isLoading: Record<string, boolean>;
  reviewedBookings: Set<string>;

  fetchReviews: (artisanId: string, page?: number) => Promise<void>;
  loadMore: (artisanId: string) => Promise<void>;
  createReview: (artisanId: string, payload: CreateReviewRequest) => Promise<void>;
  getReviews: (artisanId: string) => ReviewWithMeta[];
  getAverageRating: (artisanId: string) => number;
  getTotalReviews: (artisanId: string) => number;
  isReviewed: (bookingId: string) => boolean;
  markReviewed: (bookingId: string) => void;
}

export const useReviewsStore = create<ReviewsState>((set, get) => ({
  cache: {},
  isLoading: {},
  reviewedBookings: new Set<string>(),

  fetchReviews: async (artisanId, page = 1) => {
    set((state) => ({
      isLoading: { ...state.isLoading, [artisanId]: true },
    }));

    try {
      const result = await reviewsApi.getArtisanReviews(artisanId, { page });
      set((state) => {
        const existing = state.cache[artisanId];
        const items = page === 1 ? result.items : [...(existing?.reviews ?? []), ...result.items];
        return {
          cache: {
            ...state.cache,
            [artisanId]: {
              reviews: items,
              page: result.page,
              totalPages: result.totalPages,
              totalItems: result.totalItems,
            },
          },
          isLoading: { ...state.isLoading, [artisanId]: false },
        };
      });
    } catch {
      set((state) => ({
        isLoading: { ...state.isLoading, [artisanId]: false },
      }));
    }
  },

  loadMore: async (artisanId) => {
    const cached = get().cache[artisanId];
    if (!cached || cached.page >= cached.totalPages) return;
    await get().fetchReviews(artisanId, cached.page + 1);
  },

  createReview: async (artisanId, payload) => {
    const review = await reviewsApi.create(payload);
    set((state) => {
      const cached = state.cache[artisanId];
      const updatedReviews = cached ? [review, ...cached.reviews] : [review];
      return {
        cache: {
          ...state.cache,
          [artisanId]: {
            reviews: updatedReviews,
            page: 1,
            totalPages: cached?.totalPages ?? 1,
            totalItems: (cached?.totalItems ?? 0) + 1,
          },
        },
        reviewedBookings: new Set(state.reviewedBookings).add(payload.bookingId),
      };
    });
  },

  getReviews: (artisanId) => get().cache[artisanId]?.reviews ?? [],

  getAverageRating: (artisanId) => {
    const reviews = get().cache[artisanId]?.reviews ?? [];
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
  },

  getTotalReviews: (artisanId) => get().cache[artisanId]?.totalItems ?? 0,

  isReviewed: (bookingId) => get().reviewedBookings.has(bookingId),

  markReviewed: (bookingId) => {
    set((state) => ({
      reviewedBookings: new Set(state.reviewedBookings).add(bookingId),
    }));
  },
}));
