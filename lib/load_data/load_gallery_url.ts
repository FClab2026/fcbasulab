'use server'

import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { groq } from 'next-sanity'
import type { SanityImageSource } from '@sanity/image-url'

const GALLERY_URLS = groq`
{
  "items": *[_type == "galleryItem"] | order(_createdAt desc) {
    image
  },
  "total": count(*[_type == "galleryItem"])
}
`
export default async function fetchGalleryUrls() {
  try {


    const { items, total } = await client.fetch<{
      items: {
        image: SanityImageSource | null
      }[]
      total: number
    }>(GALLERY_URLS)

    const data = items.map((it) => ({
      imgUrl: it.image ? urlFor(it.image).width(800).url() : ''
    }))

    return data.length > 0 ? data.map(item => item.imgUrl) : []
  } catch (error) {
    console.error('Error fetching gallery:', error)
    if (process.env.NODE_ENV !== 'production') throw error
    return []
  }
}
