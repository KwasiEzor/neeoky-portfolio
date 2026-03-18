export default {
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Service Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'e.g. 80€ or 600€/mois'
    },
    {
      name: 'icon',
      title: 'Icon (Emoji)',
      type: 'string',
      description: 'e.g. 🎬 or 🤖'
    },
    {
      name: 'isPopular',
      title: 'Mark as Popular',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'ctaText',
      title: 'CTA Text',
      type: 'string',
      initialValue: 'Choisir cette offre'
    }
  ]
}
