import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import { tennisPreferences } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const tennisPreferencesRouter = {
  find: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query.tennisPreferences.findFirst({
      where: eq(tennisPreferences.userId, ctx.session.user.id),
    });
    return result;
  }),

  upsert: protectedProcedure
    .input(
      z.object({
        universalTennisRating: z.string(),
        nationalTennisRatingProgram: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(tennisPreferences)
        .values({
          universalTennisRating: input.universalTennisRating,
          nationalTennisRatingProgram: input.nationalTennisRatingProgram,
          userId: ctx.session.user.id,
        })
        .onDuplicateKeyUpdate({
          set: {
            universalTennisRating: input.universalTennisRating,
            nationalTennisRatingProgram: input.nationalTennisRatingProgram,
          },
        });

      return result;
    }),
};
