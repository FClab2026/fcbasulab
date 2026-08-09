import { fetchAllCategoriesInitial } from "@/lib/load_data/loadAlumni";
import { Metadata } from "next";
import { AlumniCategory, alumniCategories } from "@/lib/enums";
import CategorySection from "./_components/CategorySection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Group Alumni | Chem Lab",
  description:
    "Recognizing our former group members and their contributions to our research community.",
};

const INITIAL_PAGE_SIZE = 5;

const ALUMNI_CATEGORY_ORDER: AlumniCategory[] = [
  "FACULTY",
  "POSTDOC",
  "PHD",
  "MASTERS",
  "DUAL_DEGREE",
  "UNDERGRADUATE",
  "OTHER"
]

const CATEGORY_LABELS: Record<AlumniCategory, string> = {
  FACULTY: "Faculty",
  POSTDOC: "Postdoctoral Researchers",
  PHD: "PhD Students",
  MASTERS: "Masters Students",
  DUAL_DEGREE: "Dual Degree Students",
  UNDERGRADUATE: "Undergraduate Students",
  OTHER: "Other Alumni",
}

const AlumniPage = async () => {

  const groups = await fetchAllCategoriesInitial(INITIAL_PAGE_SIZE)

  // Build display list in canonical order; skip empty categories.
  const orderedGroups = ALUMNI_CATEGORY_ORDER.map((cat) =>
    groups.find((g) => g.category === cat)
  )
    .filter((g): g is NonNullable<typeof g> => Boolean(g))
    .filter((g) => g.items.length > 0)




  return (
    <div className="min-h-screen bg-white">

      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
          Alumni
        </h1>
      </div>

      {/* <main className="max-w-5xl mx-auto px-6 md:px-10 pb-16 md:pb-20 space-y-10 md:space-y-12"> */}
      <main className="px-16 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 pb-14">
        {orderedGroups.length === 0 ? (
          <div className="text-center py-24 text-slate-400 text-sm">
            No Alums recorded yet.
          </div>
        ) : (
          orderedGroups.map((group) => (
            <CategorySection
              key={group.category}
              category={group.category}
              displayName={CATEGORY_LABELS[group.category]}
              initialItems={group.items}
              totalItems={group.total}
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
