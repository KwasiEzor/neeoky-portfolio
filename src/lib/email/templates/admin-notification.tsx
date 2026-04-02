import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Button,
} from '@react-email/components';

interface AdminNotificationProps {
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
  createdAt?: string;
}

export function AdminNotificationEmail({
  leadId,
  firstName,
  lastName,
  email,
  phone,
  company,
  projectType,
  projectDescription,
  budget,
  timeline,
  services,
  pack,
  createdAt = new Date().toLocaleString('fr-FR'),
}: AdminNotificationProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>
              🆕 Nouvelle Demande de Devis
            </Heading>
            <Text style={subtitle}>
              Reçue le {createdAt}
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            {/* Contact Info */}
            <Heading style={h2}>👤 Contact</Heading>
            <Section style={infoBox}>
              <Text style={infoRow}>
                <strong>Nom:</strong> {firstName} {lastName}
              </Text>
              <Text style={infoRow}>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${email}`} style={link}>{email}</a>
              </Text>
              {phone && (
                <Text style={infoRow}>
                  <strong>Téléphone:</strong>{' '}
                  <a href={`tel:${phone}`} style={link}>{phone}</a>
                </Text>
              )}
              {company && (
                <Text style={infoRow}>
                  <strong>Entreprise:</strong> {company}
                </Text>
              )}
            </Section>

            {/* Project Details */}
            <Heading style={h2}>🎯 Projet</Heading>
            <Section style={infoBox}>
              <Text style={infoRow}>
                <strong>Type:</strong> {projectType}
              </Text>
              <Text style={infoRow}>
                <strong>Budget:</strong> {budget}
              </Text>
              <Text style={infoRow}>
                <strong>Délai:</strong> {timeline}
              </Text>
              <Text style={infoRow}>
                <strong>Pack:</strong> {pack}
              </Text>
            </Section>

            {/* Services */}
            <Heading style={h2}>📋 Services Sélectionnés</Heading>
            <Section style={infoBox}>
              <ul style={list}>
                {services.map((service, index) => (
                  <li key={index} style={listItem}>{service}</li>
                ))}
              </ul>
            </Section>

            {/* Description */}
            <Heading style={h2}>📝 Description</Heading>
            <Section style={descriptionBox}>
              <Text style={description}>{projectDescription}</Text>
            </Section>

            {/* CTA */}
            <Section style={buttonContainer}>
              <Button
                style={button}
                href={`https://neeoky.com/admin/leads/${leadId}`}
              >
                Voir dans Sanity Studio
              </Button>
            </Section>

            <Hr style={hr} />

            {/* Quick Actions */}
            <Text style={quickActionsTitle}>Actions Rapides:</Text>
            <Section style={quickActions}>
              <Text style={quickAction}>
                ✉️ <a href={`mailto:${email}`} style={link}>Répondre par email</a>
              </Text>
              {phone && (
                <Text style={quickAction}>
                  📞 <a href={`tel:${phone}`} style={link}>Appeler</a>
                </Text>
              )}
              <Text style={quickAction}>
                📊 <a href="https://neeoky.com/admin" style={link}>Dashboard</a>
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Référence: {leadId}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f5f5f5',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0',
  marginBottom: '64px',
  maxWidth: '600px',
  border: '1px solid #e6e6e6',
};

const header = {
  padding: '32px 32px 16px',
  backgroundColor: '#a855f7',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 8px',
  padding: '0',
};

const subtitle = {
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '14px',
  margin: '0',
};

const content = {
  padding: '32px',
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '600',
  margin: '24px 0 12px',
  padding: '0',
};

const infoBox = {
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '16px',
};

const infoRow = {
  color: '#404040',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '6px 0',
};

const list = {
  color: '#404040',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
  paddingLeft: '20px',
};

const listItem = {
  margin: '4px 0',
};

const descriptionBox = {
  backgroundColor: '#f0f0f0',
  borderLeft: '4px solid #a855f7',
  borderRadius: '4px',
  padding: '16px',
  marginBottom: '16px',
};

const description = {
  color: '#404040',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};

const buttonContainer = {
  padding: '24px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#a855f7',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const link = {
  color: '#a855f7',
  textDecoration: 'underline',
};

const hr = {
  borderColor: '#e6e6e6',
  margin: '24px 0',
};

const quickActionsTitle = {
  color: '#666666',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const quickActions = {
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  padding: '16px',
};

const quickAction = {
  color: '#404040',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '6px 0',
};

const footer = {
  padding: '0 32px 32px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#999999',
  fontSize: '12px',
  margin: '0',
};

export default AdminNotificationEmail;
