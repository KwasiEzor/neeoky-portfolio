export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: Rule => Rule.required()
    },
    {
      name: 'tag',
      title: 'Tag',
      type: 'string',
      description: 'e.g. Montage Vidéo, Site Vitrine'
    },
    {
      name: 'category',
      title: 'Category Description',
      type: 'string',
      description: 'e.g. 🏋️ Coaching Fitness — Vidéo YouTube'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label (e.g. Livré en)' },
            { name: 'value', type: 'string', title: 'Value (e.g. 24h)' },
            { name: 'icon', type: 'string', title: 'Lucide Icon Name (e.g. clock)' }
          ]
        }
      ]
    },
    {
      name: 'gradient',
      title: 'Custom Gradient Colors',
      type: 'object',
      fields: [
        { name: 'from', type: 'string', title: 'From (Hex)', initialValue: '#a855f7' },
        { name: 'to', type: 'string', title: 'To (Hex)', initialValue: '#ec4899' }
      ]
    }
  ]
}
