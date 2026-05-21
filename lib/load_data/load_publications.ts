'use server'

import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { toHTML } from '@portabletext/to-html'
import type { PortableTextBlock } from '@portabletext/types'
import { PublicationCategory } from '@/lib/generated/prisma/enums'

export interface PublicationItem {
  id: string
  body: string
  category: PublicationCategory
  year: number | null
  createdAt: string
}

export interface CategoryGroup {
  category: PublicationCategory
  items: PublicationItem[]
  total: number
  hasMore: boolean
}

const PUBLICATIONS_BY_CATEGORY = groq`{
  "items": *[_type == "publication" && category == $category]
    | order(year desc, _createdAt desc)[$start...$end] {
    "id": _id,
    body,
    category,
    year,
    "createdAt": _createdAt
  },
  "total": count(*[_type == "publication" && category == $category])
}`

interface RawPublication {
  id: string
  body: PortableTextBlock[] | null
  category: PublicationCategory
  year: number | null
  createdAt: string
}

const ptToHtml = (blocks: PortableTextBlock[] | null | undefined) =>
  blocks && blocks.length ? toHTML(blocks) : ''

const serialize = (rows: RawPublication[]): PublicationItem[] =>
  rows.map((r) => ({
    id: r.id,
    body: ptToHtml(r.body),
    category: r.category,
    year: r.year,
    createdAt: r.createdAt,
  }))

async function fetchCategoryPage(category: PublicationCategory, page: number, pageSize: number) {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return client.fetch<{ items: RawPublication[]; total: number }>(
    PUBLICATIONS_BY_CATEGORY,
    { category, start, end },
  )
}

export async function fetchAllCategoriesInitial(pageSize: number = 10): Promise<CategoryGroup[]> {
  const categories = Object.values(PublicationCategory) as PublicationCategory[]
  const results = await Promise.all(
    categories.map(async (category) => {
      const { items, total } = await fetchCategoryPage(category, 1, pageSize)
      return {
        category,
        items: serialize(items),
        total,
        hasMore: total > pageSize,
      } satisfies CategoryGroup
    }),
  )
  return results
}

export async function fetchPublicationsPageAction(
  category: PublicationCategory,
  page: number,
  pageSize: number = 10,
): Promise<{ success: boolean; items: PublicationItem[]; total: number; hasMore: boolean }> {
  try {
    const { items, total } = await fetchCategoryPage(category, page, pageSize)
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
