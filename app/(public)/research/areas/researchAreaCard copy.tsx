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

            {/* Rectangular box. overflow-hidden creates a block formatting
                context so the floated image is contained inside the box,
                and the body text wraps around it in an L-shape: narrow
                alongside the image at the top, full width once it clears. */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100 p-6 md:p-8 overflow-hidden">
                {imgUrl ? (
                    <Image
                        src={imgUrl}
                        alt={item.name}
                        width={480}
                        height={360}
                        quality={80}
                        priority={index < 2}
                        className="float-right w-32 sm:w-48 md:w-64 lg:w-72 h-24 sm:h-36 md:h-48 lg:h-56 object-cover rounded-xl ml-5 mb-4 shadow-sm"
                    />
                ) : (
                    <div className="float-right w-32 sm:w-48 md:w-64 lg:w-72 h-24 sm:h-36 md:h-48 lg:h-56 flex items-center justify-center bg-slate-50 text-slate-400 text-xs sm:text-sm rounded-xl ml-5 mb-4 border border-dashed border-slate-200">
                        No Image Available
                    </div>
                )}

                <div
                    className="text-justify prose prose-slate prose-sm sm:prose-base max-w-none text-slate-600 leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                    dangerouslySetInnerHTML={{ __html: item.body }}
                />
            </div>
        </motion.div>
    )
}

export default ResearchAreaCard