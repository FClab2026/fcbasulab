'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, ImageOff } from 'lucide-react'
import fetchAwardGalleryAction, {
  type AwardGalleryItem,
} from '@/lib/load_data/load_award_gallery'

interface Props {
  initialItems: AwardGalleryItem[]
  initialTotal: number
  initialHasMore: boolean
  pageSize?: number
  displayName?: string
  // Explicit pixel cap for the card's height. This is required — CSS
  // Grid's `items-stretch` only stretches items with an auto height to
  // match a sibling; it does NOT shrink a naturally-tall item like this
  // one down to match a shorter sibling. Without a real height set here,
  // `overflow-y-auto` below has nothing bounded to scroll against, so the
  // card just keeps growing with its content instead of scrolling.
  maxHeightPx?: number
}

const AwardGalleryTiles = ({
  initialItems,
  initialTotal,
  initialHasMore,
  pageSize = 10,
  displayName = 'Gallery',
  maxHeightPx = 720,
}: Props) => {
  const [items, setItems] = useState<AwardGalleryItem[]>(initialItems)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(initialTotal)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return
    loadingRef.current = true
    setLoading(true)
    try {
      const nextPage = page + 1
      const result = await fetchAwardGalleryAction(nextPage, pageSize)
      if (result.success) {
        setItems((prev) => [...prev, ...result.data])
        setPage(nextPage)
        setTotal(result.total)
        setHasMore(result.hasMore)
      } else {
        // stop retrying on repeated failure rather than hammering the action
        setHasMore(false)
      }
    } catch (err) {
      console.error('Failed to load more gallery items:', err)
      setHasMore(false)
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [page, pageSize, hasMore])

  // Fires loadMore when the sentinel scrolls into view *within this card's
  // own scroll container* (root: scrollRef), not the page viewport — that's
  // what makes the right column scroll and paginate independently of the
  // rest of the page.
  useEffect(() => {
    const sentinel = sentinelRef.current
    const root = scrollRef.current
    if (!sentinel || !root) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore()
        }
      },
      { root, rootMargin: '200px', threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  if (items.length === 0) return null

  return (
    <section
      className="bg-white border border-slate-200/70 rounded-sm overflow-hidden flex flex-col"
      style={{ maxHeight: `${maxHeightPx}px` }}
    >
      {/* Header — mirrors CategorySection's header treatment */}
      <header className="flex items-end justify-between gap-6 px-6 md:px-7 pt-5 pb-3 border-b border-slate-200/70 shrink-0">
        <div>
          <div className="inline-flex items-center gap-2.5 mb-1">
            <span className="w-5 h-px bg-amber-700" aria-hidden="true" />
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-amber-700">
              Gallery
            </span>
          </div>
          <h2 className="font-serif text-lg text-slate-900 tracking-tight leading-tight">
            {displayName}
          </h2>
        </div>
        {/* <div className="text-xs text-slate-400 whitespace-nowrap tabular-nums pb-0.5">
          {total.toLocaleString()} total
        </div> */}
      </header>

      {/* Scrollable masonry body. flex-1 + min-h-0 lets it shrink to fill
          the section's fixed height (set above) rather than growing to fit
          its content — that's what makes overflow-y-auto actually scroll. */}
      <div
        ref={scrollRef}
        className="relative flex-1 min-h-0 overflow-y-auto px-4 py-4"
      >
        <div className="columns-2 gap-3">
          {items.map((item, index) => (
            <motion.figure
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: Math.min((index % pageSize) * 0.02, 0.15),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative mb-3 break-inside-avoid overflow-hidden rounded-md bg-white ring-1 ring-slate-200/70"
            >
              {item.imgUrl ? (
                <img
                  src={item.imgUrl}
                  alt={item.title || ''}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
              ) : (
                <div className="flex items-center justify-center aspect-[4/5] text-slate-300">
                  <ImageOff className="w-6 h-6" strokeWidth={1.5} />
                </div>
              )}

              {/* Caption fades up from the bottom on hover; amber underline
                  ties it back to the section's accent color */}
              {(item.title || item.description) && (
                <figcaption
                  className="pointer-events-none absolute inset-x-0 bottom-0 p-3 pt-6
                             bg-gradient-to-t from-black/75 via-black/25 to-transparent
                             opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0
                             transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                >
                  {item.title && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-px bg-amber-400 shrink-0" aria-hidden="true" />
                      <span className="text-[12px] font-semibold text-white leading-snug line-clamp-1">
                        {item.title}
                      </span>
                    </div>
                  )}
                  {item.description && (
                    <div className="text-[11px] text-white/80 leading-snug line-clamp-2 mt-1">
                      {item.description}
                    </div>
                  )}
                </figcaption>
              )}
            </motion.figure>
          ))}
        </div>

        {/* Infinite-scroll sentinel */}
        <div ref={sentinelRef} className="h-1" aria-hidden="true" />

        {loading && (
          <div className="flex items-center justify-center gap-2 py-4 text-slate-400 text-xs">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Loading more
          </div>
        )}
        {!hasMore && (
          <div className="text-center text-[11px] text-slate-300 py-3 tracking-wide">
            End of gallery
          </div>
        )}
      </div>
    </section>
  )
}

export default AwardGalleryTiles