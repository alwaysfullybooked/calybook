import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import { Categories, venueGames, venueRankings } from "@/server/db/schema";
import { eq, and, or } from "drizzle-orm";

export const venueRankingsRouter = {
  // Get venue ranking details
  find: protectedProcedure.input(z.object({ userId: z.string(), venueId: z.string() })).query(async ({ ctx, input }) => {
    const result = await ctx.db.query.venueRankings.findFirst({
      where: and(eq(venueRankings.userId, input.userId), eq(venueRankings.venueId, input.venueId)),
    });
    return result;
  }),

  // Get all venue rankings for the current user
  search: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query.venueRankings.findMany({
      where: eq(venueRankings.userId, ctx.session.user.id),
      orderBy: (venueRankings, { desc }) => [desc(venueRankings.lastMatchDate)],
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.insert(venueRankings).values({
        venueId: input.venueId,
        venueName: input.venueName,
        category: input.category,
        joinedDate: new Date().toISOString().split("T")[0] ?? "2025-06-01",
        userId: ctx.session.user.id,
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
