import { z } from "zod";
import { protectedProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { users } from "@/server/db/schema";

export const userRouter = {
	update: protectedProcedure
		.input(
			z.object({
				contactMethod: z.string(),
				contactWhatsAppId: z.string(),
				contactLineId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const result = await ctx.db
				.update(users)
				.set({
					contactMethod: input.contactMethod,
					contactWhatsAppId: input.contactWhatsAppId,
					contactLineId: input.contactLineId,
				})
				.where(eq(users.id, ctx.session.user.id));

			return result;
		}),
};
