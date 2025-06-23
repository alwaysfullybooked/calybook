import { Categories, groupMembers, groups } from "@/server/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure } from "../trpc";

export const groupsRouter = {
  find: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.groups.findFirst({
        where: and(eq(groups.createdById, ctx.session.user.id), eq(groups.id, input.groupId)),
      });
      return result;
    }),

  search: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query.groups.findMany({
      where: eq(groups.createdById, ctx.session.user.id),
    });
    return result;
  }),

  searchJoined: protectedProcedure.query(async ({ ctx }) => {
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
        name: z.string(),
        category: z.nativeEnum(Categories),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .insert(groups)
        .values({
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
      }),
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

  join: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is already a member
      const existingMember = await ctx.db.query.groupMembers.findFirst({
        where: and(eq(groupMembers.groupId, input.groupId), eq(groupMembers.userId, ctx.session.user.id)),
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
};
