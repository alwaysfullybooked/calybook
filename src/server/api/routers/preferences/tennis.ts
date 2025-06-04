import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import { tennisPreferences } from "@/server/db/schema";

export const tennisPreferencesRouter = {
  update: protectedProcedure
    .input(
      z.object({
        universalTennisRating: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(tennisPreferences)
        .values({
          universalTennisRating: input.universalTennisRating,
          userId: ctx.session.user.id,
        })
        .onDuplicateKeyUpdate({ set: { universalTennisRating: input.universalTennisRating } });

      return result;
    }),
};
