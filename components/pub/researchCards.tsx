"use client"
import { Fragment } from 'react'
import type { HomePublicationItem, HomeProjectItem } from '@/lib/load_data/load_home'
import { PublicationCategory } from '@/lib/enums'
import InfiniteCarousel from '@/components/pub/InfiniteCarousel'

interface ResearchCardProps {
  category: string
  heroTitle: string
  date: string
  source: string
  mainTitle: string
  description: string
}

export const ResearchCardItem = ({
  category = "PUBLICATION",
  heroTitle = "",
  date = "",
  source = "",
  mainTitle = "",
  description = ""
}: Partial<ResearchCardProps>) => {
  return (
    <div className="group/rescard relative flex flex-col bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-amber-700/30 transition-all duration-300 h-full w-full">
      {/* Thumbnail */}
      <div className="research-card-thumb">
        <div className="research-card-thumb-pattern" />
        <div className="research-card-thumb-gradient" />
        <div className="research-card-tag">{category}</div>
        <h3 className="research-card-thumb-title line-clamp-3">
          {source && heroTitle.includes(source) ? heroTitle.split(source).map((part, i) => (
            <Fragment key={i}>
              {part}
              {i === 0 && <span className="accent">{source}</span>}
            </Fragment>
          )) : heroTitle}
        </h3>
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-2 flex items-center gap-2">
            {date}{date && source ? <> <span className="w-1 h-1 rounded-full bg-slate-300" /> </> : null}{source}
          </p>
          <h4 className="text-base font-serif font-bold text-slate-950 mb-3 line-clamp-2 leading-snug group-hover/rescard:text-amber-700 transition-colors duration-200">{mainTitle}</h4>
        </div>
        <div>
          <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">{description}</p>
        </div>
      </div>
    </div>
  );
};

const PUB_LABEL: Record<PublicationCategory, string> = {
  JOURNAL: 'Journal Article',
  CONFERENCE: 'Conference',
  PATENTS: 'Patent',
  BOOK: 'Book Chapter',
  INVITED_TALK: 'Invited Talk',
  PRESENTATION: 'Presentation',
  NATIONAL_REPORT: 'National Report',
  PUBLICATION: 'Publication',
  OTHER: 'Other',
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s
  return s.slice(0, n - 1).trimEnd() + '…'
}

function publicationToCard(p: HomePublicationItem): Partial<ResearchCardProps> {
  const text = stripHtml(p.body)
  const split = text.indexOf('. ')
  const title = split > 20 && split < 140 ? text.slice(0, split + 1) : truncate(text, 110)
  const rest = split > 20 && split < 140 ? text.slice(split + 2) : ''
  const source = PUB_LABEL[p.category] ?? 'Publication'
  return {
    category: 'PUBLICATION',
    heroTitle: truncate(title, 90),
    date: p.year ? String(p.year) : 'Recent',
    source,
    mainTitle: truncate(title, 90),
    description: truncate(rest || text, 160),
  }
}

function projectToCard(p: HomeProjectItem): Partial<ResearchCardProps> {
  const source = p.type === 'FUNDED' ? 'Funded Project' : 'Project'
  const date = p.completedOn
    ? new Date(p.completedOn).getFullYear().toString()
    : p.duration ?? (p.status === 'ONGOING' ? 'Ongoing' : p.status === 'PLANNED' ? 'Planned' : 'Recent')
  return {
    category: 'PROJECT',
    heroTitle: truncate(p.title, 90),
    date,
    source,
    mainTitle: truncate(p.title, 90),
    description: truncate(stripHtml(p.description ?? ''), 160) || 'Research project at IIT Delhi.',
  }
}

interface ResearchCardsProps {
  publications?: HomePublicationItem[]
  projects?: HomeProjectItem[]
}

const ResearchCards = ({ publications = [], projects = [] }: ResearchCardsProps) => {
  const items: Partial<ResearchCardProps>[] = [
    ...publications.map(publicationToCard),
    ...projects.map(projectToCard),
  ].slice(0, 6)

  if (items.length === 0) {
    return (
      <div className="research-grid">
        <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--c-text-muted)', padding: '48px 0' }}>
          No research items to display yet. Check back soon.
        </p>
      </div>
    )
  }

  return (
    <InfiniteCarousel speed={40} gap={24}>
      {items.map((props, i) => (
        <div key={i} className="w-[340px] min-w-[340px] flex">
          <ResearchCardItem {...props} />
        </div>
      ))}
    </InfiniteCarousel>
  )
}

export default ResearchCards
