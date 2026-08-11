'use client'

import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import {
  fetchPublicationsPageAction,
  type PublicationItem,
} from '@/lib/load_data/load_publications'
import { AwardType } from '@/lib/enums'
import { fetchAwardsAction, type AwardItem } from "@/lib/load_data/loadAwards";


interface Props {
  category: AwardType
  displayName: string
  initialItems: AwardItem[]
  itemsTotal: number
  initialHasMore: boolean
  pageSize?: number
}

// Fixed height per row (px). Rows are clamped to 2 lines of text and given
// a matching min-height so every row — and therefore the whole card — is
// exactly the same height no matter how long an entry's body is or how
// many items are on the current page. This keeps sibling cards in the same
// grid row from resizing whenever this card's data changes.
const ROW_HEIGHT_PX = 64


const CategorySection = ({
  category,
  displayName,
  initialItems,
  itemsTotal,
  initialHasMore,
  pageSize = 5,
}: Props) => {
  const [items, setItems] = useState<AwardItem[]>(initialItems)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(itemsTotal)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef(false)

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const canGoPrev = page > 1 && !loading
  const canGoNext = hasMore && !loading

  const rangeStart = items.length === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = (page - 1) * pageSize + items.length

  const goToPage = useCallback(
    async (targetPage: number) => {
      if (loadingRef.current) return
      if (targetPage < 1 || targetPage > totalPages) return
      loadingRef.current = true
      setLoading(true)
      try {
        // console.log(`Fetching awards for category: ${category}, page: ${targetPage}, pageSize: ${pageSize}`);
        const result = await fetchAwardsAction({
          type: category,
          page: targetPage,
          pageSize,
        }
        )


        if (result.success && result.data) {
          setItems(result.data)
          setPage(targetPage)
          setTotal(result.total)
          setHasMore(result.hasMore)
        }
      } catch (err) {
        console.error(`Failed to load page ${targetPage} for ${category}:`, err)
      } finally {
        loadingRef.current = false
        setLoading(false)
      }
    },
    [category, pageSize, totalPages]
  )

  if (initialItems.length === 0) return null

  return (
    <section
      aria-labelledby={`publications-${category}`}
      className="bg-[#f8fafc] border border-slate-200/70 rounded-sm overflow-hidden"
    >
      {/* Box header — tightened */}
      <header className="flex items-end justify-between gap-6 px-6 md:px-7 pt-5 pb-3 border-b border-slate-200/70">
        <div>
          <div className="inline-flex items-center gap-2.5 mb-1">
            <span className="w-5 h-px bg-amber-700" aria-hidden="true" />
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-amber-700">
              Awards
            </span>
          </div>
          <h2
            id={`publications-${category}`}
            className="font-serif text-lg text-slate-900 tracking-tight leading-tight"
          >
            {displayName}
          </h2>
        </div>
        <div className="text-xs text-slate-400 whitespace-nowrap tabular-nums pb-0.5">
          {total.toLocaleString()} total
        </div>
      </header>

      {/* Timeline body — condensed rows, tighter rail. min-height reserves
          space for a full page of rows so the card never shrinks/grows
          between pages (which was resizing sibling cards in the grid). */}
      <div
        className="relative px-2 py-1"
        style={{ minHeight: pageSize * ROW_HEIGHT_PX }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.ol
            key={page}
            role="list"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {items.map((item, index) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  delay: Math.min(index * 0.02, 0.15),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative px-5 py-1 border-b border-slate-200 last:border-b-0"
                style={{ minHeight: ROW_HEIGHT_PX }}
              >

                <div className="flex items-start gap-1">

                  <span
                    className="shrink-0 w-4 text-slate-400 tabular-nums text-[11px] font-medium"
                  >{index + 1}.</span>


                  <article
                    className="
                        prose prose-sm max-w-none inline
                        text-[13px] text-slate-600 leading-snug
                        prose-p:inline prose-p:m-0 prose-p:text-[13px]
                        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-2
                        prose-strong:text-slate-900
                        prose-em:text-slate-900
                        text-justify
                      "
                    dangerouslySetInnerHTML={{ __html: item.body }}
                  />

                </div>

              </motion.li>
            ))}
          </motion.ol>
        </AnimatePresence>

        {/* Loading overlay (non-blocking) */}
        {loading && (
          <div className="absolute top-2 right-2 md:top-3 md:right-3 text-slate-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          </div>
        )}
      </div>

      {/* Footer: pager at bottom-right — tightened */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2.5 px-6 md:px-7 pb-4 pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500 tabular-nums mr-1">
            {rangeStart.toLocaleString()}–{rangeEnd.toLocaleString()} of{' '}
            {total.toLocaleString()}
          </span>
          <button
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={!canGoPrev}
            aria-label={`Previous page of ${displayName}`}
            className="inline-flex items-center justify-center w-7 h-7 border border-slate-300 text-slate-600 rounded-sm hover:border-slate-900 hover:text-slate-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-slate-300 disabled:hover:text-slate-600"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={!canGoNext}
            aria-label={`Next page of ${displayName}`}
            className="inline-flex items-center justify-center w-7 h-7 border border-slate-300 text-slate-600 rounded-sm hover:border-slate-900 hover:text-slate-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-slate-300 disabled:hover:text-slate-600"
          >
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>
      )}
    </section>
  )
}

export default CategorySection
