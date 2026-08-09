import { AwardType } from "@/lib/enums";
import { fetchAwardsAction, type AwardItem } from "@/lib/load_data/loadAwards";
import { Timeline } from "@/components/pub/Timeline/Timeline";
import { Metadata } from "next";
import CategorySection from "../_components/CategorySection";
import NoRecords from "../_components/NoRecords";
import fetchAwardGalleryAction from "@/lib/load_data/load_award_gallery";
import AwardGalleryTiles from "../_components/AwardGalleryTiles";

export const dynamic = "force-dynamic";

const INITIAL_PAGE_SIZE = 10;

export const metadata: Metadata = {
    title: "Group Leader Awards | Chem Lab",
    description: "Recognitions and awards received by our group leader for excellence in chemical research and academic contributions.",
};

const AwardsPage = async () => {
    // Promise.all resolves to an ARRAY in the order the promises were
    // passed in — destructure positionally, not as { awardResult, result2 }.
    const [awardResult, galleryResult] = await Promise.all([
        fetchAwardsAction({
            type: AwardType.GROUP_LEADER, // All awards are of type GROUP_LEADER as earlier we have two types but now we have only one type of awards
            page: 1,
            pageSize: INITIAL_PAGE_SIZE,
        }),
        fetchAwardGalleryAction(1, INITIAL_PAGE_SIZE),
    ]);

    const awards = awardResult.success ? awardResult.data : [];
    const hasMore = awardResult.hasMore;

    const galleryItems = galleryResult.success ? galleryResult.data : [];

    if (!awards || awards.length === 0) {
        return (
            <div className="min-h-screen bg-white max-w-5xl mx-auto px-4 md:px-10 py-8">
                <NoRecords />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white max-w-6xl mx-auto px-4 md:px-10 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <CategorySection
                    category={AwardType.GROUP_LEADER}
                    displayName="Group Leader Awards"
                    initialItems={awards || []}
                    itemsTotal={awardResult.total || 0}
                    initialHasMore={hasMore || false}
                    pageSize={INITIAL_PAGE_SIZE}
                />
                    {galleryItems.length > 0 && (
                        <AwardGalleryTiles
                            displayName="Award Gallery"
                            initialItems={galleryItems}
                            initialTotal={galleryResult.total || 0}
                            initialHasMore={galleryResult.hasMore || false}
                            pageSize={INITIAL_PAGE_SIZE}
                        />
                    )}
                </div>

        </div>
    );
};

export default AwardsPage;