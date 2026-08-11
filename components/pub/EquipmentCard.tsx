'use client'

import React from 'react'
import Link from 'next/link'

interface EquipmentCardProps {
  item: {
    id: string
    name: string | null
    body: string | null
    imgUrl: string | null
  }
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s
  return s.slice(0, n - 1).trimEnd() + '…'
}

const EquipmentCard = ({ item }: EquipmentCardProps) => {
  const plainDesc = item.body && truncate(stripHtml(item.body), 120)

  return (
    <div
      id={item.id}
      className="group/eqcard relative flex flex-col bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-amber-700/30 transition-all duration-300 h-full w-full scroll-mt-24"
    >
      {item.imgUrl ? (
        <div className="relative w-full aspect-[420/450] overflow-hidden bg-slate-50 flex items-center justify-center">
          <img
            src={item.imgUrl}
            alt={item.name ?? 'Equipment Image'}
            className="w-full h-full object-cover group-hover/eqcard:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
        </div>
      ) : (
        <div className="relative w-full aspect-[380/450] flex items-center justify-center bg-slate-50 border-b border-slate-100 text-slate-400">
          <span className="text-xs">No Image Available</span>
        </div>
      )}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {
            item.name &&
            <h3
              className="text-base font-bold text-slate-950 mb-2 line-clamp-2 leading-snug group-hover/eqcard:text-amber-700 transition-colors duration-200"
              title={item.name}
            >
              {item.name}
            </h3>
          }
          <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
            {plainDesc}
          </p>
        </div>
      </div>
    </div>
  )
}

export default EquipmentCard