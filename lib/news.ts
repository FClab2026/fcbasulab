'use server'

import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { toHTML } from '@portabletext/to-html'
import type { PortableTextBlock } from '@portabletext/types'
import { NewsAndAnnouncementsType } from './enums'

const NEWS_PAGE = groq`{
  "items": *[_type == "news" && (!defined($type) || type == $type)]
    | order(_createdAt desc)[$start...$end] {
    "id": _id,
    title,
    body,
    type,
    "updatedAt": _updatedAt,
    "createdAt": _createdAt
  },
  "total": count(*[_type == "news" && (!defined($type) || type == $type)])
}`

const ptToHtml = (blocks: PortableTextBlock[] | null | undefined) =>
  blocks && blocks.length ? toHTML(blocks) : ''

export async function fetchNewsAction({
  type,
  page = 1,
  pageSize = 10,
}: {
  type?: NewsAndAnnouncementsType
  page?: number
  pageSize?: number
}) {
  try {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const { items, total } = await client.fetch<{
      items: {
        id: string
        title: string
        body: PortableTextBlock[]
        type: NewsAndAnnouncementsType
        updatedAt: string
        createdAt: string
      }[]
      total: number
    }>(NEWS_PAGE, { start, end, type: type ?? null })

    const data = items.map((it) => ({
      id: it.id,
      title: it.title,
      body: ptToHtml(it.body),
      type: it.type,
      updatedAt: it.updatedAt,
      createdAt: it.createdAt,
    }))

    return {
      success: true,
      data,
      total,
      hasMore: total > start + data.length,
    }
  } catch (error) {
    console.error('Error fetching news:', error)
    if (process.env.NODE_ENV !== 'production') throw error
    return {
      success: false,
      data: [],
      total: 0,
      hasMore: false,
      error: 'Failed to fetch news',
    }
  }
}
