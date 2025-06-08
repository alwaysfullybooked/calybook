// import { api } from "@/trpc/server";
import { AddTennisGame } from "@/components/client/venue/games";
import { alwaysbookbooked } from "@/lib/alwaysbookbooked";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { api } from "@/trpc/server";

export default async function GamesPage() {
  const venues = await alwaysbookbooked.venues.publicSearch("Thailand", "Chiang Mai");

  const venueGames = await api.venueGames.search({ category: "tennis", userId: true });

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-4 mb-12">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Games</h1>
          <AddTennisGame venues={venues} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-500" />
              Recent Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {venueGames.map((match) => (
                <div key={match.id} className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${match.winnerId}`} />
                        <AvatarFallback>{match.winnerId.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{match.winnerName}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-xl font-medium">{match.score}</span>
                      <span className="text-sm text-muted-foreground">{match.playedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{match.playerName}</span>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${match.playerId}`} />
                        <AvatarFallback>{match.playerId.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">{match.isCloseMatch && <Badge variant="outline">Close Match</Badge>}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
