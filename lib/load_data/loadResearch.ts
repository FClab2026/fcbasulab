'use server'

import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { ResearchStatus } from '@/lib/enums'

const PROJECTS_BY_STATUS = groq`{
  "items": *[_type == "project" && status == $status]
    | order(_createdAt desc)[$start...$end] {
    "id": _id,
    title,
    description,
    fundingAgencies,
    investigators,
    contributors,
    duration,
    status,
    type,
    amntFunded,
    completedOn,
    "createdAt": _createdAt,
    "updatedAt": _updatedAt
  },
  "total": count(*[_type == "project" && status == $status])
}`

export async function fetchResearchByStatus(
  pageNumber: number,
  status: ResearchStatus,
  pageSize: number = 20,
) {
  try {
    const start = (pageNumber - 1) * pageSize
    const end = start + pageSize

    const { items, total } = await client.fetch<{
      items: {
        id: string
        title: string
        description: string | null
        fundingAgencies: string | null
        investigators: string | null
        contributors: string | null
        duration: string | null
        status: ResearchStatus
        type: string | null
        amntFunded: string | null
        completedOn: string | null
        createdAt: string
        updatedAt: string
      }[]
      total: number
    }>(PROJECTS_BY_STATUS, { status, start, end })

    const data = items.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description ?? '',
      body: '',
      fundingAgencies: p.fundingAgencies,
      investigators: p.investigators,
      contributors: p.contributors,
      duration: p.duration,
      status: p.status,
      type: p.type,
      amntFunded: p.amntFunded,
      completedOn: p.completedOn,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }))

    return {
      success: true,
      data,
      totalCount: total,
      totalPages: Math.ceil(total / pageSize),
      hasMore: total > start + data.length,
    }
  } catch (error) {
    console.error('Error fetching research projects:', error)
    if (process.env.NODE_ENV !== 'production') throw error
    return {
      success: false,
      data: [],
      totalCount: 0,
      totalPages: 0,
      hasMore: false,
      error: 'Failed to fetch research projects',
    }
  }
}
