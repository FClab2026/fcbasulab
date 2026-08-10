"use client"

import React from 'react'
import EquipmentCard from "@/components/pub/EquipmentCard"
import fetchResearchEquipments from '@/lib/load_data/load_research_equipments'

export default function ResearchFacilitiesPage() {
  const [data, setData] = React.useState<any[] | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchResearchEquipments()
        setData(result)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-900">
        <p>Failed to load research facilities.</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <span className="text-xs font-semibold tracking-widest uppercase text-amber-700 block text-center mb-3">
          Our Infrastructure
        </span>
        <h1 className="text-3xl md:text-5xl font-serif text-center font-bold text-slate-950 mb-4">
          Work Enviroment/Research Facilities
        </h1>
        <p className="text-slate-600 text-center max-w-2xl mx-auto font-sans text-sm md:text-base leading-relaxed">
          Our laboratory is equipped with state-of-the-art instruments supporting research across spectroscopy, microscopy, thermal analysis, and chemical characterization.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-light">
            No equipment listed yet.
          </div>
        ) : (
          data.map((item) => (
            <EquipmentCard key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  )
}
