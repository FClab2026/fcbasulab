'use client'

import React, { useState } from 'react'
import { NewsCard } from '@/components/pub/newsCard'
import { fetchNewsActionSerialized,type NewsItem } from '@/lib/load_data/loadNews'
import { Button } from '@/components/ui/button'



interface NewsListProps {
  initialNews: NewsItem[]
}

export const NewsList = ({ initialNews }: NewsListProps) => {
  const [news, setNews] = useState<NewsItem[]>(initialNews)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialNews.length >= 20)

  const loadMore = async () => {
    setLoading(true)
    const nextPage = page + 1
    const response = await fetchNewsActionSerialized({
      page: nextPage,
    })
    
    if (response.success && response.items.length > 0) {
      setNews((prev) => [...prev, ...response.items as NewsItem[]])
      setPage(nextPage)
      setHasMore(response.items.length >= 20)
    } else {
      setHasMore(false)
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-6 w-full mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {news.map((newsItem, index) => (
          <div 
            key={newsItem.id} 
            className="transition-all hover:translate-y-[-4px] duration-300 h-full flex"
          >
            <NewsCard 
              title={newsItem.title} 
              body={newsItem.body} 
              createdAt={newsItem.createdAt} 
            />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button 
            onClick={loadMore} 
            disabled={loading}
            variant="outline"
            className="px-8"
          >
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}

      {!hasMore && news.length > 0 && (
        <p className="text-center text-muted-foreground mt-8">No more news to load.</p>
      )}
    </div>
  )
}
