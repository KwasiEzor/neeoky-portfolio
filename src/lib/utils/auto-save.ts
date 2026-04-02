/**
 * Auto-save utility for form data
 */

import { formData, lastSaved } from '../../stores/formStore';
import { showAutoSave } from './toast';

let autoSaveTimeout: NodeJS.Timeout | null = null;
let isAutoSaveEnabled = true;

/**
 * Configure auto-save behavior
 */
export function configureAutoSave(options: {
  enabled?: boolean;
  interval?: number;
}) {
  if (options.enabled !== undefined) {
    isAutoSaveEnabled = options.enabled;
  }
}

/**
 * Trigger auto-save with debounce
 * @param delay - Delay in milliseconds before saving (default: 2000ms)
 */
export function triggerAutoSave(delay: number = 2000) {
  if (!isAutoSaveEnabled) return;

  // Clear existing timeout
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }

  // Set new timeout
  autoSaveTimeout = setTimeout(() => {
    performAutoSave();
  }, delay);
}

/**
 * Perform immediate auto-save
 */
function performAutoSave() {
  if (!isAutoSaveEnabled) return;

  const data = formData.get();

  // Only save if there's data
  if (Object.keys(data).length > 0) {
    // Data is already persisted via persistentMap
    // We just need to update the timestamp
    lastSaved.set(new Date().toISOString());

    // Show notification
    showAutoSave();
  }
}

/**
 * Start periodic auto-save
 * @param interval - Interval in milliseconds (default: 30000ms = 30s)
 */
export function startPeriodicAutoSave(interval: number = 30000) {
  if (!isAutoSaveEnabled) return;

  setInterval(() => {
    performAutoSave();
  }, interval);
}

/**
 * Clear all auto-save data
 */
export function clearAutoSave() {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = null;
  }

  // Clear form data
  formData.set({});
  lastSaved.set(null);
}

/**
 * Check if there's saved data
 */
export function hasSavedData(): boolean {
  const data = formData.get();
  return Object.keys(data).length > 0;
}

/**
 * Get time since last save in human-readable format
 */
export function getTimeSinceLastSave(): string | null {
  const saved = lastSaved.get();
  if (!saved) return null;

  const date = new Date(saved);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);

  if (diffSecs < 10) return 'à l\'instant';
  if (diffSecs < 60) return `il y a ${diffSecs}s`;
  if (diffMins < 60) return `il y a ${diffMins}min`;
  if (diffHours < 24) return `il y a ${diffHours}h`;

  return `le ${date.toLocaleDateString('fr-FR')}`;
}
