import {
  Categories,
  groupMembers,
  groupVenues,
  groups,
} from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure } from "../trpc";

export const groupsRouter = {
  find: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.groups.findFirst({
        where: and(eq(groups.id, input.groupId)),
        with: {
          venues: true,
        },
      });

      return result;
    }),

  search: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query.groups.findMany({
      where: eq(groups.createdById, ctx.session.user.id),
    });
    return result;
  }),

  searchMembers: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.groupMembers.findMany({
        where: and(eq(groupMembers.groupId, input.groupId)),
        with: {
          user: true,
        },
      });

      return result;
    }),

  searchMemberGroups: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query.groupMembers.findMany({
      where: eq(groupMembers.userId, ctx.session.user.id),
      with: {
        group: true,
      },
    });

    const groups = result.map((member) => member.group);

    return groups;
  }),

  create: protectedProcedure
    .input(
      z.object({
        competitionId: z.string(),
        name: z.string(),
        category: z.nativeEnum(Categories),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .insert(groups)
        .values({
          competitionId: input.competitionId,
          name: input.name,
          category: input.category,
          description: input.description,
          createdById: ctx.session.user.id,
        })
        .$returningId();

      return result;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        category: z.nativeEnum(Categories),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(groups)
        .set({
          name: input.name,
          category: input.category,
          description: input.description,
        })
        .where(eq(groups.id, input.id));

      return result;
    }),

  addMember: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is already a member
      const existingMember = await ctx.db.query.groupMembers.findFirst({
        where: and(
          eq(groupMembers.groupId, input.groupId),
          eq(groupMembers.userId, ctx.session.user.id)
        ),
      });

      if (existingMember) {
        throw new Error("You are already a member of this group");
      }

      // Add user to group as a member
      const result = await ctx.db.insert(groupMembers).values({
        groupId: input.groupId,
        userId: ctx.session.user.id,
        role: "member",
        createdById: ctx.session.user.id,
      });

      return result;
    }),

  addVenue: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
        venueId: z.string(),
        venueName: z.string(),
        venueCountry: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.insert(groupVenues).values({
        groupId: input.groupId,
        venueId: input.venueId,
        venueName: input.venueName,
        venueCountry: input.venueCountry,
        createdById: ctx.session.user.id,
      });

      return result;
    }),
};
