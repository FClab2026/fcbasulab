import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const getFullImageUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("/")) return url;
    const publicUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    return publicUrl ? `${publicUrl}/${url}` : `https://res.cloudinary.com/${cloudName}/image/upload/${url}`;
};

const ResearchAreaCard = ({ item, index }: { item: any, index: number }) => {
    const imgUrl = getFullImageUrl(item.imgUrl);

    return (
        <motion.div
            id={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-7xl mx-auto scroll-mt-24"
        >
            {/* Title sits above the box */}
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-5 tracking-tight">
                {item.name}
            </h2>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100 p-6 md:p-8 flex flex-col md:flex-row items-stretch gap-6 md:gap-10">
                <div
                    className="prose prose-slate prose-sm sm:prose-base max-w-none text-slate-600 leading-relaxed flex-1 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                    dangerouslySetInnerHTML={{ __html: item.body }}
                />

                {imgUrl ? (
                    <div className="relative w-full sm:w-70 md:w-80 lg:w-96 min-h-[220px] shrink-0 rounded-xl border border-slate-100 bg-slate-50 order-first md:order-last overflow-hidden">
                        <Image
                            src={imgUrl}
                            alt={item.name}
                            fill
                            quality={80}
                            priority={index < 2}
                            sizes="(max-width: 768px) 100vw, 320px"
                            className="object-contain p-4"
                        />
                    </div>
                ) : (
                    <div className="w-full sm:w-64 md:w-72 lg:w-80 min-h-[220px] shrink-0 flex items-center justify-center bg-slate-50 text-slate-400 text-xs sm:text-sm rounded-xl border border-dashed border-slate-200 order-first md:order-last">
                        No Image Available
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default ResearchAreaCard