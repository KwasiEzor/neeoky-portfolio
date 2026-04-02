import { atom, map, computed } from 'nanostores';
import { persistentMap, persistentAtom } from '@nanostores/persistent';
import type { CompleteFormData } from '../lib/validations/schemas';

// ========================================
// FORM DATA STORE (PERSISTENT)
// ========================================
export const formData = persistentMap<Partial<CompleteFormData>>('neeoky-form-data:', {}, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

// ========================================
// NAVIGATION STORES
// ========================================
export const currentStep = persistentAtom<number>('neeoky-current-step:', 1, {
  encode: String,
  decode: Number,
});

export const totalSteps = atom<number>(5);

// ========================================
// VALIDATION STORE
// ========================================
export const stepValidation = map<Record<number, boolean>>({
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
});

export const stepErrors = map<Record<string, string>>({});

// ========================================
// UI STATE STORES
// ========================================
export const isSubmitting = atom<boolean>(false);
export const submitError = atom<string | null>(null);
export const submitSuccess = atom<boolean>(false);

export const lastSaved = persistentAtom<string | null>('neeoky-last-saved:', null, {
  encode: (date) => date || '',
  decode: (str) => str || null,
});

export const sessionId = persistentAtom<string>('neeoky-session-id:', '', {
  encode: String,
  decode: String,
});

// ========================================
// COMPUTED VALUES
// ========================================

/**
 * Calculate progress percentage
 */
export const progress = computed([currentStep, totalSteps], (current, total) => {
  return Math.round((current / total) * 100);
});

/**
 * Check if current step is valid
 */
export const isCurrentStepValid = computed(
  [currentStep, stepValidation],
  (current, validation) => {
    return validation[current] === true;
  }
);

/**
 * Check if can go to next step
 */
export const canGoNext = computed(
  [currentStep, totalSteps, isCurrentStepValid],
  (current, total, isValid) => {
    return current < total && isValid;
  }
);

/**
 * Check if can go to previous step
 */
export const canGoPrevious = computed([currentStep], (current) => {
  return current > 1;
});

/**
 * Check if form is complete
 */
export const isFormComplete = computed([stepValidation], (validation) => {
  return Object.values(validation).every((valid) => valid === true);
});

// ========================================
// ACTIONS
// ========================================

/**
 * Navigate to next step
 */
export function nextStep() {
  const current = currentStep.get();
  const total = totalSteps.get();
  const isValid = isCurrentStepValid.get();

  if (current < total && isValid) {
    currentStep.set(current + 1);
    // Clear errors when moving to next step
    stepErrors.set({});
  }
}

/**
 * Navigate to previous step
 */
export function previousStep() {
  const current = currentStep.get();

  if (current > 1) {
    currentStep.set(current - 1);
    // Clear errors when moving to previous step
    stepErrors.set({});
  }
}

/**
 * Go to specific step
 */
export function goToStep(step: number) {
  const total = totalSteps.get();

  if (step >= 1 && step <= total) {
    currentStep.set(step);
    stepErrors.set({});
  }
}

/**
 * Update form data
 */
export function updateFormData(data: Partial<CompleteFormData>) {
  const current = formData.get();
  formData.set({ ...current, ...data });

  // Update last saved timestamp
  lastSaved.set(new Date().toISOString());
}

/**
 * Mark step as valid/invalid
 */
export function setStepValid(step: number, valid: boolean) {
  const current = stepValidation.get();
  stepValidation.set({ ...current, [step]: valid });
}

/**
 * Set validation errors
 */
export function setErrors(errors: Record<string, string>) {
  stepErrors.set(errors);
}

/**
 * Clear all errors
 */
export function clearErrors() {
  stepErrors.set({});
}

/**
 * Reset entire form
 */
export function resetForm() {
  formData.set({});
  currentStep.set(1);
  stepValidation.set({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });
  stepErrors.set({});
  isSubmitting.set(false);
  submitError.set(null);
  submitSuccess.set(false);
  lastSaved.set(null);
}

/**
 * Start form submission
 */
export function startSubmission() {
  isSubmitting.set(true);
  submitError.set(null);
  submitSuccess.set(false);
}

/**
 * Handle submission success
 */
export function handleSubmitSuccess() {
  isSubmitting.set(false);
  submitSuccess.set(true);
  submitError.set(null);
}

/**
 * Handle submission error
 */
export function handleSubmitError(error: string) {
  isSubmitting.set(false);
  submitSuccess.set(false);
  submitError.set(error);
}

/**
 * Get form data as plain object
 */
export function getFormData(): Partial<CompleteFormData> {
  return { ...formData.get() };
}

/**
 * Load saved form data (for recovery)
 */
export function loadSavedData(): {
  hasData: boolean;
  data: Partial<CompleteFormData>;
  step: number;
  savedAt: string | null;
} {
  const data = formData.get();
  const step = currentStep.get();
  const savedAt = lastSaved.get();
  const hasData = Object.keys(data).length > 0;

  return {
    hasData,
    data,
    step,
    savedAt,
  };
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Format last saved time for display
 */
export function getLastSavedText(): string {
  const saved = lastSaved.get();
  if (!saved) return 'Non sauvegardé';

  const date = new Date(saved);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Sauvegardé à l\'instant';
  if (diffMins === 1) return 'Sauvegardé il y a 1 minute';
  if (diffMins < 60) return `Sauvegardé il y a ${diffMins} minutes`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return 'Sauvegardé il y a 1 heure';
  if (diffHours < 24) return `Sauvegardé il y a ${diffHours} heures`;

  return `Sauvegardé le ${date.toLocaleDateString('fr-FR')}`;
}
