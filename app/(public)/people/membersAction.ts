'use server';

import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { MEMBERS_BY_CATEGORY } from '@/sanity/lib/queries';
import { GroupCategory } from '@/lib/enums';
import type { SanityImageSource } from '@sanity/image-url';

const MEMBERS_PER_SECTION = 15;

export async function fetchMembersByCategory(category: GroupCategory, page: number = 1) {
  try {
    const start = (page - 1) * MEMBERS_PER_SECTION;
    const end = start + MEMBERS_PER_SECTION;

    const { items, total } = await client.fetch<{
      items: {
        id: string;
        name: string;
        email: string;
        researchAreas: string | null;
        designation: string | null;
        category: GroupCategory;
        profileImage: SanityImageSource | null;
        profileLink: string | null;
        phoneNumber: string | null;
      }[];
      total: number;
    }>(MEMBERS_BY_CATEGORY, { category, start, end });

    return {
      success: true,
      data: items.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        researchAreas: m.researchAreas || '',
        designation: m.designation,
        category: m.category,
        profileImgUrl: m.profileImage ? urlFor(m.profileImage).width(800).url() : null,
        profileLink: m.profileLink,
        phoneNumber: m.phoneNumber,
      })),
      meta: {
        total,
        page,
        limit: MEMBERS_PER_SECTION,
        totalPages: Math.ceil(total / MEMBERS_PER_SECTION),
      },
    };
  } catch (error) {
    console.error('Error fetching members:', error);
    if (process.env.NODE_ENV !== 'production') throw error;
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, limit: MEMBERS_PER_SECTION, totalPages: 0 },
      error: 'Failed to fetch members',
    };
  }
}
