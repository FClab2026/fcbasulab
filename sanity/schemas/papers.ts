import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'researchPaper',
  title: 'Research Paper',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string'}),
    defineField({
      name: 'image',
      description: 'Cover image for the research paper',
      type: 'image',
      options: {hotspot: true},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'pdf',
      description: 'File of the research paper',
      type: 'file',
      options: {accept:"application/pdf"},
      validation: (r) => r.required(),
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'description', media: 'image'}},
})
