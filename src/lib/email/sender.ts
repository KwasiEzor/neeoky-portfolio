import { Resend } from 'resend';
import { render } from '@react-email/render';
import { ConfirmationEmail } from './templates/confirmation';
import { AdminNotificationEmail } from './templates/admin-notification';

// Initialize Resend
const resendApiKey = import.meta.env.RESEND_API_KEY;
const adminEmail = import.meta.env.ADMIN_EMAIL || 'contact@neeoky.com';
const fromEmail = import.meta.env.FROM_EMAIL || 'Neeoky <noreply@neeoky.com>';

let resend: Resend | null = null;

if (resendApiKey) {
  resend = new Resend(resendApiKey);
} else {
  console.warn('⚠️ RESEND_API_KEY not configured. Email sending is disabled.');
}

/**
 * Check if email service is configured
 */
export function isEmailConfigured(): boolean {
  return resend !== null;
}

/**
 * Send confirmation email to client
 */
export async function sendConfirmationEmail(
  to: string,
  data: {
    leadId: string;
    firstName: string;
    lastName: string;
    projectType?: string;
    services?: string[];
  }
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!resend) {
    console.warn('Email service not configured. Skipping confirmation email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const emailHtml = render(ConfirmationEmail(data));

    const result = await resend.emails.send({
      from: fromEmail,
      to,
      subject: `Confirmation de votre demande - ${data.projectType || 'Projet'}`,
      html: emailHtml,
      tags: [
        {
          name: 'type',
          value: 'confirmation',
        },
        {
          name: 'lead_id',
          value: data.leadId,
        },
      ],
    });

    if (result.error) {
      console.error('Error sending confirmation email:', result.error);
      return { success: false, error: result.error.message };
    }

    console.log('✅ Confirmation email sent:', result.data?.id);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send notification email to admin
 */
export async function sendAdminNotification(data: {
  leadId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: string;
  projectDescription: string;
  budget: string;
  timeline: string;
  services: string[];
  pack: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!resend) {
    console.warn('Email service not configured. Skipping admin notification.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const emailHtml = render(AdminNotificationEmail(data));

    const result = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `🆕 Nouveau Lead: ${data.firstName} ${data.lastName} - ${data.projectType}`,
      html: emailHtml,
      tags: [
        {
          name: 'type',
          value: 'admin_notification',
        },
        {
          name: 'lead_id',
          value: data.leadId,
        },
      ],
    });

    if (result.error) {
      console.error('Error sending admin notification:', result.error);
      return { success: false, error: result.error.message };
    }

    console.log('✅ Admin notification sent:', result.data?.id);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send both confirmation and admin notification emails
 */
export async function sendAllNotifications(
  clientEmail: string,
  data: {
    leadId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    projectType: string;
    projectDescription: string;
    budget: string;
    timeline: string;
    services: string[];
    pack: string;
  }
): Promise<{
  confirmation: { success: boolean; messageId?: string; error?: string };
  admin: { success: boolean; messageId?: string; error?: string };
}> {
  const [confirmation, admin] = await Promise.allSettled([
    sendConfirmationEmail(clientEmail, {
      leadId: data.leadId,
      firstName: data.firstName,
      lastName: data.lastName,
      projectType: data.projectType,
      services: data.services,
    }),
    sendAdminNotification(data),
  ]);

  return {
    confirmation:
      confirmation.status === 'fulfilled'
        ? confirmation.value
        : { success: false, error: confirmation.reason?.message },
    admin:
      admin.status === 'fulfilled'
        ? admin.value
        : { success: false, error: admin.reason?.message },
  };
}

/**
 * Format services names for email display
 */
export function formatServicesForEmail(
  services: any[],
  selectedServiceIds: string[]
): string[] {
  return selectedServiceIds
    .map((id) => {
      const service = services.find((s) => s._id === id);
      return service ? `${service.icon || '📦'} ${service.name}` : null;
    })
    .filter((name): name is string => name !== null);
}

/**
 * Format pack name for email display
 */
export function formatPackForEmail(pack: string): string {
  const packs: Record<string, string> = {
    starter: '🌱 Starter',
    pro: '💼 Pro',
    premium: '⭐ Premium',
    custom: '🎨 Sur mesure',
  };
  return packs[pack] || pack;
}
