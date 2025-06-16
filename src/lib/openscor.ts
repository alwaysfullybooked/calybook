import { OpenScor } from "@openscor-com/sdk-node";
import { env } from "@/env";

const apiKey = env.OS_API_KEY;
const baseUrl = env.OS_API_URL;

if (!apiKey) {
  throw new Error("AFB_API_KEY is not set");
}

if (!baseUrl) {
  throw new Error("AFB_API_URL is not set");
}

export const openscor = new OpenScor({
  apiKey,
  baseUrl,
});

export type Ranking = Awaited<ReturnType<typeof openscor.rankings.search>>[number];

export type Game = Awaited<ReturnType<typeof openscor.games.search>>[number];

export { Categories, MatchTypes, type Category, type MatchType } from "@openscor-com/sdk-node";
