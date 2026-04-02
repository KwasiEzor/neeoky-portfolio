import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function to merge class names with clsx
 * Similar to shadcn/ui's cn() helper
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
