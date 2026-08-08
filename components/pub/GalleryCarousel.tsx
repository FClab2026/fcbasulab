"use client"
import React from 'react'
import InfiniteCarousel from '@/components/pub/InfiniteCarousel';
import Image from 'next/image';
import { Reveal } from "@/components/pub/reveal";
import Link from 'next/link';
import { useEffect, useState } from 'react';

const GalleryCarousel = ({ galleryUrls }: { galleryUrls: string[] }) => {

    if (!galleryUrls || galleryUrls.length === 0) {
        return null;
    }

    const [imagesUrls, setImagesUrls] = useState<string[]>([])

    
    function getRandomImages(urls: string[], count: number) {
        if (count >= urls.length) return [...urls]

        const selected = new Set<number>()

        while (selected.size < count) {
            selected.add(Math.floor(Math.random() * urls.length))
        }

        return [...selected].map((i) => urls[i])
    }
    useEffect(() => {
        setImagesUrls(getRandomImages(galleryUrls, 5))

        const interval = setInterval(() => {
            setImagesUrls(getRandomImages(galleryUrls, 5))
        }, 60_000)

        return () => clearInterval(interval)
    }, [galleryUrls])


    return (
        <section className="section bg-slate-50 border-t border-slate-200/80">
            <div className="section-container">
                <Reveal>
                    <div className="section-header-row mb-10">
                        <div className="max-w-2xl">
                            <div className="section-label">OUR GALLERY</div>
                            <h2 className="section-heading">Moments That Define Our Journey</h2>
                        </div>
                        <Link href="/gallery" className="section-link self-end">
                            View all &rarr;
                        </Link>
                    </div>
                </Reveal>

                <div className="w-full overflow-hidden mt-10">
                    <InfiniteCarousel speed={30} gap={24}>
                        {imagesUrls.map((url) => (
                            <div className="w-95 h-112.5 overflow-hidden rounded-xl shrink-0">
                                <Image
                                    src={url}
                                    alt="Gallery"
                                    width={380}
                                    height={450}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </InfiniteCarousel>
                </div>
            </div>
        </section>
    )
}

export default GalleryCarousel
