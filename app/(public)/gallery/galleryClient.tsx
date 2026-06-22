'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

import fetchGalleryAction from '@/lib/load_data/load_gallery'

interface GalleryItem {
    id: string
    title: string
    description: string
    imgUrl: string
    createdAt: Date | string
}

interface GalleryClientProps {
    initialGallery: GalleryItem[]
    hasMoreInitial: boolean
}

const PAGE_SIZE = 12

const getFullImageUrl = (url: string | null | undefined) => {
    if (!url) return ''
    if (url.startsWith('http') || url.startsWith('/')) return url
    const publicUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL
    return publicUrl
        ? `${publicUrl}/${url}`
        : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${url}`
}

// "d MMM''yy" -> the doubled '' is date-fns' escape for a literal
// apostrophe, giving e.g. "23 Feb'26"
const formatDate = (d: Date | string) => format(new Date(d), "d MMM''yy")

const GalleryClient = ({ initialGallery, hasMoreInitial }: GalleryClientProps) => {
    const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery)
    const [hasMore, setHasMore] = useState(hasMoreInitial)
    const [page, setPage] = useState(2)
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState<GalleryItem | null>(null)

    const sentinelRef = useRef<HTMLDivElement>(null)
    const loadingRef = useRef(false)

    const loadMore = useCallback(async () => {
        if (loadingRef.current || !hasMore) return
        loadingRef.current = true
        setLoading(true)
        try {
            const result = await fetchGalleryAction(page, PAGE_SIZE)
            if (result.success) {
                setGallery((prev) => {
                    const existingIds = new Set(prev.map((i) => i.id))
                    const next = result.data.filter((i: GalleryItem) => !existingIds.has(i.id))
                    return [...prev, ...next]
                })
                setHasMore(result.hasMore)
                setPage((p) => p + 1)
            }
        } catch (err) {
            console.error('Failed to load more gallery items:', err)
        } finally {
            loadingRef.current = false
            setLoading(false)
        }
    }, [page, hasMore])

    useEffect(() => {
        const el = sentinelRef.current
        if (!el) return
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) loadMore()
            },
            { rootMargin: '300px' }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [loadMore])

    useEffect(() => {
        if (!selected) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelected(null)
        }
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', onKey)
        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', onKey)
        }
    }, [selected])

    return (
        <div>
            {/* auto-fill + a capped track size keeps every card a fixed,
                compact width (between 230–270px) instead of stretching to
                fill a 1/3-of-the-container grid column. Cards wrap onto new
                rows as space allows, and a lone item no longer looks
                stranded in an oversized column. */}
            <ul
                role="list"
                className="grid grid-cols-[repeat(auto-fill,minmax(230px,270px))] gap-4 md:gap-5"
            >
                {gallery.map((item, index) => {
                    const imgUrl = getFullImageUrl(item.imgUrl)
                    if (!imgUrl) return null

                    return (
                        <motion.li
                            key={item.id}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{
                                duration: 0.45,
                                delay: Math.min((index % PAGE_SIZE) * 0.04, 0.3),
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="list-none"
                        >
                            <article
                                onClick={() => setSelected(item)}
                                className="group flex flex-col h-full bg-white border border-slate-200/70 rounded-sm overflow-hidden cursor-pointer transition-all duration-200 hover:border-slate-300 hover:shadow-[0_8px_24px_-8px_rgba(15,37,87,0.12)]"
                            >
                                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                                    <Image
                                        src={imgUrl}
                                        alt={item.title}
                                        fill
                                        loading={index < 3 ? 'eager' : 'lazy'}
                                        priority={index < 3}
                                        sizes="(max-width: 640px) 100vw, 270px"
                                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                    />
                                </div>

                                <div className="flex flex-col flex-1 p-3.5 md:p-4">
                                    <h2 className="font-serif text-base leading-snug text-slate-900 tracking-tight mb-1 group-hover:text-slate-700 transition-colors">
                                        {item.title}
                                    </h2>

                                    <div
                                        className="prose prose-sm max-w-none text-slate-600 leading-snug line-clamp-2 prose-p:my-0 prose-a:text-amber-700 prose-strong:text-slate-900 text-[13px]"
                                        dangerouslySetInnerHTML={{ __html: item.description }}
                                    />

                                    <time
                                        dateTime={new Date(item.createdAt).toISOString()}
                                        className="mt-auto pt-2 text-[10px] font-semibold tracking-[0.12em] uppercase text-amber-700"
                                    >
                                        {formatDate(item.createdAt)}
                                    </time>
                                </div>
                            </article>
                        </motion.li>
                    )
                })}
            </ul>

            <div
                ref={sentinelRef}
                className="h-12 mt-12 flex justify-center items-center"
                aria-hidden={!hasMore}
            >
                {loading && (
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading more…</span>
                    </div>
                )}
                {!hasMore && gallery.length > PAGE_SIZE && (
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                        End of gallery
                    </p>
                )}
            </div>

            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        role="dialog"
                        aria-modal="true"
                        aria-label={selected.title}
                        className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-md"
                        onClick={() => setSelected(null)}
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setSelected(null)
                            }}
                            aria-label="Close"
                            className="absolute top-5 right-5 md:top-8 md:right-8 z-10 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <X className="w-7 h-7" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.97, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.97, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            className="flex-1 flex flex-col items-center justify-center px-4 md:px-12 py-16 md:py-20 overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative w-full max-w-5xl h-[55vh] md:h-[65vh]">
                                <Image
                                    src={getFullImageUrl(selected.imgUrl)}
                                    alt={selected.title}
                                    fill
                                    priority
                                    className="object-contain"
                                    sizes="(max-width: 768px) 100vw, 80vw"
                                />
                            </div>
                            <div className="mt-8 text-center max-w-2xl px-4">
                                <h2 className="font-serif text-2xl md:text-3xl text-white tracking-tight mb-3">
                                    {selected.title}
                                </h2>
                                <div
                                    className="prose prose-sm md:prose-base prose-invert max-w-none text-slate-300 prose-a:text-amber-400"
                                    dangerouslySetInnerHTML={{ __html: selected.description }}
                                />
                                <time
                                    dateTime={new Date(selected.createdAt).toISOString()}
                                    className="block mt-6 text-xs uppercase tracking-[0.18em] text-slate-500"
                                >
                                    {formatDate(selected.createdAt)}
                                </time>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default GalleryClient