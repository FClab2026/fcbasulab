import {defineField, defineType} from 'sanity'
import {richTextBody} from './richText'
import {alumniCategories} from "@/lib/enums"


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
