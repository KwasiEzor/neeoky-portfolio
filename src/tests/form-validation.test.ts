import { describe, it, expect } from 'vitest';
import {
  serviceStepSchema,
  packStepSchema,
  projectStepSchema,
  contactStepSchema,
  completeFormSchema,
  validateStep,
  validateFile,
  formatFileSize,
} from '../lib/validations/schemas';

describe('Service Step Validation', () => {
  it('should validate correct service selection', () => {
    const data = {
      selectedServices: ['service-1', 'service-2'],
    };

    const result = serviceStepSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should reject empty service selection', () => {
    const data = {
      selectedServices: [],
    };

    const result = serviceStepSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should reject too many services', () => {
    const data = {
      selectedServices: Array(11).fill('service'),
    };

    const result = serviceStepSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe('Pack Step Validation', () => {
  it('should validate valid pack selection', () => {
    const data = {
      selectedPack: 'pro',
    };

    const result = packStepSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should validate custom pack with details', () => {
    const data = {
      selectedPack: 'custom',
      customPackDetails: 'Besoins spécifiques pour mon projet',
    };

    const result = packStepSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should reject invalid pack value', () => {
    const data = {
      selectedPack: 'invalid',
    };

    const result = packStepSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe('Project Step Validation', () => {
  it('should validate complete project details', () => {
    const data = {
      projectType: 'Site vitrine',
      projectDescription: 'A'.repeat(60), // At least 50 chars
      budget: '5 000€ - 10 000€',
      timeline: '1-2 mois',
    };

    const result = projectStepSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should reject short project description', () => {
    const data = {
      projectType: 'Site vitrine',
      projectDescription: 'Too short',
      budget: '5 000€ - 10 000€',
      timeline: '1-2 mois',
    };

    const result = projectStepSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should reject very long project description', () => {
    const data = {
      projectType: 'Site vitrine',
      projectDescription: 'A'.repeat(1100), // More than 1000
      budget: '5 000€ - 10 000€',
      timeline: '1-2 mois',
    };

    const result = projectStepSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe('Contact Step Validation', () => {
  it('should validate complete contact information', () => {
    const data = {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      phone: '0612345678',
      company: 'Test Company',
      gdprConsent: true,
    };

    const result = contactStepSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should validate without optional fields', () => {
    const data = {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      gdprConsent: true,
    };

    const result = contactStepSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const data = {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'invalid-email',
      gdprConsent: true,
    };

    const result = contactStepSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should reject invalid phone number', () => {
    const data = {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean@example.com',
      phone: '123', // Invalid French phone
      gdprConsent: true,
    };

    const result = contactStepSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should reject without GDPR consent', () => {
    const data = {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean@example.com',
      gdprConsent: false,
    };

    const result = contactStepSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should reject names with invalid characters', () => {
    const data = {
      firstName: 'Jean123',
      lastName: 'Dupont',
      email: 'jean@example.com',
      gdprConsent: true,
    };

    const result = contactStepSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe('Complete Form Validation', () => {
  it('should validate complete form data', () => {
    const data = {
      selectedServices: ['service-1'],
      selectedPack: 'pro',
      projectType: 'Site vitrine',
      projectDescription: 'A'.repeat(60),
      budget: '5 000€ - 10 000€',
      timeline: '1-2 mois',
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      phone: '0612345678',
      company: 'Test Company',
      gdprConsent: true,
    };

    const result = completeFormSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});

describe('Validate Step Helper', () => {
  it('should validate step 1 correctly', () => {
    const data = {
      selectedServices: ['service-1'],
    };

    const result = validateStep(1, data);
    expect(result.success).toBe(true);
    expect(result.errors).toBe(null);
  });

  it('should return errors for invalid step', () => {
    const data = {
      selectedServices: [],
    };

    const result = validateStep(1, data);
    expect(result.success).toBe(false);
    expect(result.errors).toBeTruthy();
  });
});

describe('File Validation', () => {
  it('should format file size correctly', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1024 * 1024)).toBe('1 MB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5 MB');
  });

  it('should validate file type', () => {
    const pdfFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const result = validateFile(pdfFile);
    expect(result.valid).toBe(true);
  });

  it('should reject invalid file type', () => {
    const exeFile = new File(['test'], 'test.exe', { type: 'application/x-msdownload' });
    const result = validateFile(exeFile);
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('should reject files that are too large', () => {
    const largeContent = new Array(6 * 1024 * 1024).fill('a').join('');
    const largeFile = new File([largeContent], 'large.pdf', { type: 'application/pdf' });
    const result = validateFile(largeFile);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('trop volumineux');
  });
});
