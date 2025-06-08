// import { api } from "@/trpc/server";
import { AddTennisGame } from "@/components/client/venue/games";
import { alwaysbookbooked } from "@/lib/alwaysbookbooked";

export default async function GamesPage() {
  const venues = await alwaysbookbooked.venues.publicSearch("Thailand", "Chiang Mai");

  // const tennisGames = await api.tennisGames.search();

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-4 mb-12">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Games</h1>
          <AddTennisGame venues={venues} />
        </div>
        <div>{/* <TennisGamesForm tennisGames={tennisGames} /> */}</div>
      </div>
    </div>
  );
}
