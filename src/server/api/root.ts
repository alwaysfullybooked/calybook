import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "@/server/api/routers/user";
import { tennisPreferencesRouter } from "@/server/api/routers/preferences";
import { venueGamesRouter } from "@/server/api/routers/venues/games";
import { venueRankingsRouter } from "@/server/api/routers/venues/rankings";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,

  tennisPreferences: tennisPreferencesRouter,

  venueGames: venueGamesRouter,
  venueRankings: venueRankingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
