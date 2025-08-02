import { venueMembers } from "@/server/db/schema";

import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure } from "../trpc";

export const venueMembersRouter = {
	// Get ranking details
	find: protectedProcedure.input(z.object({ venueId: z.string(), playerId: z.string() })).query(async ({ ctx, input }) => {
		const result = await ctx.db.query.venueMembers.findFirst({
			where: and(eq(venueMembers.venueId, input.venueId), eq(venueMembers.playerId, input.playerId)),
		});
		return result;
	}),

	// Get all rankings for the current user
	search: protectedProcedure
		.input(
			z.object({
				venueId: z.string(),
				playerId: z.string().optional(),
				limit: z.number().optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const conditions = [eq(venueMembers.venueId, input.venueId)];

			if (input.playerId) {
				conditions.push(eq(venueMembers.playerId, input.playerId));
			}

			const result = await ctx.db.query.venueMembers.findMany({
				where: and(...conditions),
			});

			return result;
		}),

	// Create a new ranking
	create: protectedProcedure
		.input(
			z.object({
				venueId: z.string(),
				venueName: z.string(),
				venueCountry: z.string(),
				playerId: z.string(),
				playerName: z.string(),
				playerContactMethod: z.string(),
				playerContactId: z.string(),
				playerEmailId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const result = await ctx.db
				.insert(venueMembers)
				.values({
					venueId: input.venueId,
					venueName: input.venueName,
					venueCountry: input.venueCountry,
					playerId: input.playerId,
					playerName: input.playerName,
					playerContactMethod: input.playerContactMethod,
					playerContactId: input.playerContactId,
					playerEmailId: input.playerEmailId,
					userId: ctx.session.user.id,
					createdById: ctx.session.user.id,
				})
				.$returningId();

			return { id: result[0] };
		}),
};
