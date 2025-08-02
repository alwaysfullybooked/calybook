import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Ranking } from "@/lib/openscor";

export default function RankingsList({ rankings, title }: { rankings: Ranking[]; title: string }) {
	return (
		<Card>
			<CardHeader className="px-3 py-4 sm:px-6 sm:py-6">
				<CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl">
					<Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent className="px-3 sm:px-6">
				<div className="space-y-3 sm:space-y-4">
					{rankings.map((pr, index) => (
						<Card key={pr.id} className="hover:shadow-md transition-shadow max-w-lg mx-auto">
							<CardContent className="px-3 sm:px-6">
								<div className="grid grid-cols-3 items-center justify-center gap-3">
									<div className="flex items-center gap-2 col-span-2">
										<div className="w-8 h-8 flex items-center justify-center bg-muted rounded-full">
											<span className="font-bold">{index + 1}</span>
										</div>
										<p className="font-medium capitalize text-sm sm:text-base">{pr.playerName}</p>
									</div>

									<div className="text-right">
										<p className="font-bold text-lg">{pr?.masteryScore?.toFixed(2)}</p>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
