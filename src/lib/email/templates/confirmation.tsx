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
  Link,
} from '@react-email/components';

interface ConfirmationEmailProps {
  firstName: string;
  lastName: string;
  leadId: string;
  projectType?: string;
  services?: string[];
}

export function ConfirmationEmail({
  firstName,
  lastName,
  leadId,
  projectType = 'votre projet',
  services = [],
}: ConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>
              Merci pour votre demande! 🎉
            </Heading>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={paragraph}>
              Bonjour {firstName} {lastName},
            </Text>

            <Text style={paragraph}>
              Nous avons bien reçu votre demande de devis pour <strong>{projectType}</strong>.
            </Text>

            {services.length > 0 && (
              <>
                <Text style={paragraph}>
                  Services sélectionnés:
                </Text>
                <ul style={list}>
                  {services.map((service, index) => (
                    <li key={index} style={listItem}>{service}</li>
                  ))}
                </ul>
              </>
            )}

            <Text style={paragraph}>
              Notre équipe va analyser votre demande et vous recontacter dans les <strong>24 heures</strong> pour discuter de votre projet en détail.
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button
                style={button}
                href={`https://neeoky.com/suivi/${leadId}`}
              >
                Suivre ma demande
              </Button>
            </Section>

            <Text style={paragraph}>
              En attendant, n'hésitez pas à consulter{' '}
              <Link href="https://neeoky.com" style={link}>
                notre portfolio
              </Link>{' '}
              pour découvrir nos réalisations.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Neeoky - Créatif Digital Augmenté par l'IA
            </Text>
            <Text style={footerText}>
              <Link href="https://neeoky.com" style={footerLink}>
                neeoky.com
              </Link>
              {' • '}
              <Link href="mailto:contact@neeoky.com" style={footerLink}>
                contact@neeoky.com
              </Link>
            </Text>
            <Text style={footerSmall}>
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
  backgroundColor: '#0a0a0a',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '40px 40px 0',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 16px',
  padding: '0',
  lineHeight: '1.3',
};

const content = {
  padding: '0 40px',
};

const paragraph = {
  color: '#404040',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const list = {
  color: '#404040',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '8px 0',
  paddingLeft: '20px',
};

const listItem = {
  margin: '4px 0',
};

const buttonContainer = {
  padding: '24px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#a855f7',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
};

const link = {
  color: '#a855f7',
  textDecoration: 'underline',
};

const hr = {
  borderColor: '#e6e6e6',
  margin: '32px 0',
};

const footer = {
  padding: '0 40px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '4px 0',
};

const footerLink = {
  color: '#666666',
  textDecoration: 'underline',
};

const footerSmall = {
  color: '#999999',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '12px 0 0',
};

export default ConfirmationEmail;
