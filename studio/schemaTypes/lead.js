export default {
  name: 'lead',
  title: 'Demande Client',
  type: 'document',
  groups: [
    {
      name: 'selection',
      title: '📋 Sélection',
    },
    {
      name: 'project',
      title: '🎯 Projet',
    },
    {
      name: 'contact',
      title: '👤 Contact',
    },
    {
      name: 'tracking',
      title: '📊 Suivi',
    },
  ],
  fields: [
    // ========================================
    // SÉLECTION
    // ========================================
    {
      name: 'selectedServices',
      title: 'Services Sélectionnés',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
      group: 'selection',
      validation: (Rule) => Rule.required().min(1).error('Au moins un service doit être sélectionné'),
    },
    {
      name: 'selectedPack',
      title: 'Pack Choisi',
      type: 'string',
      options: {
        list: [
          { title: '🌱 Starter', value: 'starter' },
          { title: '💼 Pro', value: 'pro' },
          { title: '⭐ Premium', value: 'premium' },
          { title: '🎨 Sur mesure', value: 'custom' },
        ],
        layout: 'radio',
      },
      group: 'selection',
    },
    {
      name: 'customPackDetails',
      title: 'Détails Pack Sur Mesure',
      type: 'text',
      rows: 3,
      hidden: ({ parent }) => parent?.selectedPack !== 'custom',
      group: 'selection',
    },

    // ========================================
    // PROJET
    // ========================================
    {
      name: 'projectType',
      title: 'Type de Projet',
      type: 'string',
      options: {
        list: [
          { title: '🌐 Site vitrine', value: 'Site vitrine' },
          { title: '🛒 E-commerce', value: 'E-commerce' },
          { title: '💻 Application web', value: 'Application web' },
          { title: '📱 Mobile app', value: 'Mobile app' },
          { title: '🎨 Branding', value: 'Branding' },
          { title: '🎬 Vidéo', value: 'Vidéo' },
          { title: '📝 Autre', value: 'Autre' },
        ],
        layout: 'dropdown',
      },
      group: 'project',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'projectDescription',
      title: 'Description du Projet',
      type: 'text',
      rows: 5,
      group: 'project',
      validation: (Rule) =>
        Rule.required()
          .min(50)
          .max(1000)
          .error('La description doit contenir entre 50 et 1000 caractères'),
    },
    {
      name: 'budget',
      title: 'Budget Estimé',
      type: 'string',
      options: {
        list: [
          { title: '< 2 000€', value: '< 2 000€' },
          { title: '2 000€ - 5 000€', value: '2 000€ - 5 000€' },
          { title: '5 000€ - 10 000€', value: '5 000€ - 10 000€' },
          { title: '10 000€ - 20 000€', value: '10 000€ - 20 000€' },
          { title: '> 20 000€', value: '> 20 000€' },
        ],
        layout: 'dropdown',
      },
      group: 'project',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'timeline',
      title: 'Délai Souhaité',
      type: 'string',
      options: {
        list: [
          { title: '⚡ Urgent (< 1 mois)', value: 'Urgent (< 1 mois)' },
          { title: '📅 1-2 mois', value: '1-2 mois' },
          { title: '🗓️ 2-3 mois', value: '2-3 mois' },
          { title: '⏰ > 3 mois', value: '> 3 mois' },
          { title: '🤷 Flexible', value: 'Flexible' },
        ],
        layout: 'dropdown',
      },
      group: 'project',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'attachments',
      title: 'Fichiers Joints',
      type: 'array',
      of: [{ type: 'file' }],
      options: {
        accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp',
      },
      group: 'project',
    },

    // ========================================
    // CONTACT
    // ========================================
    {
      name: 'firstName',
      title: 'Prénom',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(50),
      group: 'contact',
    },
    {
      name: 'lastName',
      title: 'Nom',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(50),
      group: 'contact',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
      group: 'contact',
    },
    {
      name: 'phone',
      title: 'Téléphone',
      type: 'string',
      group: 'contact',
    },
    {
      name: 'company',
      title: 'Entreprise',
      type: 'string',
      group: 'contact',
    },
    {
      name: 'gdprConsent',
      title: 'Consentement RGPD',
      type: 'boolean',
      description: 'Le client a accepté la politique de confidentialité',
      initialValue: true,
      validation: (Rule) => Rule.required(),
      group: 'contact',
    },

    // ========================================
    // TRACKING & ADMIN
    // ========================================
    {
      name: 'status',
      title: 'Statut',
      type: 'string',
      options: {
        list: [
          { title: '🆕 Nouveau', value: 'new' },
          { title: '👀 En cours', value: 'in_progress' },
          { title: '📞 Contacté', value: 'contacted' },
          { title: '💰 Devis envoyé', value: 'quoted' },
          { title: '✅ Converti', value: 'converted' },
          { title: '❌ Archivé', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
      group: 'tracking',
    },
    {
      name: 'priority',
      title: 'Priorité',
      type: 'string',
      options: {
        list: [
          { title: '🔴 Haute', value: 'high' },
          { title: '🟡 Moyenne', value: 'medium' },
          { title: '🟢 Basse', value: 'low' },
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
      group: 'tracking',
    },
    {
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Page ou campagne d\'origine',
      group: 'tracking',
      readOnly: true,
    },
    {
      name: 'sessionId',
      title: 'Session ID',
      type: 'string',
      description: 'Identifiant unique de session',
      group: 'tracking',
      readOnly: true,
    },
    {
      name: 'utmParams',
      title: 'Paramètres UTM',
      type: 'object',
      fields: [
        {
          name: 'source',
          type: 'string',
          title: 'UTM Source',
        },
        {
          name: 'medium',
          type: 'string',
          title: 'UTM Medium',
        },
        {
          name: 'campaign',
          type: 'string',
          title: 'UTM Campaign',
        },
        {
          name: 'term',
          type: 'string',
          title: 'UTM Term',
        },
        {
          name: 'content',
          type: 'string',
          title: 'UTM Content',
        },
      ],
      group: 'tracking',
      readOnly: true,
    },
    {
      name: 'notes',
      title: 'Notes Internes',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Notes pour le suivi interne',
      group: 'tracking',
    },
    {
      name: 'assignedTo',
      title: 'Assigné à',
      type: 'string',
      description: 'Membre de l\'équipe en charge',
      group: 'tracking',
    },
    {
      name: 'estimatedValue',
      title: 'Valeur Estimée (€)',
      type: 'number',
      description: 'Valeur commerciale potentielle',
      group: 'tracking',
    },
    {
      name: 'convertedAt',
      title: 'Date de Conversion',
      type: 'datetime',
      description: 'Date de conversion en client',
      group: 'tracking',
    },
  ],

  // ========================================
  // PREVIEW
  // ========================================
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      status: 'status',
      createdAt: '_createdAt',
      projectType: 'projectType',
    },
    prepare({ firstName, lastName, email, status, projectType }) {
      const statusEmoji = {
        new: '🆕',
        in_progress: '👀',
        contacted: '📞',
        quoted: '💰',
        converted: '✅',
        archived: '❌',
      }[status] || '📋';

      return {
        title: `${firstName} ${lastName}`,
        subtitle: `${statusEmoji} ${projectType || 'N/A'} • ${email}`,
      };
    },
  },

  // ========================================
  // ORDERING
  // ========================================
  orderings: [
    {
      title: 'Date (récent)',
      name: 'createdAtDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
    {
      title: 'Date (ancien)',
      name: 'createdAtAsc',
      by: [{ field: '_createdAt', direction: 'asc' }],
    },
    {
      title: 'Statut',
      name: 'statusAsc',
      by: [{ field: 'status', direction: 'asc' }],
    },
    {
      title: 'Priorité',
      name: 'priorityDesc',
      by: [{ field: 'priority', direction: 'desc' }],
    },
  ],
};
