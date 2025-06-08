import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { api } from "@/trpc/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, TrendingUp, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { alwaysbookbooked } from "@/lib/alwaysbookbooked";

export default async function VenueRankingsPage({ params }: { params: Promise<{ country: string; lang: string; city: string; id: string; category: string }> }) {
  const { country, lang, city, id, category } = await params;

  const session = await auth();

  if (!session?.user?.email) {
    redirect(`/login?callbackUrl=/${country}/${lang}/${city}/venues/${id}/${category}`);
  }

  const venue = await alwaysbookbooked.venues.publicFind(id);

  if (!venue) {
    return <div>Venue not found</div>;
  }

  const rankings = await api.venueRankings.search();
  const matches = await api.venueGames.search({ venueId: id });

  // Filter rankings for this venue and category
  const venueRankings = rankings.filter((r) => r.venueId === id && r.category === category).sort((a, b) => b.currentPoints - a.currentPoints);

  // Filter matches for this venue and category
  const venueMatches = matches.filter((m) => m.venueId === id && m.category === category);

  console.log(venueRankings);
  console.log(venueMatches);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{venue.name}</h1>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl capitalize">{category} Rankings</h2>
      </div>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="rankings" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="rankings" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Rankings
            </TabsTrigger>
            <TabsTrigger value="matches" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Recent Matches
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rankings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  Rankings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {venueRankings.map((ranking, index) => (
                    <div key={ranking.id} className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          {index === 0 ? (
                            <Medal className="h-5 w-5 text-yellow-500" />
                          ) : index === 1 ? (
                            <Medal className="h-5 w-5 text-gray-400" />
                          ) : index === 2 ? (
                            <Medal className="h-5 w-5 text-amber-700" />
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        <Avatar>
                          <AvatarImage src={`https://avatar.vercel.sh/${ranking.userId}`} />
                          <AvatarFallback>{ranking.userId.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{ranking.userId}</p>
                          <p className="text-sm text-muted-foreground">Joined {ranking.joinedDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          {ranking.currentPoints} pts
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matches">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-blue-500" />
                  Recent Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {venueMatches.map((match) => (
                    <div key={match.id} className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://avatar.vercel.sh/${match.winnerId}`} />
                            <AvatarFallback>{match.winnerId.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{match.winnerId}</span>
                        </div>
                        <Badge variant="secondary">{match.score}</Badge>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://avatar.vercel.sh/${match.playerId}`} />
                            <AvatarFallback>{match.playerId.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{match.playerId}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                        <span>{match.playedDate}</span>
                        {match.isCloseMatch && <Badge variant="outline">Close Match</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
