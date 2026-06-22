'use server'

import { client as sanityClient } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { toHTML } from '@portabletext/to-html'
import type { PortableTextBlock } from '@portabletext/types'
import { PublicationCategory, ResearchStatus, ResearchProjectType } from '@/lib/enums'

export interface HomeStats {
  publications: number
  projects: number
  awards: number
  alumni: number
  groupMembers: number
  equipments: number
}

const HOME_STATS = groq`{
  "publications": count(*[_type == "publication"]),
  "projects": count(*[_type == "project"]),
  "awards": count(*[_type == "award"]),
  "alumni": count(*[_type == "alumni"]),
  "groupMembers": count(*[_type == "groupMember"]),
  "equipments": count(*[_type == "researchEquipment"])
}`

export async function fetchHomeStats(): Promise<HomeStats> {
  return sanityClient.fetch<HomeStats>(HOME_STATS)
}

export interface HomePublicationItem {
  id: string
  body: string
  category: PublicationCategory
  year: number | null
}

const LATEST_PUBLICATIONS = groq`
  *[_type == "publication"] | order(year desc, _createdAt desc)[0...$limit] {
    "id": _id, body, category, year
  }
`

const ptToHtml = (blocks: PortableTextBlock[] | null | undefined) =>
  blocks && blocks.length ? toHTML(blocks) : ''

export async function fetchLatestPublications(limit = 4): Promise<HomePublicationItem[]> {
  const rows = await sanityClient.fetch<
    { id: string; body: PortableTextBlock[] | null; category: PublicationCategory; year: number | null }[]
  >(LATEST_PUBLICATIONS, { limit })
  return rows.map((r) => ({
    id: r.id,
    body: ptToHtml(r.body),
    category: r.category,
    year: r.year,
  }))
}

export interface HomeProjectItem {
  id: string
  title: string
  description: string | null
  status: ResearchStatus
  type: ResearchProjectType
  duration: string | null
  completedOn: string | null
}

const LATEST_PROJECTS = groq`
  *[_type == "project"] | order(_createdAt desc)[0...$limit] {
    "id": _id, title, description, status, type, duration, completedOn
  }
`

export async function fetchLatestProjects(limit = 2): Promise<HomeProjectItem[]> {
  const rows = await sanityClient.fetch<
    {
      id: string
      title: string
      description: string | null
      status: ResearchStatus
      type: ResearchProjectType
      duration: string | null
      completedOn: string | null
    }[]
  >(LATEST_PROJECTS, { limit })
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    status: r.status,
    type: r.type,
    duration: r.duration,
    completedOn: r.completedOn,
  }))
}

export interface HomeEquipmentItem {
  id: string
  name: string
  body: string
  imgUrl: string | null
  createdAt: string
  updatedAt: string
}

const LATEST_EQUIPMENTS = groq`
  *[_type == "researchEquipment"] | order(_createdAt desc)[0...$limit] {
    "id": _id,
    name,
    body,
    image,
    "createdAt": _createdAt,
    "updatedAt": _updatedAt
  }
`

export async function fetchLatestEquipments(limit = 5): Promise<HomeEquipmentItem[]> {
  const rows = await sanityClient.fetch<
    {
      id: string
      name: string
      body: PortableTextBlock[] | null
      image: any
      createdAt: string
      updatedAt: string
    }[]
  >(LATEST_EQUIPMENTS, { limit })

  const { urlFor } = await import('@/sanity/lib/image')

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    body: ptToHtml(r.body),
    imgUrl: r.image ? urlFor(r.image).width(800).url() : null,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }))
}
