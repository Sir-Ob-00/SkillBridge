export interface Category {
  id: string;
  label: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { id: 'electrician', label: 'Electrician', icon: 'zap' },
  { id: 'plumber', label: 'Plumber', icon: 'droplets' },
  { id: 'carpenter', label: 'Carpenter', icon: 'ruler' },
  { id: 'painter', label: 'Painter', icon: 'paintbrush' },
  { id: 'welder', label: 'Welder', icon: 'wrench' },
  { id: 'mason', label: 'Mason', icon: 'hard-hat' },
  { id: 'tailor', label: 'Tailor / Fashion Designer', icon: 'shirt' },
  { id: 'barber', label: 'Hair Stylist / Barber', icon: 'scissors' },
  { id: 'makeup_artist', label: 'Makeup Artist', icon: 'palette' },
  { id: 'ac_refrigeration', label: 'AC & Refrigeration Technician', icon: 'snowflake' },
  { id: 'phone_computer_tech', label: 'Phone / Computer Technician', icon: 'smartphone' },
  { id: 'auto_mechanic', label: 'Auto Mechanic', icon: 'car' },
];
