import { defineField, defineType } from 'sanity'
import { richTextBody } from './richText'
import { seoFields, seoGroup } from './seoFields'

export default defineType({
  name: 'news',
  title: 'News & Announcement',
  type: 'document',
  groups: [{ name: 'content', title: 'Content', default: true }, seoGroup],
  fields: [
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
          { title: 'Vacancy', value: 'Vacancy' },
          { title: 'Event', value: 'Event' },
        ],
      },
      initialValue: 'Event',
      validation: (r) => r.required(),
      group: 'content',
    }),
    ...seoFields,
  ],
  preview: {
    select: {
      body: 'body',
      type: 'type',
    },
    prepare({ body, type }) {
      const firstLine =
        body?.find((block: any) => block._type === 'block')
          ?.children
          ?.map((child: any) => child.text)
          .join(' ')
          .trim() || 'Untitled'

      const title = firstLine.split(/\s+/).slice(0, 5).join(' ')

      return {
        title: title + (firstLine.split(/\s+/).length > 5 ? '...' : ''),
        subtitle: type,
      }
    },
  },
})
