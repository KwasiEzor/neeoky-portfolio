import { sanityWriteClient } from './client';
import type { CompleteFormData } from '../validations/schemas';
import { nanoid } from 'nanoid';

// ========================================
// TYPE DEFINITIONS
// ========================================

interface CreateLeadInput extends Omit<CompleteFormData, 'attachments'> {
  source?: string;
  sessionId?: string;
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
}

interface UpdateLeadInput {
  status?: string;
  priority?: string;
  notes?: string;
  assignedTo?: string;
  estimatedValue?: number;
  convertedAt?: string;
}

// ========================================
// MUTATIONS
// ========================================

/**
 * Create a new lead in Sanity
 */
export async function createLead(data: CreateLeadInput) {
  try {
    // Prepare the document
    const doc = {
      _type: 'lead',

      // Contact
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase(),
      phone: data.phone || null,
      company: data.company || null,
      gdprConsent: data.gdprConsent,

      // Selection
      selectedServices: data.selectedServices.map((serviceId) => ({
        _type: 'reference',
        _ref: serviceId,
      })),
      selectedPack: data.selectedPack,
      customPackDetails: data.customPackDetails || null,

      // Project
      projectType: data.projectType,
      projectDescription: data.projectDescription,
      budget: data.budget,
      timeline: data.timeline,

      // Tracking
      status: 'new',
      priority: determinePriority(data),
      source: data.source || 'direct',
      sessionId: data.sessionId || nanoid(16),
      utmParams: data.utmParams || null,

      // Timestamps
      _createdAt: new Date().toISOString(),
    };

    // Create the document
    const result = await sanityWriteClient.create(doc);

    return {
      success: true,
      leadId: result._id,
      data: result,
    };
  } catch (error) {
    console.error('Error creating lead:', error);
    throw new Error('Failed to create lead');
  }
}

/**
 * Update an existing lead
 */
export async function updateLead(leadId: string, updates: UpdateLeadInput) {
  try {
    const result = await sanityWriteClient
      .patch(leadId)
      .set(updates)
      .commit();

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error updating lead:', error);
    throw new Error('Failed to update lead');
  }
}

/**
 * Add a note to a lead
 */
export async function addLeadNote(leadId: string, note: string) {
  try {
    const result = await sanityWriteClient
      .patch(leadId)
      .setIfMissing({ notes: [] })
      .append('notes', [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: note,
            },
          ],
        },
      ])
      .commit();

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error adding note:', error);
    throw new Error('Failed to add note');
  }
}

/**
 * Mark lead as converted
 */
export async function convertLead(leadId: string, estimatedValue?: number) {
  try {
    const result = await sanityWriteClient
      .patch(leadId)
      .set({
        status: 'converted',
        convertedAt: new Date().toISOString(),
        ...(estimatedValue && { estimatedValue }),
      })
      .commit();

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error converting lead:', error);
    throw new Error('Failed to convert lead');
  }
}

/**
 * Archive a lead
 */
export async function archiveLead(leadId: string) {
  try {
    const result = await sanityWriteClient
      .patch(leadId)
      .set({ status: 'archived' })
      .commit();

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error archiving lead:', error);
    throw new Error('Failed to archive lead');
  }
}

/**
 * Delete a lead permanently
 */
export async function deleteLead(leadId: string) {
  try {
    const result = await sanityWriteClient.delete(leadId);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error deleting lead:', error);
    throw new Error('Failed to delete lead');
  }
}

/**
 * Save a draft (incomplete form)
 */
export async function saveDraft(data: Partial<CreateLeadInput>, draftId?: string) {
  try {
    // If draftId exists, update existing draft
    if (draftId) {
      const result = await sanityWriteClient
        .patch(draftId)
        .set({
          ...data,
          _updatedAt: new Date().toISOString(),
        })
        .commit();

      return {
        success: true,
        draftId: result._id,
        data: result,
      };
    }

    // Otherwise, create new draft
    const doc = {
      _type: 'draft',
      ...data,
      sessionId: data.sessionId || nanoid(16),
      _createdAt: new Date().toISOString(),
    };

    const result = await sanityWriteClient.create(doc);

    return {
      success: true,
      draftId: result._id,
      data: result,
    };
  } catch (error) {
    console.error('Error saving draft:', error);
    throw new Error('Failed to save draft');
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Determine lead priority based on data
 */
function determinePriority(data: CreateLeadInput): 'high' | 'medium' | 'low' {
  // High priority if:
  // - Timeline is urgent
  // - Budget is high
  if (
    data.timeline?.includes('Urgent') ||
    data.budget?.includes('> 20 000€') ||
    data.budget?.includes('10 000€ - 20 000€')
  ) {
    return 'high';
  }

  // Low priority if:
  // - Timeline is flexible
  // - Budget is low
  if (
    data.timeline?.includes('Flexible') ||
    data.timeline?.includes('> 3 mois') ||
    data.budget?.includes('< 2 000€')
  ) {
    return 'low';
  }

  // Default to medium
  return 'medium';
}

/**
 * Parse UTM parameters from URL
 */
export function parseUTMParams(url: string): {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
} | null {
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;

    const utmSource = params.get('utm_source');
    const utmMedium = params.get('utm_medium');
    const utmCampaign = params.get('utm_campaign');
    const utmTerm = params.get('utm_term');
    const utmContent = params.get('utm_content');

    // Return null if no UTM params found
    if (!utmSource && !utmMedium && !utmCampaign) {
      return null;
    }

    return {
      source: utmSource || undefined,
      medium: utmMedium || undefined,
      campaign: utmCampaign || undefined,
      term: utmTerm || undefined,
      content: utmContent || undefined,
    };
  } catch {
    return null;
  }
}
