export default {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    {
      name: 'author',
      title: 'Author Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'role',
      title: 'Author Role',
      type: 'string',
      description: 'e.g. Coach Fitness — Vidéo YouTube'
    },
    {
      name: 'text',
      title: 'Testimonial Text',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'avatar',
      title: 'Author Avatar',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0
    }
  ]
}
