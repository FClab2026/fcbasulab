'use server'

import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { groq } from 'next-sanity'
import type { SanityImageSource } from '@sanity/image-url'

const GALLERY_FEED = groq`{
  "items": *[_type == "galleryItem"] | order(_createdAt desc)[$start...$end] {
    "id": _id,
    title,
    description,
    image,
    "createdAt": _createdAt
  },
  "total": count(*[_type == "galleryItem"])
}`

export default async function fetchGalleryAction(pageNumber: number, pageSize: number = 20) {
  try {
    const start = (pageNumber - 1) * pageSize
    const end = start + pageSize

    const { items, total } = await client.fetch<{
      items: {
        id: string
        title: string
        description: string
        image: SanityImageSource | null
        createdAt: string
      }[]
      total: number
    }>(GALLERY_FEED, { start, end })

    const data = items.map((it) => ({
      id: it.id,
      title: it.title,
      description: it.description,
      imgUrl: it.image ? urlFor(it.image).width(1600).url() : '',
      createdAt: it.createdAt,
    }))

    return {
      success: true,
      data,
      total,
      hasMore: total > start + data.length,
    }
  } catch (error) {
    console.error('Error fetching gallery:', error)
    if (process.env.NODE_ENV !== 'production') throw error
    return {
      success: false,
      data: [],
      total: 0,
      hasMore: false,
      error: 'Failed to fetch gallery',
    }
  }
}
