import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/server/auth";
import { Calendar, ExternalLink, Trophy } from "lucide-react";
import { redirect } from "next/navigation";

import { ApproveGameButton } from "@/components/client/openscor/approve";
import { AddGame } from "@/components/client/openscor/games";
import { JoinRankingsButton } from "@/components/client/openscor/rankings";
import { alwaysfullybooked } from "@/lib/alwaysfullybooked";
import { openscor } from "@/lib/openscor";
import type { Category, MatchType } from "@/server/db/schema";

export default async function VenueRankingsPage({ params }: { params: Promise<{ country: string; lang: string; city: string; venueId: string; category: Category }> }) {
  const { country, lang, city, venueId, category } = await params;

  const session = await auth();

  if (!session?.user?.email) {
    redirect(`/login?callbackUrl=/${country}/${lang}/${city}/venues/${venueId}/rankings/${category}`);
  }

  const venue = await alwaysfullybooked.venues.publicFind({ venueId });

  if (!venue) {
    return <div>Venue not found</div>;
  }

  const customerName = session.user.name ?? session.user.email;
  const customerEmailId = session.user.email;

  const competitionId = venue?.competitions?.[category as keyof typeof venue.competitions] ?? "";

  const [competition, leaderboard, playerRankings, games] = await Promise.all([
    openscor.competitions.find({ competitionId }),
    openscor.leaderboards.find({ category, playerId: session.user.id }),
    openscor.venuePlayers.search({ venueId }),
    openscor.games.search({ venueId, category }),
  ]);

  const playerRanking = playerRankings.find((pr) => pr?.playerId === session.user.id);
  const rankings = playerRankings.map((pr) => pr?.ranking).filter((r) => r !== null);

  const pendingGames = games.filter((game) => game.status === "pending" && [game.winnerId, game.playerId].includes(session.user.id));
  const approvedGames = games.filter((game) => game.status === "approved");

  const playedRankings = playerRankings.filter((pr) => pr?.ranking?.matchCount && pr.ranking.matchCount > 0);
  const unplayedRankings = playerRankings.filter((pr) => pr?.ranking?.matchCount === 0);

  return (
    <div className="px-2 py-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-2 mb-6 sm:mb-12">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{venue.name}</h1>
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl capitalize">{category} Rankings</h2>
      </div>

      {competitionId && (
        <div className="text-center space-y-2 mb-6 sm:mb-12">
          {!playerRanking && venue.allowRankings && (
            <JoinRankingsButton
              country={country}
              lang={lang}
              city={city}
              venueId={venueId}
              playerId={session.user.id}
              playerName={customerName}
              playerContactMethod="email"
              playerContactId={customerEmailId}
              playerEmailId={customerEmailId}
              ranking={!!leaderboard}
            />
          )}
          <h2 className="font-bold tracking-tight capitalize text-lg">
            <a href={`https://www.openscor.com/competitions/${competition?.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              Open <span className="underline">{competition?.name}</span>
              <ExternalLink className="h-5 w-5" />
            </a>
          </h2>
        </div>
      )}

      {playerRanking && competition?.matchType && (
        <div className="text-center space-y-2 mb-6 sm:mb-12">
          <h2 className="text-lg font-bold tracking-tight sm:text-xl md:text-2xl capitalize">Just Played?</h2>

          <AddGame
            competitionId={competitionId}
            category={category}
            matchType={competition.matchType as MatchType}
            venueId={venueId}
            venueName={venue.name}
            venueCountry={venue.country}
            rankings={rankings}
            userAddingId={session.user.id}
          />
        </div>
      )}

      {pendingGames.length > 0 && (
        <div className="text-center space-y-2 mb-6 sm:mb-12">
          <Card>
            <CardHeader className="px-3 py-4 sm:px-6 sm:py-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                Games to be approved
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <div className="space-y-3 sm:space-y-4">
                {pendingGames.map((game) => (
                  <div key={game.id} className="rounded-lg border p-3 sm:p-4 transition-colors hover:bg-muted/50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-2 justify-center">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://avatar.vercel.sh/${game.winnerId}`} />
                          <AvatarFallback>{game.winnerId.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm sm:text-base">{game.winnerName}</span>
                        {game.winnerApproved && !game.playerApproved && (
                          <Badge variant="outline" className="text-xs bg-primary">
                            Approved
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-col items-center">
                        <Badge variant="secondary" className="text-xl">
                          {game.score}
                        </Badge>
                        <span className="text-xs sm:text-sm text-muted-foreground mt-3">{game.playedDate}</span>
                        <span className="text-xs sm:text-sm text-orange-500">Pending approval</span>
                        {session.user.id === game.winnerId && !game.winnerApproved && (
                          <div className="mt-2">
                            <ApproveGameButton gameId={game.id} approvedBy={session.user.id} />
                          </div>
                        )}

                        {session.user.id === game.playerId && !game.playerApproved && (
                          <div className="mt-2">
                            <ApproveGameButton gameId={game.id} approvedBy={session.user.id} />
                          </div>
                        )}

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
                        {game.playerApproved && !game.winnerApproved && (
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
      )}

      <main className="container mx-auto px-2 py-4 sm:px-4 sm:py-8">
        <Tabs defaultValue="rankings" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="rankings" className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
              Rankings
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              Recent Matches
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rankings">
            <div className="space-y-5">
              {playedRankings.length > 0 && (
                <Card>
                  <CardHeader className="px-3 py-4 sm:px-6 sm:py-6">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                      Rankings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-6">
                    <div className="space-y-3 sm:space-y-4">
                      {playedRankings.map((pr, index) => (
                        <Card key={pr.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="grid grid-cols-2 items-center justify-center gap-6">
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 flex items-center justify-center bg-muted rounded-full">
                                  <span className="font-bold">{index + 1}</span>
                                </div>
                                <div>
                                  <p className="font-medium">{pr.playerName}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">{pr?.ranking?.masteryScore?.toFixed(2)}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {unplayedRankings.length > 0 && (
                <Card>
                  <CardHeader className="px-3 py-4 sm:px-6 sm:py-6">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                      Not Played Yet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-6">
                    <div className="space-y-3 sm:space-y-4">
                      {unplayedRankings.map((pr, index) => (
                        <Card key={pr.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 flex items-center justify-center bg-muted rounded-full">
                                  <span className="font-bold">{index + 1}</span>
                                </div>
                                <div>
                                  <p className="font-medium">{pr.playerName}</p>
                                  {/* <p className="text-sm text-muted-foreground">{ranking.venueName}</p> */}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">{pr?.ranking?.masteryScore?.toFixed(2)}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="games">
            <Card>
              <CardHeader className="px-3 py-4 sm:px-6 sm:py-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                  Recent Games
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <div className="space-y-3 sm:space-y-4">
                  {approvedGames.map((game) => (
                    <div key={game.id} className="rounded-lg border p-3 sm:p-4 transition-colors hover:bg-muted/50">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                        <div className="text-center">
                          <span className="font-medium text-sm sm:text-base">
                            {game.winnerName} vs {game.playerName}
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Badge variant="secondary" className="text-xl">
                            {game.score}
                          </Badge>
                        </div>
                        <div className="flex flex-col items-center">
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
