"use server";

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { toHTML } from "@portabletext/to-html";
import type { PortableTextBlock } from "@portabletext/types";

const ALUMNI_PAGE = groq`{
  "items": *[_type == "alumni"] | order(_createdAt desc)[$start...$end] {
    "id": _id,
    name,
    body,
    "updatedAt": _updatedAt,
    "createdAt": _createdAt
  },
  "total": count(*[_type == "alumni"])
}`;

const ptToHtml = (blocks: PortableTextBlock[] | null | undefined) =>
  blocks && blocks.length ? toHTML(blocks) : "";

export async function fetchAlumniAction({
  page = 1,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
}) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  console.log("[fetchAlumniAction] querying Sanity", { start, end });
  const result = await client.fetch<{
    items: { id: string; name: string; body: PortableTextBlock[]; updatedAt: string; createdAt: string }[];
    total: number;
  }>(ALUMNI_PAGE, { start, end });
  console.log("[fetchAlumniAction] raw result", JSON.stringify(result).slice(0, 500));

  const items = result.items ?? [];
  const data = items.map((it) => ({
    id: it.id,
    name: it.name,
    body: ptToHtml(it.body),
    updatedAt: it.updatedAt,
    createdAt: it.createdAt,
  }));

  return {
    success: true,
    data,
    total: result.total ?? 0,
    hasMore: (result.total ?? 0) > start + data.length,
  };
}
