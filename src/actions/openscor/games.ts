"use server";

import { auth } from "@/server/auth";
import { openscor } from "@/lib/openscor";
import type { Category, MatchType } from "@openscor-com/sdk-node";

interface CreateGameProps {
  competitionId: string;
  venueId: string;
  venueName: string;
  venueCountry: string;
  category: Category;
  matchType: MatchType;
  winnerId: string;
  winnerName: string;
  playerId: string;
  playerName: string;
  score: string;
  playedDate: string;
}

export async function createOpenScorGame({ competitionId, venueId, venueName, venueCountry, category, matchType, winnerId, winnerName, playerId, playerName, score, playedDate }: CreateGameProps) {
  const session = await auth();

  if (!session?.user?.id || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  return openscor.games.create({
    competitionId,
    venueId,
    venueName,
    venueCountry,
    category,
    matchType,
    winnerId,
    winnerName,
    playerId,
    playerName,
    score,
    playedDate,
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
