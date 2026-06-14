export interface Category {
  id: string;
  label: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { id: 'barber', label: 'Barbers', icon: 'scissors' },
  { id: 'designer', label: 'Designers', icon: 'pen-tool' },
  { id: 'tutor', label: 'Tutors', icon: 'book-open' },
  { id: 'tailor', label: 'Tailors', icon: 'shirt' },
  { id: 'photographer', label: 'Photographers', icon: 'camera' },
  { id: 'caterer', label: 'Caterers', icon: 'utensils' },
  { id: 'cleaner', label: 'Cleaning', icon: 'spray-can' },
  { id: 'tech', label: 'Tech Repair', icon: 'smartphone' },
];
