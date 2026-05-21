import {defineField, defineType} from 'sanity'
import {richTextBody} from './richText'

export default defineType({
  name: 'award',
  title: 'Award',
  type: 'document',
  fields: [
    defineField({
      name: 'body',
      title: 'Body',
      ...richTextBody,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'type',
      type: 'string',
      options: {
        list: [
          {title: 'Group Leader', value: 'GROUP_LEADER'},
          {title: 'Group Member', value: 'GROUP_MEMBER'},
        ],
      },
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: {body: 'body', type: 'type'},
    prepare({body, type}) {
      const blocks = (body || []) as Array<{children?: Array<{text?: string}>}>
      const text = blocks
        .flatMap((b) => b.children?.map((c) => c.text) ?? [])
        .join(' ')
        .trim() || 'Untitled'
      return {title: text.slice(0, 80), subtitle: type}
    },
  },
})
