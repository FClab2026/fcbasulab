import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'equipment',
  title: 'Equipment',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'manufacturer', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'model', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'serialNumber', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'installedOn', type: 'datetime', validation: (r) => r.required()}),
    defineField({name: 'category', type: 'string', validation: (r) => r.required()}),
  ],
  preview: {
    select: {title: 'name', subtitle: 'manufacturer', category: 'category'},
    prepare({title, subtitle, category}) {
      return {title, subtitle: `${subtitle}${category ? ` · ${category}` : ''}`}
    },
  },
})
