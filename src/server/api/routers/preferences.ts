import { z } from "zod";
import { protectedProcedure } from "../trpc";
import { Preferences, preferences } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const preferencesRouter = {
  find: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query.preferences.findFirst({
      where: eq(preferences.userId, ctx.session.user.id),
    });
    return result;
  }),

  upsert: protectedProcedure
    .input(
      z.object({
        category: z.nativeEnum(Preferences),
        universalTennisRating: z.string().optional(),
        nationalTennisRatingProgram: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.category === Preferences.TENNIS && input.universalTennisRating && input.nationalTennisRatingProgram) {
        const result = await ctx.db
          .insert(preferences)
          .values({
            category: Preferences.TENNIS,
            universalTennisRating: input.universalTennisRating,
            nationalTennisRatingProgram: input.nationalTennisRatingProgram,
            userId: ctx.session.user.id,
            createdById: ctx.session.user.id,
          })
          .onDuplicateKeyUpdate({
            set: {
              universalTennisRating: input.universalTennisRating,
              nationalTennisRatingProgram: input.nationalTennisRatingProgram,
            },
          });

        return result;
      }
    }),
};
