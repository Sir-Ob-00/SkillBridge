import { ReviewWithMeta } from './reviews.types';

export function calculateAverageRating(reviews: ReviewWithMeta[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / reviews.length;
}

export function getRatingBreakdown(reviews: ReviewWithMeta[]) {
  return [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    return {
      star,
      count,
      percentage: reviews.length > 0 ? (count / reviews.length) * 100 : 0,
    };
  });
}

export function getReviewerName(review: ReviewWithMeta): string {
  return review.student?.name ?? `Student #${review.studentId.slice(-4).toUpperCase()}`;
}

export function formatReviewDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function validateReview(
  rating: number,
  comment: string
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (rating < 1 || rating > 5) {
    errors.rating = 'Please select a rating (1–5 stars).';
  }
  if (!comment.trim()) {
    errors.comment = 'Please write a comment.';
  } else if (comment.trim().length < 5) {
    errors.comment = 'Comment must be at least 5 characters.';
  } else if (comment.trim().length > 1000) {
    errors.comment = 'Comment must be under 1000 characters.';
  }

  return errors;
}

export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    if (err.response?.data?.message) return err.response.data.message;
    if (err.message) return err.message;
  }
  return 'Something went wrong. Please try again.';
}
