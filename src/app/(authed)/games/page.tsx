import { redirect } from "next/navigation";
import GamesList from "@/components/server/games-list";
import { openscor } from "@/lib/openscor";
import { auth } from "@/server/auth";

export default async function GamesPage() {
	const session = await auth();

	if (!session?.user?.id) {
		redirect("/login");
	}

	const games = await openscor.games.search({ category: "tennis", userId: session.user.id });

	const playerIds = [...new Set([...games.flatMap((game) => [...game.winnerTeam, ...game.playerTeam])])];
	const players = await openscor.leaderboards.search({ playerIds });

	const playerMap = new Map<string, string>();

	players.forEach((player) => {
		playerMap.set(player.playerId, player.playerName);
	});

	return (
		<div className="px-4 py-8 sm:px-6 lg:px-8">
			<div className="space-y-4 mb-12">
				<div className="flex justify-between items-center">
					<h1 className="text-3xl font-bold">My Games</h1>
				</div>

				<GamesList games={games} playerMap={playerMap} />
			</div>
		</div>
	);
}
