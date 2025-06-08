import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import { Categories, venueGames } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";

export const venueGamesRouter = {
  // Get match details
  find: protectedProcedure.input(z.object({ matchId: z.string() })).query(async ({ ctx, input }) => {
    const result = await ctx.db.query.venueGames.findFirst({
      where: eq(venueGames.id, input.matchId),
      with: {
        player: true,
        winner: true,
      },
    });
    return result;
  }),

  // Get all matches for the current user
  search: protectedProcedure.input(z.object({ venueId: z.string() })).query(async ({ ctx, input }) => {
    const result = await ctx.db.query.venueGames.findMany({
      where: eq(venueGames.venueId, input.venueId),
      with: {
        player: true,
        winner: true,
      },
      orderBy: [desc(venueGames.playedDate)],
    });
    return result;
  }),

  // Create a new match
  create: protectedProcedure
    .input(
      z.object({
        venueId: z.string(),
        venueName: z.string(),
        category: z.nativeEnum(Categories),
        winnerId: z.string(),
        winnerName: z.string(),
        playerId: z.string(),
        playerName: z.string(),
        score: z.string(),
        playedDate: z.string(),
        isCloseMatch: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.insert(venueGames).values({
        venueId: input.venueId,
        venueName: input.venueName,
        category: input.category,
        winnerId: input.winnerId,
        winnerName: input.winnerName,
        playerId: input.playerId,
        playerName: input.playerName,
        score: input.score,
        playedDate: input.playedDate,
        isCloseMatch: input.isCloseMatch,
        createdById: ctx.session.user.id,
      });
      return result;
    }),

  // Approve a match
  approve: protectedProcedure
    .input(
      z.object({
        matchId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const match = await ctx.db.query.venueGames.findFirst({
        where: eq(venueGames.id, input.matchId),
      });

      if (!match) {
        throw new Error("Match not found");
      }

      const winner = match.winnerId === ctx.session.user.id;
      const player = match.playerId === ctx.session.user.id;

      if (!winner && !player) {
        throw new Error("You are not a participant in this match");
      }

      const result = await ctx.db
        .update(venueGames)
        .set({
          playerApproved: player ? true : match.playerApproved,
          winnerApproved: winner ? true : match.winnerApproved,
        })
        .where(eq(venueGames.id, input.matchId));

      return result;
    }),
};
