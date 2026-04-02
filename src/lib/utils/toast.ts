/**
 * Toast notification utilities
 * Wrapper around Sonner with custom presets
 */

declare global {
  interface Window {
    toast: any;
  }
}

/**
 * Show success toast
 */
export function showSuccess(message: string, description?: string) {
  if (typeof window !== 'undefined' && window.toast) {
    window.toast.success(message, {
      description,
      duration: 4000,
    });
  }
}

/**
 * Show error toast
 */
export function showError(message: string, description?: string) {
  if (typeof window !== 'undefined' && window.toast) {
    window.toast.error(message, {
      description,
      duration: 6000,
    });
  }
}

/**
 * Show info toast
 */
export function showInfo(message: string, description?: string) {
  if (typeof window !== 'undefined' && window.toast) {
    window.toast.info(message, {
      description,
      duration: 3000,
    });
  }
}

/**
 * Show warning toast
 */
export function showWarning(message: string, description?: string) {
  if (typeof window !== 'undefined' && window.toast) {
    window.toast.warning(message, {
      description,
      duration: 5000,
    });
  }
}

/**
 * Show loading toast (returns ID for dismissal)
 */
export function showLoading(message: string): string | number {
  if (typeof window !== 'undefined' && window.toast) {
    return window.toast.loading(message);
  }
  return '';
}

/**
 * Dismiss a specific toast
 */
export function dismissToast(id: string | number) {
  if (typeof window !== 'undefined' && window.toast) {
    window.toast.dismiss(id);
  }
}

/**
 * Show auto-save notification
 */
export function showAutoSave() {
  if (typeof window !== 'undefined' && window.toast) {
    window.toast.success('Brouillon sauvegardé', {
      duration: 2000,
      position: 'bottom-right',
    });
  }
}

/**
 * Show form submission success
 */
export function showSubmitSuccess() {
  if (typeof window !== 'undefined' && window.toast) {
    window.toast.success('Demande envoyée!', {
      description: 'Nous vous recontacterons rapidement',
      duration: 5000,
    });
  }
}

/**
 * Show form submission error
 */
export function showSubmitError(error?: string) {
  if (typeof window !== 'undefined' && window.toast) {
    window.toast.error('Erreur lors de l\'envoi', {
      description: error || 'Veuillez réessayer',
      duration: 6000,
    });
  }
}

/**
 * Show rate limit error
 */
export function showRateLimitError(retryAfter?: string) {
  if (typeof window !== 'undefined' && window.toast) {
    window.toast.error('Trop de requêtes', {
      description: retryAfter
        ? `Veuillez réessayer dans ${retryAfter}`
        : 'Veuillez réessayer plus tard',
      duration: 8000,
    });
  }
}

/**
 * Show validation error
 */
export function showValidationError(message: string = 'Veuillez vérifier les champs') {
  if (typeof window !== 'undefined' && window.toast) {
    window.toast.error('Formulaire invalide', {
      description: message,
      duration: 4000,
    });
  }
}
