import {defineField, defineType} from 'sanity'
import {seoFields, seoGroup} from './seoFields'

export const groupCategories = [
  {title: 'Leader', value: 'LEADER'},
  {title: 'Postdoc', value: 'POSTDOC'},
  {title: 'PhD', value: 'PHD'},
  {title: 'Masters', value: 'MASTERS'},
  {title: 'Undergraduate', value: 'UNDERGRADUATE'},
  {title: 'Faculty', value: 'FACULTY'},
  {title: 'Faculty Fellow', value: 'FACULTY_FELLOW'},
  {title: 'Alumni', value: 'ALUMNI'},
  {title: 'Staff', value: 'STAFF'},
  {title: 'Research Scholar', value: 'RESEARCH_SCHOLAR'},
  {title: 'Collaborator', value: 'COLLABORATOR'},
  {title: 'Other', value: 'OTHER'},
] as const

export default defineType({
  name: 'groupMember',
  title: 'Group Member',
  type: 'document',
  groups: [{name: 'content', title: 'Content', default: true}, seoGroup],
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required(), group: 'content'}),
    defineField({
      name: 'email',
      type: 'string',
      validation: (r) => r.required().email(),
      group: 'content',
    }),
    defineField({name: 'researchAreas', type: 'text', rows: 2, group: 'content'}),
    defineField({name: 'designation', type: 'string', group: 'content'}),
    defineField({
      name: 'category',
      type: 'string',
      options: {list: [...groupCategories]},
      validation: (r) => r.required(),
      group: 'content',
    }),
    defineField({
      name: 'profileImage',
      type: 'image',
      options: {hotspot: true},
      group: 'content',
    }),
    defineField({name: 'profileLink', type: 'url', group: 'content'}),
    defineField({name: 'phoneNumber', type: 'string', group: 'content'}),
    ...seoFields,
  ],
  preview: {
    select: {title: 'name', subtitle: 'designation', media: 'profileImage'},
  },
})
