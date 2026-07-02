import { Review } from '@app-types/index';

export interface CreateReviewRequest {
  bookingId: string;
  rating: number;
  comment: string;
}

export interface PaginatedReviews {
  items: Review[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export interface ReviewWithMeta extends Review {
  student?: { id: string; name: string; avatarUrl?: string };
  artisan?: { id: string; businessName: string; avatarUrl?: string };
}

export interface ReviewsCache {
  [artisanId: string]: {
    reviews: ReviewWithMeta[];
    page: number;
    totalPages: number;
    totalItems: number;
  };
}
