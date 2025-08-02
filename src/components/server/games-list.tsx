import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Game } from "@/lib/openscor";
import { formatRankingVariation } from "@/lib/utils";
import { Badge } from "../ui/badge";

export default function GamesList({ games, playerMap }: { games: Game[]; playerMap: Map<string, string> }) {
	return (
		<Card>
			<CardHeader className="px-3 py-4 sm:px-6 sm:py-6">
				<CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
					<Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
					Recent Games
				</CardTitle>
			</CardHeader>
			<CardContent className="px-6">
				<div className="space-y-3 sm:space-y-4">
					{games.map((game) => (
						<div key={game.id} className="rounded-lg border p-3 sm:p-4 transition-colors hover:bg-muted/50">
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
								<div className="text-center col-span-2">
									<span className="font-bold text-sm sm:text-base capitalize flex flex-col items-center justify-center gap-2">
										<div className="flex items-center gap-2">
											<span>{game.winnerTeam.map((player) => playerMap.get(player)).join(", ")}</span>
											<span className={game?.winnerRankingVariation && game.winnerRankingVariation >= 0 ? "text-green-500 text-xs" : "text-red-500 text-xs"}>
												[{formatRankingVariation(game.winnerRankingVariation)}]
											</span>
										</div>
										<span className="lowercase font-normal">vs.</span>
										<div className="flex items-center gap-2">
											<span>{game.playerTeam.map((player) => playerMap.get(player)).join(", ")}</span>
											<span className={game?.playerRankingVariation && game.playerRankingVariation >= 0 ? "text-green-500 text-xs" : "text-red-500 text-xs"}>
												[{formatRankingVariation(game.playerRankingVariation)}]
											</span>
										</div>
									</span>
								</div>
								<div className="flex flex-col items-center gap-3">
									{/* {game.playerApproved && game.winnerApproved && (
										<Badge variant="outline" className="text-xs bg-primary">
											Approved
										</Badge>
									)} */}
									<Badge variant="secondary" className="text-xl">
										{game.score}
									</Badge>
									<span className="text-sm text-muted-foreground">{game.playedDate}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
