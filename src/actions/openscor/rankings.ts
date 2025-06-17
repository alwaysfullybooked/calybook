"use server";

import { auth } from "@/server/auth";
import { openscor } from "@/lib/openscor";
import { revalidatePath } from "next/cache";
import type { Category } from "@/server/db/schema";
import { alwaysbookbooked } from "@/lib/alwaysbookbooked";

interface JoinRankingsProps {
  country: string;
  lang: string;
  city: string;
  leagueId: string;
  venueId: string;
  category: Category;
  playerId: string;
  playerName: string;
  playerContactMethod: string;
  playerContactId: string;
  playerEmailId: string;
  ranking: boolean;
}

export async function joinVenueRankings({ country, lang, city, venueId, leagueId, category, playerId, playerName, playerContactMethod, playerContactId, playerEmailId, ranking }: JoinRankingsProps) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const venue = await alwaysbookbooked.venues.publicFind({ venueId });

  if (!venue) {
    throw new Error("Venue not found");
  }

  if (!ranking) {
    await openscor.rankings.create({
      leagueId,
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
