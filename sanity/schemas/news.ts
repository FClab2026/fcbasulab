import {defineField, defineType} from 'sanity'
import {richTextBody} from './richText'
import {seoFields, seoGroup} from './seoFields'

export default defineType({
  name: 'news',
  title: 'News & Announcement',
  type: 'document',
  groups: [{name: 'content', title: 'Content', default: true}, seoGroup],
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required(), group: 'content'}),
    defineField({
      name: 'body',
      title: 'Body',
      ...richTextBody,
      validation: (r) => r.required(),
      group: 'content',
    }),
    defineField({
      name: 'type',
      type: 'string',
      options: {
        list: [
          {title: 'Vacancy', value: 'Vacancy'},
          {title: 'Event', value: 'Event'},
        ],
      },
      initialValue: 'Event',
      validation: (r) => r.required(),
      group: 'content',
    }),
    ...seoFields,
  ],
  preview: {select: {title: 'title', subtitle: 'type'}},
})
