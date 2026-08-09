"use server";

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { toHTML } from "@portabletext/to-html";
import type { PortableTextBlock } from "@portabletext/types";
import type { AlumniCategory,alumniCategories } from "@/sanity/schemas/alumni";

const ALUMNI_PAGE = groq`
{
  "items": *[
    _type == "alumni"
    && category == $category
    && year == $year
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
    && year == $year
  ])
}
`;

const ptToHtml = (
  blocks: PortableTextBlock[] | null | undefined
) =>
  blocks && blocks.length
    ? toHTML(blocks)
    : "";

export async function fetchAlumniAction({
  category,
  year,
  page = 1,
  pageSize = 20,
}: {
  category: AlumniCategory;
  year: number;
  page?: number;
  pageSize?: number;
}) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  console.log("[fetchAlumniAction] querying Sanity", {
    category,
    year,
    start,
    end,
  });

  const result = await client.fetch<{
    items: {
      id: string;
      name: string;
      body: PortableTextBlock[];
      year: number;
      category: string;
      updatedAt: string;
      createdAt: string;
    }[];
    total: number;
  }>(
    ALUMNI_PAGE,
    {
      category,
      year,
      start,
      end,
    }
  );

  console.log(
    "[fetchAlumniAction] raw result",
    JSON.stringify(result).slice(0, 500)
  );

  const items = result.items ?? [];

  const data = items.map((it) => ({
    id: it.id,
    name: it.name,
    body: ptToHtml(it.body),
    year: it.year,
    category: it.category,
    updatedAt: it.updatedAt,
    createdAt: it.createdAt,
  }));

  const total = result.total ?? 0;

  return {
    success: true,
    data,
    total,
    page,
    pageSize,
    hasMore: total > start + data.length,
    totalPages: Math.ceil(total / pageSize),
  };
}