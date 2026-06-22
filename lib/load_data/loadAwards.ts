"use server";

import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { toHTML } from "@portabletext/to-html";
import type { PortableTextBlock } from "@portabletext/types";
import { AwardType } from "@/lib/enums";

const AWARDS_PAGE = groq`{
  "items": *[_type == "award" && (!defined($type) || type == $type)]
    | order(_createdAt desc)[$start...$end] {
    "id": _id,
    body,
    type,
    "updatedAt": _updatedAt,
    "createdAt": _createdAt
  },
  "total": count(*[_type == "award" && (!defined($type) || type == $type)])
}`;

const ptToHtml = (blocks: PortableTextBlock[] | null | undefined) =>
  blocks && blocks.length ? toHTML(blocks) : "";

export async function fetchAwardsAction({
  type,
  page = 1,
  pageSize = 10,
}: {
  type?: AwardType;
  page?: number;
  pageSize?: number;
}) {
  try {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const { items, total } = await client.fetch<{
      items: {
        id: string;
        body: PortableTextBlock[];
        type: AwardType;
        updatedAt: string;
        createdAt: string;
      }[];
      total: number;
    }>(AWARDS_PAGE, { start, end, type: type ?? null });

    const data = items.map((it) => ({
      id: it.id,
      body: ptToHtml(it.body),
      type: it.type,
      updatedAt: it.updatedAt,
      createdAt: it.createdAt,
    }));

    return {
      success: true,
      data,
      total,
      hasMore: total > start + data.length,
    };
  } catch (error) {
    console.error("Error fetching awards:", error);
    if (process.env.NODE_ENV !== "production") throw error;
    return { success: false, error: "Failed to fetch awards" };
  }
}
