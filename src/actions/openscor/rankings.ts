"use server";

import { auth } from "@/server/auth";
import { openscor } from "@/lib/openscor";
import { revalidatePath } from "next/cache";
import type { Category } from "@/server/db/schema";
import { alwaysfullybooked } from "@/lib/alwaysfullybooked";

interface JoinRankingsProps {
  country: string;
  lang: string;
  city: string;
  venueId: string;
  category: Category;
  playerId: string;
  playerName: string;
  playerContactMethod: string;
  playerContactId: string;
  playerEmailId: string;
  ranking: boolean;
}

export async function joinVenueRankings({ country, lang, city, venueId, category, playerId, playerName, playerContactMethod, playerContactId, playerEmailId, ranking }: JoinRankingsProps) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const venue = await alwaysfullybooked.venues.publicFind({ venueId });

  if (!venue) {
    throw new Error("Venue not found");
  }

  if (!ranking) {
    await openscor.leaderboards.create({
      category,
      playerId,
      playerName,
      playerContactMethod,
      playerContactId,
      playerEmailId,
    });
  }

  const result = await openscor.venuePlayers.create({
    venueId,
    venueName: venue.name,
    venueCountry: venue.country,
    playerId,
    playerName,
    playerContactMethod,
    playerContactId,
    playerEmailId,
  });

  revalidatePath(`/${country}/${lang}/${city}/venues/${venueId}`);

  return result;
}
