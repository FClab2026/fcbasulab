import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'galleryItem',
  title: 'Gallery Item',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'description', type: 'text', rows: 3}),
    defineField({
      name: 'image',
      type: 'image',
      options: {hotspot: true},
      validation: (r) => r.required(),
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'description', media: 'image'}},
})
