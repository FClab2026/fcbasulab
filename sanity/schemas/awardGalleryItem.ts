import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'awardGalleryItem',
  title: 'Award Gallery Item',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      options: {hotspot: true},
      validation: (r) => r.required(),
    }),
  ],
  preview: {select: {media: 'image'}},
})
