"use server";

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { toHTML } from "@portabletext/to-html";
import type { PortableTextBlock } from "@portabletext/types";
import { alumniCategories, type AlumniCategory } from "@/lib/enums"

const ALUMNI_PAGE = groq`
{
  "items": *[
    _type == "alumni"
    && category == $category
  ]
  | order(year desc, name asc)
  [$start...$end] {
    "id": _id,
    name,
    body,
    year,
    category,
    "updatedAt": _updatedAt,
    "createdAt": _createdAt
  },

  "total": count(*[
    _type == "alumni"
    && category == $category
  ])
}
`;

export type AlumniItem = {
  id: string;
  name: string;
  body: string;
  year: number;
  category: string;
  updatedAt: string;
  createdAt: string;
}

type AlumniWithPortableText = Omit<AlumniItem, "body"> & {
  body: PortableTextBlock[];
};


export interface CategoryGroup {
  category: AlumniCategory
  items: AlumniItem[]
  total: number
  hasMore: boolean
}

const ptToHtml = (
  blocks: PortableTextBlock[] | null | undefined
) =>
  blocks && blocks.length
    ? toHTML(blocks)
    : "";


const serialize = (rows: AlumniWithPortableText[]): AlumniItem[] =>
  rows.map((r) => ({

    id: r.id,
    name: r.name,
    body: ptToHtml(r.body),
    year: r.year,
    category: r.category,
    updatedAt: r.updatedAt,
    createdAt: r.createdAt,

  }))

export async function fetchAllCategoriesInitial(pageSize: number = 10): Promise<CategoryGroup[]> {
  const categories = alumniCategories.map((cat) => cat.value as AlumniCategory)
  const results = await Promise.all(
    categories.map(async (category) => {
      const { items, total } = await fetchCategoryPage({
        category,
        page: 1,
        pageSize,
      })
      return {
        category,
        items: serialize(items),
        total,
        hasMore: total > pageSize,
      } satisfies CategoryGroup
    }),
  )
  return results
}



export async function fetchCategoryPage({
  category,
  page = 1,
  pageSize = 20,
}: {
  category: AlumniCategory;
  page?: number;
  pageSize?: number;
}) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  console.log("[fetchAlumniAction] querying Sanity", {
    category,
    start,
    end,
  });

  const result = await client.fetch<{
    items: AlumniWithPortableText[];
    total: number;
  }>(
    ALUMNI_PAGE,
    {
      category,
      start,
      end,
    }
  );
  return result
}


export async function fetchAlumniPageAction(
  category: AlumniCategory,
  page: number,
  pageSize: number = 5,
): Promise<{ success: boolean; items: AlumniItem[]; total: number; hasMore: boolean }> {
  try {
    const { items, total } = await fetchCategoryPage({ category, page, pageSize })
    return {
      success: true,
      items: serialize(items),
      total,
      hasMore: total > page * pageSize,
    }
  } catch (err) {
    console.error('Failed to fetch publications page:', err)
    if (process.env.NODE_ENV !== 'production') throw err
    return { success: false, items: [], total: 0, hasMore: false }
  }
}
