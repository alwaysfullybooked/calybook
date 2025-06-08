"use server";

import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";
import type { Category } from "@/server/db/schema";

interface JoinVenueRankingsProps {
  country: string;
  lang: string;
  city: string;
  venueId: string;
  venueName: string;
  category: Category;
}

export async function joinVenueRankings({ country, lang, city, venueId, venueName, category }: JoinVenueRankingsProps) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = api.venueRankings.create({
    venueId,
    venueName,
    category,
  });

  revalidatePath(`/${country}/${lang}/${city}/venues/${venueId}`);

  return result;
}
