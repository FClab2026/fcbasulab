import {defineField, defineType} from 'sanity'
import {richTextBody} from './richText'



export const alumniCategories = [
  {title: 'Postdoc', value: 'POSTDOC'},
  {title: 'PhD', value: 'PHD'},
  {title: 'Masters', value: 'MASTERS'},
  {title: 'DualDegree', value: 'DUAL_DEGREE'},
  {title: 'Undergraduate', value: 'UNDERGRADUATE'},
  {title: 'Faculty', value: 'FACULTY'},
  {title: 'Other', value: 'OTHER'},
] as const

export type AlumniCategory = typeof alumniCategories[number]['value']

export default defineType({
  name: 'alumni',
  title: 'Alumni',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
    
    defineField({
      name: 'body',
      title: 'Body',
      ...richTextBody,
      validation: (r) => r.required(),
    }),
    defineField({
      name:'year',
      type:'number',
      validation: (r) => r.required(),
    }),
    defineField({
      name:'category',
      type:'string',
      options: {list: [...alumniCategories]},
      validation: (r) => r.required(),  

    })
  ],
  preview: {select: {title: 'name'}},
})
