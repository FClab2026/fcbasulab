import {defineField, defineType} from 'sanity'
import {richTextBody} from './richText'
import {seoFields, seoGroup} from './seoFields'

export default defineType({
  name: 'researchEquipment',
  title: 'Research Equipment',
  type: 'document',
  groups: [{name: 'content', title: 'Content', default: true}, seoGroup],
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required(), group: 'content'}),
    defineField({
      name: 'body',
      title: 'Body',
      ...richTextBody,
      validation: (r) => r.required(),
      group: 'content',
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {hotspot: true},
      group: 'content',
    }),
    ...seoFields,
  ],
  preview: {select: {title: 'name', media: 'image'}},
})

