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
          <CardContent>
            <div className="space-y-4">
              {games.map((game) => (
                <div key={game.id} className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${game.winnerId}`} />
                        <AvatarFallback>{game.winnerId.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{game.winnerName}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-xl font-medium">{game.venueName}</span>
                      <span className="text-xl font-medium">{game.score}</span>
                      <span className="text-sm text-muted-foreground">{game.playedDate}</span>

                      {game.playerApproved && game.winnerApproved && (
                        <Badge variant="outline" className="text-xs bg-primary">
                          Approved
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{game.playerName}</span>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${game.playerId}`} />
                        <AvatarFallback>{game.playerId.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">{game.isCloseMatch && <Badge variant="outline">Close Match</Badge>}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
