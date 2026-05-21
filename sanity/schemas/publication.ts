import {defineField, defineType} from 'sanity'
import {richTextBody} from './richText'
import {seoFields, seoGroup} from './seoFields'

export const publicationCategories = [
  {title: 'Patents', value: 'PATENTS'},
  {title: 'Journal', value: 'JOURNAL'},
  {title: 'Conference', value: 'CONFERENCE'},
  {title: 'Presentation', value: 'PRESENTATION'},
  {title: 'National Report', value: 'NATIONAL_REPORT'},
  {title: 'Invited Talk', value: 'INVITED_TALK'},
  {title: 'Book', value: 'BOOK'},
  {title: 'Other', value: 'OTHER'},
  {title: 'Publication', value: 'PUBLICATION'},
] as const

export default defineType({
  name: 'publication',
  title: 'Publication',
  type: 'document',
  groups: [{name: 'content', title: 'Content', default: true}, seoGroup],
  fields: [
    defineField({
      name: 'body',
      title: 'Body',
      ...richTextBody,
      validation: (r) => r.required(),
      group: 'content',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {list: [...publicationCategories]},
      validation: (r) => r.required(),
      group: 'content',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (r) => r.integer().min(1900).max(2100),
      group: 'content',
    }),
    ...seoFields,
  ],
  orderings: [
    {title: 'Year (newest first)', name: 'yearDesc', by: [{field: 'year', direction: 'desc'}]},
    {title: 'Recently added', name: 'createdDesc', by: [{field: '_createdAt', direction: 'desc'}]},
  ],
  preview: {
    select: {body: 'body', category: 'category', year: 'year'},
    prepare({body, category, year}) {
      const blocks = (body || []) as Array<{children?: Array<{text?: string}>}>
      const text = blocks
        .flatMap((b) => b.children?.map((c) => c.text) ?? [])
        .join(' ')
        .trim() || 'Untitled'
      return {title: text.slice(0, 80), subtitle: `${category}${year ? ` · ${year}` : ''}`}
    },
  },
})
