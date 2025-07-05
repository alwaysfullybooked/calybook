"use server";

import { alwaysfullybooked } from "@/lib/alwaysfullybooked";
import { openscor } from "@/lib/openscor";
import { auth } from "@/server/auth";
import type { Category, MatchType } from "@openscor-com/sdk-node";

interface CreateGameOptions {
  competitionId: string;
  category: Category;
  matchType: MatchType;
  venueId: string;
  winnerTeam: { id: string; name: string }[];
  playerTeam: { id: string; name: string }[];
  score: string;
  playedDate: string;
}

export async function createOpenScorGame(props: CreateGameOptions) {
  const session = await auth();

  if (!session?.user?.id || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  const venue = await alwaysfullybooked.venues.publicFind({ venueId: props.venueId });

  if (!venue) {
    throw new Error("Venue not found");
  }

  return openscor.games.create({
    competitionId: props.competitionId,
    category: props.category,
    matchType: props.matchType,
    venueId: props.venueId,
    venueName: venue.name,
    venueCountry: venue.country,

    winnerTeam: props.winnerTeam,
    playerTeam: props.playerTeam,

    score: props.score,
    playedDate: props.playedDate,
  });
}

export async function approveOpenScorGame({ gameId, approvedBy }: { gameId: string; approvedBy: string }) {
  const session = await auth();

  if (!session?.user?.id || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  return openscor.games.approve({
    gameId,
    approvedBy,
  });
}
