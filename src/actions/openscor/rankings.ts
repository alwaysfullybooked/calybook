"use server";

import { auth } from "@/server/auth";
import { openscor } from "@/lib/openscor";
import { revalidatePath } from "next/cache";
import type { Category } from "@/server/db/schema";

interface JoinVenueRankingsProps {
  country: string;
  lang: string;
  city: string;
  leagueId: string;
  venueId: string;
  venueName: string;
  category: Category;
  playerId: string;
  playerName: string;
  playerContactMethod: string;
  playerContactId: string;
  playerEmailId: string;
}

export async function joinVenueRankings({
  country,
  lang,
  city,
  leagueId,
  venueId,
  venueName,
  category,
  playerId,
  playerName,
  playerContactMethod,
  playerContactId,
  playerEmailId,
}: JoinVenueRankingsProps) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = openscor.rankings.create({
    leagueId,
    venueId,
    venueName,
    category,
    playerId,
    playerName,
    playerContactMethod,
    playerContactId,
    playerEmailId,
  });

  revalidatePath(`/${country}/${lang}/${city}/venues/${venueId}`);

  return result;
}
