import {defineField, defineType} from 'sanity'
import {seoFields, seoGroup} from './seoFields'

export default defineType({
  name: 'project',
  title: 'Research Project',
  type: 'document',
  groups: [{name: 'content', title: 'Content', default: true}, seoGroup],
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required(), group: 'content'}),
    defineField({name: 'description', type: 'text', rows: 4, group: 'content'}),
    defineField({name: 'fundingAgencies', type: 'string', group: 'content'}),
    defineField({name: 'investigators', type: 'string', group: 'content'}),
    defineField({name: 'contributors', type: 'string', group: 'content'}),
    defineField({name: 'duration', type: 'string', group: 'content'}),
    defineField({
      name: 'status',
      type: 'string',
      options: {
        list: [
          {title: 'Ongoing', value: 'ONGOING'},
          {title: 'Completed', value: 'COMPLETED'},
          {title: 'Planned', value: 'PLANNED'},
        ],
      },
      initialValue: 'PLANNED',
      validation: (r) => r.required(),
      group: 'content',
    }),
    defineField({
      name: 'type',
      type: 'string',
      options: {
        list: [
          {title: 'Funded', value: 'FUNDED'},
          {title: 'Non-funded', value: 'NON_FUNDED'},
        ],
      },
      initialValue: 'NON_FUNDED',
      validation: (r) => r.required(),
      group: 'content',
    }),
    defineField({name: 'amntFunded', title: 'Amount funded', type: 'string', group: 'content'}),
    defineField({name: 'completedOn', type: 'datetime', group: 'content'}),
    ...seoFields,
  ],
  preview: {
    select: {title: 'title', subtitle: 'status'},
  },
})
