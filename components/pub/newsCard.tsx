"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { fetchNewsActionSerialized } from '@/lib/load_data/loadNews';
import InfiniteCarousel from '@/components/pub/InfiniteCarousel';

interface NewsCardProps {
  title: string;
  body: string;
  createdAt: Date | string;
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
}
export const NewsCard = ({ title, body, createdAt }: NewsCardProps) => {
  return (
    <div className="group/newscard relative flex flex-col bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-amber-700/30 transition-all duration-300 h-full w-full">
      <h3
        className="text-lg font-serif font-bold text-slate-950 mb-2 line-clamp-2 leading-snug group-hover/newscard:text-amber-700 transition-colors duration-200"
        title={title}
      >
        {title}
      </h3>
      <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-4">
        {new Date(createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
      </div>
      <div
        className="prose prose-sm max-w-none text-slate-600 text-xs leading-relaxed line-clamp-3 flex-1 [&_a]:relative [&_a]:z-10 [&_a]:text-amber-700 [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-amber-800"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </div>
  )
}

const NewsSkeleton = () => (
  <div className="news-card animate-pulse">
    <div className="h-6 bg-slate-100 rounded w-3/4 mb-3" />
    <div className="h-3 bg-slate-50 rounded w-1/4 mb-4" />
    <div className="space-y-2">
      <div className="h-3 bg-slate-50 rounded" />
      <div className="h-3 bg-slate-50 rounded w-5/6" />
    </div>
  </div>
);

const NewsSection = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !hasLoaded && !loading) {
          setLoading(true);
          try {
            const result = await fetchNewsActionSerialized({
              page: 1,
              pageSize: 6,
            });
            if (result.success) {
              setNews(result.items);
              setHasLoaded(true);
            }
          } catch (error) {
            console.error("Failed to lazy load news:", error);
          } finally {
            setLoading(false);
          }
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasLoaded, loading]);


  const itemsToShow = news.slice(0, 6);

  // if (news.length === 0 && !loading) {
  //   return null; // Don't render the section if there's no news and not loading
  // }
  return (
    <section ref={sectionRef} className="section news-section bg-white border-b border-slate-200/80">
      <div className="section-container">
        <div className="section-header-row">
          <div>
            <div className="section-label">Latest Updates</div>
            <h2 className="section-heading">News &amp; Announcements</h2>
          </div>
          <Link href="/news" className="section-link">View all news &rarr;</Link>
        </div>

        {loading && !hasLoaded ? (
          <div className="flex gap-6 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-[320px] min-w-[320px]">
                <NewsSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <InfiniteCarousel speed={35} gap={24}>
            {itemsToShow.map((item, index) => (
              <div key={item.id || index} className="w-[320px] min-w-[320px] flex">
                <NewsCard {...item} />
              </div>
            ))}
          </InfiniteCarousel>
        )}
      </div>
    </section>
  )
}

export default NewsSection
