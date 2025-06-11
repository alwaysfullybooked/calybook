import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { openscor } from "@/lib/openscor";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <span className="font-medium text-sm sm:text-base">{game.venueName}</span>
                    <div className="flex items-center gap-2 justify-center">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${game.winnerId}`} />
                        <AvatarFallback>{game.winnerId.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm sm:text-base">{game.winnerName}</span>
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
                    <div className="flex items-center gap-2 justify-center">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${game.playerId}`} />
                        <AvatarFallback>{game.playerId.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm sm:text-base">{game.playerName}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                    {game.isCloseMatch && (
                      <Badge variant="outline" className="text-xs">
                        Close Match
                      </Badge>
                    )}
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
