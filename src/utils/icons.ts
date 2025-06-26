// Import all icons
import repair from '../assets/icons/repair.png';
import cleaning from '../assets/icons/cleaning.png';
import painting from '../assets/icons/painting.png';
import plumbing from '../assets/icons/plumbing.png';
import laundry from '../assets/icons/laundry.png';
import acMechanic from '../assets/icons/AC-mechanic.png';
import courier from '../assets/icons/courier.png';
import salon from '../assets/icons/salon.png';

// Export icon mapping
export const serviceIcons = {
  repair,
  cleaning,
  painting,
  plumbing,
  laundry,
  'ac-mechanic': acMechanic,
  courier,
  salon,
} as const;

// Type for service icons
export type ServiceIconName = keyof typeof serviceIcons; 