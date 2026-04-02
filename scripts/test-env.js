#!/usr/bin/env node

/**
 * Script de test des variables d'environnement
 * Usage: node scripts/test-env.js
 */

import 'dotenv/config';
import { createClient } from '@sanity/client';

console.log('🔍 Vérification de la configuration...\n');

const results = {
  success: [],
  warnings: [],
  errors: [],
};

// ========================================
// 1. SANITY CMS
// ========================================
console.log('1️⃣ Sanity CMS');
const sanityVars = {
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: process.env.SANITY_API_VERSION,
  token: process.env.SANITY_API_TOKEN,
};

if (sanityVars.projectId && sanityVars.dataset && sanityVars.apiVersion) {
  results.success.push('✅ Sanity: Configuration de base OK');

  if (sanityVars.token) {
    // Test connexion Sanity
    try {
      const client = createClient({
        projectId: sanityVars.projectId,
        dataset: sanityVars.dataset,
        apiVersion: sanityVars.apiVersion,
        token: sanityVars.token,
        useCdn: false,
      });

      // Test query
      const count = await client.fetch('count(*[_type == "lead"])');
      results.success.push(`✅ Sanity: Connexion OK (${count} leads dans la base)`);
    } catch (error) {
      results.errors.push('❌ Sanity: Erreur de connexion - ' + error.message);
    }
  } else {
    results.errors.push('❌ SANITY_API_TOKEN manquant (CRITIQUE!)');
    results.warnings.push('⚠️  Sans SANITY_API_TOKEN, vous ne pourrez pas créer de leads');
  }
} else {
  results.errors.push('❌ Sanity: Variables de base manquantes');
}

// ========================================
// 2. RESEND (EMAIL)
// ========================================
console.log('\n2️⃣ Resend (Email)');
const resendKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.FROM_EMAIL;
const adminEmail = process.env.ADMIN_EMAIL;

if (resendKey) {
  results.success.push('✅ Resend: API Key configurée');

  // Note: On ne teste pas la connexion pour éviter d'envoyer des emails
  if (!fromEmail) {
    results.warnings.push('⚠️  FROM_EMAIL non configuré (recommandé)');
  }
  if (!adminEmail) {
    results.warnings.push('⚠️  ADMIN_EMAIL non configuré (recommandé)');
  }
} else {
  results.warnings.push('⚠️  Resend non configuré - Les emails ne seront pas envoyés');
}

// ========================================
// 3. UPSTASH REDIS (RATE LIMITING)
// ========================================
console.log('\n3️⃣ Upstash Redis (Rate Limiting)');
const upstashUrl = process.env.UPSTASH_REDIS_REST_URL?.replace(/['"]/g, '');
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN?.replace(/['"]/g, '');

if (upstashUrl && upstashToken) {
  results.success.push('✅ Upstash: Configuration OK');

  // Test connexion Redis
  try {
    const response = await fetch(`${upstashUrl}/get/test`, {
      headers: {
        Authorization: `Bearer ${upstashToken}`,
      },
    });

    if (response.ok) {
      results.success.push('✅ Upstash: Connexion OK');
    } else {
      results.warnings.push('⚠️  Upstash: Connexion échouée - Vérifiez les credentials');
    }
  } catch (error) {
    results.warnings.push('⚠️  Upstash: Erreur de test - ' + error.message);
  }
} else {
  results.warnings.push('⚠️  Upstash non configuré - Rate limiting désactivé');
}

// ========================================
// 4. CLOUDFLARE TURNSTILE
// ========================================
console.log('\n4️⃣ Cloudflare Turnstile (Anti-spam)');
const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
const turnstileSiteKey = process.env.PUBLIC_TURNSTILE_SITE_KEY;

if (turnstileSecret && turnstileSiteKey) {
  results.success.push('✅ Turnstile: Configuration OK');
} else {
  results.warnings.push('⚠️  Turnstile non configuré - Protection anti-spam basique uniquement');
}

// ========================================
// 5. PLAUSIBLE (ANALYTICS)
// ========================================
console.log('\n5️⃣ Plausible (Analytics)');
const plausibleDomain = process.env.PUBLIC_PLAUSIBLE_DOMAIN;

if (plausibleDomain) {
  results.success.push('✅ Plausible: Configuration OK');
} else {
  results.warnings.push('⚠️  Plausible non configuré - Analytics désactivées');
}

// ========================================
// RÉSULTATS
// ========================================
console.log('\n' + '='.repeat(50));
console.log('📊 RÉSULTATS DU TEST\n');

if (results.success.length > 0) {
  console.log('✅ SUCCÈS:');
  results.success.forEach(msg => console.log('  ' + msg));
  console.log('');
}

if (results.warnings.length > 0) {
  console.log('⚠️  AVERTISSEMENTS:');
  results.warnings.forEach(msg => console.log('  ' + msg));
  console.log('');
}

if (results.errors.length > 0) {
  console.log('❌ ERREURS:');
  results.errors.forEach(msg => console.log('  ' + msg));
  console.log('');
}

console.log('='.repeat(50));

// Score
const total = results.success.length + results.warnings.length + results.errors.length;
const score = Math.round((results.success.length / total) * 100);

console.log(`\n🎯 Score: ${score}% (${results.success.length}/${total})`);

if (results.errors.length > 0) {
  console.log('\n⚠️  Certaines fonctionnalités ne fonctionneront pas correctement.');
  console.log('Consultez IMPLEMENTATION_GUIDE.md pour configurer les services manquants.\n');
  process.exit(1);
} else if (results.warnings.length > 0) {
  console.log('\n✅ Configuration minimale OK!');
  console.log('💡 Configurez les services optionnels pour une expérience complète.\n');
  process.exit(0);
} else {
  console.log('\n🎉 Configuration parfaite! Tous les services sont opérationnels.\n');
  process.exit(0);
}
