import {revalidateTag} from 'next/cache'
import {parseBody} from 'next-sanity/webhook'
import {NextRequest, NextResponse} from 'next/server'

const TAG_BY_TYPE: Record<string, string[]> = {
  publication: ['publications'],
  project: ['projects'],
  researchArea: ['research-areas'],
  equipment: ['equipments'],
  groupMember: ['members'],
  award: ['awards'],
  alumni: ['alumni'],
  news: ['news'],
  galleryItem: ['gallery'],
}

type Body = {_type?: string; slug?: {current?: string}}

export async function POST(req: NextRequest) {
  try {
    const {isValidSignature, body} = await parseBody<Body>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    )
    if (!isValidSignature) {
      return NextResponse.json({message: 'Invalid signature'}, {status: 401})
    }
    if (!body?._type) {
      return NextResponse.json({message: 'Missing _type in webhook payload'}, {status: 400})
    }
    const tags = TAG_BY_TYPE[body._type] ?? []
    for (const tag of tags) revalidateTag(tag, 'max')
    return NextResponse.json({revalidated: tags, now: Date.now()})
  } catch (err) {
    console.error('revalidate webhook error', err)
    return NextResponse.json({message: (err as Error).message}, {status: 500})
  }
}
