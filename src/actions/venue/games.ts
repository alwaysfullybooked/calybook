"use server";

import type { Category } from "@/server/db/schema";
import { api } from "@/trpc/server";

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
  isCloseMatch: boolean;
}

export async function createVenueGame({ venueId, venueName, category, winnerId, winnerName, playerId, playerName, score, playedDate, isCloseMatch }: CreateVenueGameProps) {
  return api.venueGames.create({
    venueId,
    venueName,
    category,
    winnerId,
    winnerName,
    playerId,
    playerName,
    score,
    playedDate,
    isCloseMatch,
  });
}
