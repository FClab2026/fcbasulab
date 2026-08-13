import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { getFullImageUrl } from '@/lib/getFullImageUrl'


const ResearchAreaCard = ({ item, index }: { item: any; index: number }) => {
  const imgUrl = getFullImageUrl(item.imgUrl);

  return (
    <motion.div
      id={item.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="w-full h-[805px] mx-auto scroll-mt-24" // fixed, uniform card height
    >
      <div className="h-full flex flex-col rounded-2xl border border-slate-200 bg-[#f8fafc]  shadow-sm shadow-slate-100 p-6 md:p-8 gap-4">

        {/* Image: fixed height so every card matches */}
        {imgUrl ? (
          <div className="relative w-full h-[270px] shrink-0 rounded-xl border border-slate-100 bg-white overflow-hidden">
            <Image
              src={imgUrl}
              alt={item.name}
              fill
              priority={index < 2}
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-contain"
            />
          </div>
        ) : (
          <div className="w-full h-[270px] shrink-0 flex items-center justify-center bg-slate-50 text-slate-400 text-xs sm:text-sm rounded-xl border border-dashed border-slate-200">
            No Image Available
          </div>
        )}

        <h2 className="text-lg md:text-2xl font-semibold text-slate-900 tracking-tight shrink-0">
          {item.name}
        </h2>

        {/* Body: takes remaining space, scrolls internally */}
        <div
          className="custom-scrollbar text-justify flex-1 min-h-0 overflow-y-auto pr-1 prose prose-slate prose-p:text-[15.5px] max-w-none text-slate-600 leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
          dangerouslySetInnerHTML={{ __html: item.body }}
        />
      </div>
    </motion.div>
  );
};


export default ResearchAreaCard