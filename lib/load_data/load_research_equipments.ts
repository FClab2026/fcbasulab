'use server'

import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { groq } from 'next-sanity'
import { toHTML } from '@portabletext/to-html'
import type { PortableTextBlock } from '@portabletext/types'
import type { SanityImageSource } from '@sanity/image-url'

const RESEARCH_EQUIPMENTS = groq`
  *[_type == "researchEquipment"] | order(rank asc, _createdAt desc) {
    "id": _id,
    name,
    body,
    image,
    "updatedAt": _updatedAt,
    "createdAt": _createdAt
  }
`

const ptToHtml = (blocks: PortableTextBlock[] | null | undefined) =>
  blocks && blocks.length ? toHTML(blocks) : ''

export default async function fetchResearchEquipments() {
  try {
    const rows = await client.fetch<
      {
        id: string
        name: string
        body: PortableTextBlock[]
        image: SanityImageSource | null
        updatedAt: string
        createdAt: string
      }[]
    >(RESEARCH_EQUIPMENTS)

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      body: ptToHtml(r.body),
      imgUrl: r.image ? urlFor(r.image).width(1200).url() : null,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }))
  } catch (error) {
    console.error('Error fetching researchEquipments:', error)
    if (process.env.NODE_ENV !== 'production') throw error
    return null
  }
}
