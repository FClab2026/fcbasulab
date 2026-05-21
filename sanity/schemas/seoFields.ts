import {defineField} from 'sanity'

export const seoFields = [
  defineField({
    name: 'seoTitle',
    title: 'SEO title',
    type: 'string',
    description: 'Overrides default page title. Keep under 60 characters.',
    group: 'seo',
  }),
  defineField({
    name: 'seoDescription',
    title: 'SEO description',
    type: 'text',
    rows: 3,
    description: 'Meta description for search engines. Keep under 160 characters.',
    group: 'seo',
  }),
  defineField({
    name: 'ogImage',
    title: 'Social share image',
    type: 'image',
    description: 'Image shown when this page is shared on social media.',
    options: {hotspot: true},
    group: 'seo',
  }),
]

export const seoGroup = {name: 'seo', title: 'SEO'}
