import { env } from "@/env";
import { OpenScor } from "@openscor-com/sdk-node";

const apiKey = env.OPENSCOR_API_KEY;
const baseUrl = env.OPENSCOR_API_URL;

if (!apiKey) {
  throw new Error("OPENSCOR_API_KEY is not set");
}

if (!baseUrl) {
  throw new Error("OPENSCOR_API_URL is not set");
}

export const openscor = new OpenScor({
  apiKey,
  baseUrl,
});

export type Ranking = Awaited<ReturnType<typeof openscor.leaderboards.search>>[number];

export type Game = Awaited<ReturnType<typeof openscor.games.search>>[number];
