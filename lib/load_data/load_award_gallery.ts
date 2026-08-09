'use server'

import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { groq } from 'next-sanity'
import type { SanityImageSource } from '@sanity/image-url'

const GALLERY_FEED = groq`{
  "items": *[_type == "awardGalleryItem"] | order(_createdAt desc)[$start...$end] {
    "id": _id,
    title,
    description,
    image,
    "createdAt": _createdAt
  },
  "total": count(*[_type == "awardGalleryItem"])
}`

export type AwardGalleryItem = {
  id: string
  imgUrl: string
  title: string | null
  description: string | null
  createdAt: string
}

export default async function fetchAwardGalleryAction(pageNumber: number, pageSize: number = 10) {
  try {
    const start = (pageNumber - 1) * pageSize
    const end = start + pageSize

    const { items, total } = await client.fetch<{
      items: {
        id: string
        title: string | null
        description: string | null
        image: SanityImageSource | null
        createdAt: string
      }[]
      total: number
    }>(GALLERY_FEED, { start, end })

    const data: AwardGalleryItem[] = items.map((it) => ({
      id: it.id,
      imgUrl: it.image ? urlFor(it.image).width(1600).url() : '',
      title: it.title ?? null,
      description: it.description ?? null,
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
      data: [] as AwardGalleryItem[],
      total: 0,
      hasMore: false,
      error: 'Failed to fetch gallery',
    }
  }
}