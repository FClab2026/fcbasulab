'use server'

import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { toHTML } from '@portabletext/to-html'
import type { PortableTextBlock } from '@portabletext/types'
import { NewsAndAnnouncementsType } from '../enums'

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

export type NewsItem = {
  id: string
  title: string
  body: string
  type: NewsAndAnnouncementsType
  updatedAt: string
  createdAt: string
}

type NewsWithPortableText = Omit<NewsItem, 'body'> & {
  body: PortableTextBlock[]
}

export interface ResultsGroup {
  type: NewsAndAnnouncementsType
  items: NewsItem[]
  total: number
  hasMore: boolean
}


const serialize = (rows: NewsWithPortableText[]): NewsItem[] =>
  rows.map((r) => ({
    id: r.id,
    title: r.title,
    body: ptToHtml(r.body),
    type: r.type,
    updatedAt: r.updatedAt,
    createdAt: r.createdAt,

  }))


export async function fetchAllCategoriesInitial(pageSize: number = 10): Promise<ResultsGroup[]> {
  const categories = Object.values(NewsAndAnnouncementsType)
  const results = await Promise.all(
    categories.map(async (cat) => {
      const { items, total } = await fetchNewsAction({
        type: cat,
        page: 1,
        pageSize,
      })
      return {
        type: cat,
        items: serialize(items),
        total,
        hasMore: total > pageSize,
      } satisfies ResultsGroup
    }),
  )
  return results
}

export async function fetchNewsAction({
  type,
  page = 1,
  pageSize = 10,
}: {
  type: NewsAndAnnouncementsType
  page?: number
  pageSize?: number
}) {
  try {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const result = await client.fetch<{
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

    return {
      success: true,
      items: result.items,
      total: result.total,
      hasMore: result.total > end,
    }
  } catch (error) {
    console.error('Error fetching news:', error)
    if (process.env.NODE_ENV !== 'production') throw error
    return {
      success: false,
      items: [],
      total: 0,
      hasMore: false,
      error: 'Failed to fetch news',
    }
  }
}


export async function fetchNewsPageAction(
  type: NewsAndAnnouncementsType,
  page: number,
  pageSize: number = 5,
): Promise<{ success: boolean; items: NewsItem[]; total: number; hasMore: boolean }> {
  try {
    const { items, total } = await fetchNewsAction({ type, page, pageSize })
    return {
      success: true,
      items: serialize(items),
      total,
      hasMore: total > page * pageSize,
    }
  } catch (err) {
    console.error('Failed to fetch publications page:', err)
    if (process.env.NODE_ENV !== 'production') throw err
    return { success: false, items: [], total: 0, hasMore: false }
  }
}