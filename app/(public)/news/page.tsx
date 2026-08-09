import { Metadata } from "next";
import { AlumniCategory, alumniCategories } from "@/lib/enums";
import CategorySection from "./_components/CategorySection";
import { fetchNewsAction,fetchAllCategoriesInitial, type NewsItem } from "@/lib/load_data/loadNews";
import { NewsAndAnnouncementsType } from '@/lib/enums'

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "News & Announcements | FC-BASU Lab",
    description: "Stay updated with the latest news and announcements from our lab. Explore events, vacancies, and more.",
};

const INITIAL_PAGE_SIZE = 10;

const CATEGORY_ORDER: NewsAndAnnouncementsType[] = [
    "Event",
    "Vacancy",
]

const CATEGORY_LABELS: Record<NewsAndAnnouncementsType, string> = {
    Event: "Events",
    Vacancy: "Vacancies",
}

const AlumniPage = async () => {

    const groups = await fetchAllCategoriesInitial(INITIAL_PAGE_SIZE)

    // Build display list in canonical order; skip empty categories.
    const orderedGroups = CATEGORY_ORDER.map((cat) =>
        groups.find((g) => g.type === cat)
    )
        .filter((g): g is NonNullable<typeof g> => Boolean(g))
        .filter((g) => g.items.length > 0)




    return (
        <div className="min-h-screen bg-white">
            {/* <main className="max-w-5xl mx-auto px-6 md:px-10 pb-16 md:pb-20 space-y-10 md:space-y-12"> */}
            <main className="px-16 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 pb-14 py-8">
                {orderedGroups.length === 0 ? (
                    <div className="text-center py-24 text-slate-400 text-sm">
                        No news or announcements available at this time.
                    </div>
                ) : (
                    orderedGroups.map((group) => (
                        <CategorySection
                            key={group.items[0].id}
                            type={group.type}
                            displayName={CATEGORY_LABELS[group.type]}
                            initialItems={group.items}
                            itemsTotal={group.total}
                            initialHasMore={group.hasMore}
                            pageSize={INITIAL_PAGE_SIZE}
                        />
                    ))
                )}
            </main>
        </div>
    );
};

export default AlumniPage;
