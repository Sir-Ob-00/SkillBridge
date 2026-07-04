export interface Category {
  id: string;
  label: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { id: 'graphic_design', label: 'Graphic Design', icon: 'pen-tool' },
  { id: 'photography', label: 'Photography', icon: 'camera' },
  { id: 'barbering', label: 'Barbering', icon: 'scissors' },
  { id: 'makeup', label: 'Makeup', icon: 'palette' },
  { id: 'tailoring', label: 'Tailoring', icon: 'shirt' },
  { id: 'laptop_repair', label: 'Laptop Repair', icon: 'monitor' },
  { id: 'phone_repair', label: 'Phone Repair', icon: 'smartphone' },
  { id: 'tutoring', label: 'Tutoring', icon: 'book-open' },
  { id: 'event_decoration', label: 'Event Decoration', icon: 'sparkles' },
];
