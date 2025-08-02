import { Calendar } from "lucide-react";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { openscor } from "@/lib/openscor";
import { auth } from "@/server/auth";

export default async function GamesPage() {
	const session = await auth();

	if (!session?.user?.id) {
		redirect("/login");
	}

	const games = await openscor.games.search({ category: "tennis", userId: session.user.id });

	return (
		<div className="px-4 py-8 sm:px-6 lg:px-8">
			<div className="space-y-4 mb-12">
				<div className="flex justify-between items-center">
					<h1 className="text-3xl font-bold">My Games</h1>
				</div>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Calendar className="h-6 w-6 text-blue-500" />
							Recent Matches
						</CardTitle>
					</CardHeader>
					<CardContent className="px-3 sm:px-6">
						<div className="space-y-3 sm:space-y-4">
							{games.map((game) => (
								<div key={game.id} className="rounded-lg border p-3 sm:p-4 transition-colors hover:bg-muted/50">
									<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
										<div className="text-center sm:text-left">
											<span className="font-medium text-sm sm:text-base">{game.venueName}</span>
										</div>
										<div className="text-center">
											<span className="font-medium text-sm sm:text-base">
												{game.winnerTeam.map((player) => player.name).join(", ")} vs {game.playerTeam.map((player) => player.name).join(", ")}
											</span>
										</div>
										<div className="flex flex-col items-center">
											<Badge variant="secondary" className="text-xl">
												{game.score}
											</Badge>
											<span className="text-xs sm:text-sm text-muted-foreground mt-3">{game.playedDate}</span>
											{game.playerApproved && game.winnerApproved && (
												<Badge variant="outline" className="text-xs bg-primary">
													Approved
												</Badge>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
