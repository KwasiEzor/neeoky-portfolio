import { z } from 'zod';

// ========================================
// STEP 1: SERVICE SELECTION
// ========================================
export const serviceStepSchema = z.object({
  selectedServices: z
    .array(z.string())
    .min(1, 'Sélectionnez au moins un service')
    .max(10, 'Maximum 10 services'),
});

// ========================================
// STEP 2: PACK SELECTION
// ========================================
export const packStepSchema = z.object({
  selectedPack: z.enum(['starter', 'pro', 'premium', 'custom'], {
    required_error: 'Sélectionnez un pack',
    invalid_type_error: 'Pack invalide',
  }),
  customPackDetails: z
    .string()
    .max(500, 'Maximum 500 caractères')
    .optional(),
});

// ========================================
// STEP 3: PROJECT DETAILS
// ========================================
export const projectStepSchema = z.object({
  projectType: z
    .string({
      required_error: 'Sélectionnez un type de projet',
    })
    .min(1, 'Sélectionnez un type de projet'),

  projectDescription: z
    .string({
      required_error: 'Décrivez votre projet',
    })
    .min(50, 'Décrivez votre projet en au moins 50 caractères')
    .max(1000, 'Maximum 1000 caractères'),

  budget: z
    .string({
      required_error: 'Sélectionnez une fourchette de budget',
    })
    .min(1, 'Sélectionnez une fourchette de budget'),

  timeline: z
    .string({
      required_error: 'Sélectionnez un délai',
    })
    .min(1, 'Sélectionnez un délai'),

  attachments: z
    .array(z.instanceof(File))
    .max(5, 'Maximum 5 fichiers')
    .optional(),
});

// ========================================
// STEP 4: CONTACT INFORMATION
// ========================================
const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;

export const contactStepSchema = z.object({
  firstName: z
    .string({
      required_error: 'Le prénom est requis',
    })
    .min(2, 'Prénom trop court (minimum 2 caractères)')
    .max(50, 'Prénom trop long (maximum 50 caractères)')
    .regex(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Le prénom contient des caractères invalides'),

  lastName: z
    .string({
      required_error: 'Le nom est requis',
    })
    .min(2, 'Nom trop court (minimum 2 caractères)')
    .max(50, 'Nom trop long (maximum 50 caractères)')
    .regex(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Le nom contient des caractères invalides'),

  email: z
    .string({
      required_error: "L'email est requis",
    })
    .email('Email invalide')
    .toLowerCase(),

  phone: z
    .string()
    .regex(phoneRegex, 'Numéro de téléphone français invalide (ex: 06 12 34 56 78)')
    .optional()
    .or(z.literal('')),

  company: z
    .string()
    .max(100, 'Nom d\'entreprise trop long (maximum 100 caractères)')
    .optional(),

  gdprConsent: z
    .boolean({
      required_error: 'Vous devez accepter la politique de confidentialité',
    })
    .refine(
      (val) => val === true,
      'Vous devez accepter la politique de confidentialité pour continuer'
    ),
});

// ========================================
// COMPLETE FORM (ALL STEPS COMBINED)
// ========================================
export const completeFormSchema = serviceStepSchema
  .merge(packStepSchema)
  .merge(projectStepSchema)
  .merge(contactStepSchema);

// ========================================
// TYPESCRIPT TYPES (AUTO-GENERATED)
// ========================================
export type ServiceStepData = z.infer<typeof serviceStepSchema>;
export type PackStepData = z.infer<typeof packStepSchema>;
export type ProjectStepData = z.infer<typeof projectStepSchema>;
export type ContactStepData = z.infer<typeof contactStepSchema>;
export type CompleteFormData = z.infer<typeof completeFormSchema>;

// ========================================
// VALIDATION HELPERS
// ========================================

/**
 * Validate a specific step and return formatted errors
 */
export function validateStep(step: number, data: Partial<CompleteFormData>) {
  try {
    switch (step) {
      case 1:
        serviceStepSchema.parse(data);
        break;
      case 2:
        packStepSchema.parse(data);
        break;
      case 3:
        projectStepSchema.parse(data);
        break;
      case 4:
        contactStepSchema.parse(data);
        break;
      case 5:
        completeFormSchema.parse(data);
        break;
      default:
        throw new Error(`Invalid step: ${step}`);
    }
    return { success: true as const, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false as const,
        errors: error.errors.reduce((acc, err) => {
          const path = err.path.join('.');
          acc[path] = err.message;
          return acc;
        }, {} as Record<string, string>),
      };
    }
    throw error;
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate file type
 */
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const;

export const ALLOWED_FILE_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
] as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Fichier trop volumineux. Maximum: ${formatFileSize(MAX_FILE_SIZE)}`,
    };
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type as any)) {
    return {
      valid: false,
      error: `Type de fichier non autorisé. Formats acceptés: ${ALLOWED_FILE_EXTENSIONS.join(', ')}`,
    };
  }

  return { valid: true };
}
