"use server";

import type { Category } from "@/server/db/schema";
import { auth } from "@/server/auth";
import { openscor } from "@/lib/openscor";

interface CreateVenueGameProps {
  venueId: string;
  venueName: string;
  category: Category;
  winnerId: string;
  winnerName: string;
  playerId: string;
  playerName: string;
  score: string;
  playedDate: string;
}

export async function createOpenScorGame({ venueId, venueName, category, winnerId, winnerName, playerId, playerName, score, playedDate }: CreateVenueGameProps) {
  const session = await auth();

  if (!session?.user?.id || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  return openscor.games.create({
    venueId,
    venueName,
    category,
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
