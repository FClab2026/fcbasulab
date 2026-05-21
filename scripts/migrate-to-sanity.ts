/**
 * Prisma -> Sanity one-shot migration.
 *
 * Usage:
 *   1. Ensure DATABASE_URL points at the live Postgres
 *   2. Set NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET,
 *      SANITY_API_WRITE_TOKEN, NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local
 *   3. Run a single type:   npx tsx scripts/migrate-to-sanity.ts alumni
 *      Run all types:       npx tsx scripts/migrate-to-sanity.ts all
 *
 * Idempotent: each Sanity doc uses a deterministic _id derived from the Prisma id,
 * so re-running replaces in place rather than duplicating.
 */

import 'dotenv/config'
import {createClient} from '@sanity/client'
import {htmlToBlocks} from '@sanity/block-tools'
import {Schema} from '@sanity/schema'
import {JSDOM} from 'jsdom'
import {PrismaPg} from '@prisma/adapter-pg'
import {PrismaClient} from '../lib/generated/prisma/client'

// Build a minimal Sanity schema instance just so block-tools knows the block
// type's allowed styles/marks. Keep this in sync with sanity/schemas/richText.ts.
const blockContentSchema = Schema.compile({
  name: 'default',
  types: [
    {
      name: 'blockContent',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Underline', value: 'underline'},
              {title: 'Strike', value: 'strike-through'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                fields: [
                  {name: 'href', type: 'url'},
                  {name: 'blank', type: 'boolean'},
                ],
              },
            ],
          },
        },
      ],
    },
  ],
})

const blockContentType = blockContentSchema.get('blockContent')

function htmlToPortableText(html: string | null | undefined) {
  if (!html || !html.trim()) return []
  return htmlToBlocks(html, blockContentType, {
    parseHtml: (h) => new JSDOM(h).window.document,
  })
}

const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL!})
const prisma = new PrismaClient({adapter})

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
})

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

function cloudinaryUrl(stored: string | null | undefined): string | null {
  if (!stored) return null
  if (stored.startsWith('http')) return stored
  if (!CLOUD) throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not set')
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${stored}`
}

const assetCache = new Map<string, string>()

async function uploadImage(url: string | null): Promise<{_type: 'image'; asset: {_ref: string}} | null> {
  if (!url) return null
  if (assetCache.has(url)) {
    return {_type: 'image', asset: {_ref: assetCache.get(url)!}}
  }
  const res = await fetch(url)
  if (!res.ok) {
    console.warn(`  ! failed to fetch image ${url}: ${res.status}`)
    return null
  }
  const buf = Buffer.from(await res.arrayBuffer())
  const filename = url.split('/').pop() || 'image'
  const asset = await sanity.assets.upload('image', buf, {filename})
  assetCache.set(url, asset._id)
  return {_type: 'image', asset: {_ref: asset._id}}
}

const docId = (prefix: string, prismaId: string) => `${prefix}-${prismaId}`

async function migrateAlumni() {
  const rows = await prisma.alumni.findMany()
  console.log(`Alumni: ${rows.length}`)
  const tx = sanity.transaction()
  for (const r of rows) {
    tx.createOrReplace({
      _id: docId('alumni', r.id),
      _type: 'alumni',
      name: r.name,
      body: htmlToPortableText(r.body),
    })
  }
  await tx.commit()
}

async function migrateAwards() {
  const rows = await prisma.awards.findMany()
  console.log(`Awards: ${rows.length}`)
  const tx = sanity.transaction()
  for (const r of rows) {
    tx.createOrReplace({
      _id: docId('award', r.id),
      _type: 'award',
      body: htmlToPortableText(r.body),
      type: r.type,
    })
  }
  await tx.commit()
}

async function migrateNews() {
  const rows = await prisma.newsAndAnnouncements.findMany()
  console.log(`News: ${rows.length}`)
  const tx = sanity.transaction()
  for (const r of rows) {
    tx.createOrReplace({
      _id: docId('news', r.id),
      _type: 'news',
      title: r.title,
      body: htmlToPortableText(r.body),
      type: r.type,
    })
  }
  await tx.commit()
}

async function migrateEquipments() {
  const rows = await prisma.equipments.findMany()
  console.log(`Equipments: ${rows.length}`)
  const tx = sanity.transaction()
  for (const r of rows) {
    tx.createOrReplace({
      _id: docId('equipment', r.id),
      _type: 'equipment',
      name: r.name,
      manufacturer: r.manufacturer,
      model: r.model,
      serialNumber: r.serialNumber,
      installedOn: r.installedOn.toISOString(),
      category: r.category,
    })
  }
  await tx.commit()
}

async function migrateResearchAreas() {
  const rows = await prisma.researchAreas.findMany()
  console.log(`Research Areas: ${rows.length}`)
  for (const r of rows) {
    const image = await uploadImage(cloudinaryUrl(r.imgUrl))
    await sanity.createOrReplace({
      _id: docId('researchArea', r.id),
      _type: 'researchArea',
      name: r.name,
      body: htmlToPortableText(r.body),
      ...(image ? {image} : {}),
    })
  }
}

async function migrateGallery() {
  const rows = await prisma.gallery.findMany()
  console.log(`Gallery: ${rows.length}`)
  for (const r of rows) {
    const image = await uploadImage(cloudinaryUrl(r.imgUrl))
    if (!image) {
      console.warn(`  ! skipping gallery ${r.id} — image upload failed`)
      continue
    }
    await sanity.createOrReplace({
      _id: docId('galleryItem', r.id),
      _type: 'galleryItem',
      title: r.title,
      description: r.description,
      image,
    })
  }
}

async function migratePublications() {
  const rows = await prisma.publications.findMany()
  console.log(`Publications: ${rows.length}`)
  // Batch in chunks of 50 — Sanity transaction size limit
  for (let i = 0; i < rows.length; i += 50) {
    const tx = sanity.transaction()
    for (const r of rows.slice(i, i + 50)) {
      tx.createOrReplace({
        _id: docId('publication', r.id),
        _type: 'publication',
        body: htmlToPortableText(r.body),
        category: r.category,
        year: r.year ?? undefined,
      })
    }
    await tx.commit()
    console.log(`  publications batch ${i / 50 + 1} done`)
  }
}

async function migrateProjects() {
  const rows = await prisma.researchProjects.findMany()
  console.log(`Projects: ${rows.length}`)
  const tx = sanity.transaction()
  for (const r of rows) {
    tx.createOrReplace({
      _id: docId('project', r.id),
      _type: 'project',
      title: r.title,
      description: r.description ?? undefined,
      fundingAgencies: r.fundingAgencies ?? undefined,
      investigators: r.investigators ?? undefined,
      contributors: r.contributors ?? undefined,
      duration: r.duration ?? undefined,
      status: r.status,
      type: r.type,
      amntFunded: r.amntFunded ?? undefined,
      completedOn: r.completedOn?.toISOString(),
    })
  }
  await tx.commit()
}

async function migrateGroupMembers() {
  const rows = await prisma.groupMembers.findMany()
  console.log(`Group Members: ${rows.length}`)
  for (const r of rows) {
    const profileImage = await uploadImage(cloudinaryUrl(r.profileImgUrl))
    await sanity.createOrReplace({
      _id: docId('groupMember', r.id),
      _type: 'groupMember',
      name: r.name,
      email: r.email,
      researchAreas: r.researchAreas ?? undefined,
      designation: r.designation ?? undefined,
      category: r.category,
      ...(profileImage ? {profileImage} : {}),
      profileLink: r.profileLink ?? undefined,
      phoneNumber: r.phoneNumber ?? undefined,
    })
  }
}

const tasks: Record<string, () => Promise<void>> = {
  alumni: migrateAlumni,
  awards: migrateAwards,
  news: migrateNews,
  equipments: migrateEquipments,
  researchAreas: migrateResearchAreas,
  gallery: migrateGallery,
  publications: migratePublications,
  projects: migrateProjects,
  groupMembers: migrateGroupMembers,
}

async function main() {
  const arg = process.argv[2]
  if (!arg) {
    console.error('Usage: tsx scripts/migrate-to-sanity.ts <type|all>')
    console.error(`Types: ${Object.keys(tasks).join(', ')}, all`)
    process.exit(1)
  }
  const toRun = arg === 'all' ? Object.keys(tasks) : [arg]
  for (const name of toRun) {
    const fn = tasks[name]
    if (!fn) {
      console.error(`Unknown type: ${name}`)
      process.exit(1)
    }
    console.log(`\n=== ${name} ===`)
    await fn()
  }
  console.log('\nDone.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
