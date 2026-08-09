import { AwardType } from "@/lib/enums";
import { fetchAwardsAction } from "@/lib/load_data/loadAwards";
import { Timeline } from "@/components/pub/Timeline/Timeline";
import { Metadata } from "next";
import CategorySection from "../_components/CategorySection";
import NoRecords from "../_components/NoRecords";


export const dynamic = "force-dynamic";

const INITIAL_PAGE_SIZE = 10

export const metadata: Metadata = {
    title: "Group Leader Awards | Chem Lab",
    description: "Recognitions and awards received by our group leader for excellence in chemical research and academic contributions.",
};

const AwardsPage = async () => {
    const result = await fetchAwardsAction({
        type: AwardType.GROUP_MEMBER, // All awrds are of type GROUP_LEADER as earlier we have two types but now we have only one type of awards
        page: 1,
        pageSize: INITIAL_PAGE_SIZE,
    });

    console.log("AwardsPage result:", result); // Debugging line

    const awards = result.success ? result.data : [];
    const hasMore = result.hasMore;

    if (!awards || awards.length === 0) {
        return (
            <div className="min-h-screen bg-white max-w-5xl mx-auto px-4 md:px-10 py-8">
                <NoRecords />
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-white max-w-5xl mx-auto px-4 md:px-10 py-8">

            <CategorySection
                category={AwardType.GROUP_MEMBER}
                displayName="Group Member Awards"
                initialItems={awards || []}
                itemsTotal={result.total || 0}
                initialHasMore={hasMore || false}
                pageSize={INITIAL_PAGE_SIZE}
            />
        </div>
    );
};

export default AwardsPage;
