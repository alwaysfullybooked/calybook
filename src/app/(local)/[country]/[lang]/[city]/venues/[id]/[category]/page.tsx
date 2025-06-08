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

  return (
    <div className="px-2 py-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-2 mb-6 sm:mb-12">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">{venue.name}</h1>
        <h2 className="text-lg font-bold tracking-tight sm:text-xl md:text-2xl capitalize">{category} Rankings</h2>
      </div>

      <main className="container mx-auto px-2 py-4 sm:px-4 sm:py-8">
        <Tabs defaultValue="rankings" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="rankings" className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
              Rankings
            </TabsTrigger>
            <TabsTrigger value="matches" className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              Recent Matches
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rankings">
            <Card>
              <CardHeader className="px-3 py-4 sm:px-6 sm:py-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                  Rankings
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <div className="space-y-3 sm:space-y-4">
                  {venueRankings.map((ranking) => (
                    <div key={ranking.id} className="flex items-center justify-center gap-4 rounded-lg border p-3 sm:p-4 transition-colors hover:bg-muted/50">
                      {/* <div className="flex items-center justify-between gap-4"> */}
                      {/* <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-muted">
                          {index === 0 ? (
                            <Medal className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                          ) : index === 1 ? (
                            <Medal className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          ) : index === 2 ? (
                            <Medal className="h-4 w-4 sm:h-5 sm:w-5 text-amber-700" />
                          ) : (
                            <span className="text-xs sm:text-sm font-medium">{index + 1}</span>
                          )}
                        </div> */}
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://avatar.vercel.sh/${ranking.userId}`} />
                        <AvatarFallback>{ranking.userId.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm sm:text-base">***** ********</p>
                        <Badge variant="secondary" className="flex items-center gap-1 text-xs sm:text-sm">
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                          {ranking.currentPoints} pts
                        </Badge>
                        {/* <p className="text-xs sm:text-sm text-muted-foreground mt-3">Joined {ranking.joinedDate}</p> */}
                      </div>
                      {/* </div> */}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matches">
            <Card>
              <CardHeader className="px-3 py-4 sm:px-6 sm:py-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                  Recent Matches
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <div className="space-y-3 sm:space-y-4">
                  {venueMatches.map((match) => (
                    <div key={match.id} className="rounded-lg border p-3 sm:p-4 transition-colors hover:bg-muted/50">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2 justify-center">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://avatar.vercel.sh/${match.winnerId}`} />
                            <AvatarFallback>{match.winnerId.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm sm:text-base">***** ********</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Badge variant="secondary" className="text-xl">
                            {match.score}
                          </Badge>
                          <span className="text-xs sm:text-sm text-muted-foreground">{match.playedDate}</span>
                        </div>
                        <div className="flex items-center gap-2 justify-center">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://avatar.vercel.sh/${match.playerId}`} />
                            <AvatarFallback>{match.playerId.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm sm:text-base">***** ********</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                        {match.isCloseMatch && (
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
