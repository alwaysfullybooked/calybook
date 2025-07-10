import { Calendar, Trophy } from "lucide-react";
import { redirect } from "next/navigation";
import { ApproveGameButton } from "@/components/client/openscor/approve";
import { JoinRankingsButton } from "@/components/client/openscor/rankings";
import { AddVenueGame } from "@/components/client/openscor/venue-games";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { alwaysfullybooked } from "@/lib/alwaysfullybooked";
import { openscor } from "@/lib/openscor";
import { auth } from "@/server/auth";
import type { Category, MatchType } from "@/server/db/schema";
import { api } from "@/trpc/server";

export default async function VenueRankingsPage({ params }: { params: Promise<{ country: string; lang: string; city: string; venueId: string; competitionId: string }> }) {
  const { country, lang, city, venueId, competitionId } = await params;

  const session = await auth();

  if (!session?.user?.email || !session?.user?.id) {
    redirect(`/login?callbackUrl=/${country}/${lang}/${city}/venues/${venueId}/competitions/${competitionId}`);
  }

  const [venue, venueMembers, competition] = await Promise.all([alwaysfullybooked.venues.publicFind({ venueId }), api.venueMembers.search({ venueId }), openscor.competitions.find({ competitionId })]);

  if (!venue) {
    return <div>Venue not found</div>;
  }

  if (!competition) {
    return <div>Competition not found</div>;
  }

  const customerName = session.user.name ?? session.user.email;
  const customerEmailId = session.user.email;

  const venueMemberIds = venueMembers.map((vm) => vm.playerId);

  const [myRanking, leaderboard, games] = await Promise.all([
    openscor.leaderboards.find({ competitionId, playerId: session.user.id }),
    openscor.leaderboards.search({ competitionId, playerIds: venueMemberIds }),
    openscor.games.search({ competitionId, venueId }),
  ]);

  const pendingGames = games.filter((game) => game.status === "pending" && [...game.winnerTeam.map((player) => player.id), ...game.playerTeam.map((player) => player.id)].includes(session.user.id));
  const approvedGames = games.filter((game) => game.status === "approved");

  const playedRankings = leaderboard.filter((pr) => pr?.matchCount && pr.matchCount > 0);
  const unplayedRankings = leaderboard.filter((pr) => pr?.matchCount === 0);
  const isMember = venueMemberIds.includes(session.user.id);

  return (
    <div className="px-2 py-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-2 mb-6 sm:mb-12">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{venue.name}</h1>
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl capitalize">{competition?.name}</h2>
      </div>

      {competitionId && (
        <div className="text-center space-y-2 mb-6 sm:mb-12">
          <h2 className="font-bold tracking-tight capitalize text-lg">
            {competition.category}, {competition.matchType} Rankings
          </h2>
          {!isMember && venue.allowRankings && (
            <JoinRankingsButton
              country={country}
              lang={lang}
              city={city}
              venueId={venueId}
              competitionId={competitionId}
              category={competition.category as Category}
              playerId={session.user.id}
              playerName={customerName}
              playerContactMethod="email"
              playerContactId={customerEmailId}
              playerEmailId={customerEmailId}
              addToLeaderboard={!myRanking}
              addToVenue={!isMember}
            />
          )}
        </div>
      )}

      {isMember && competition?.matchType && (
        <div className="text-center space-y-2 mb-6 sm:mb-12">
          <h2 className="text-lg font-bold tracking-tight sm:text-xl md:text-2xl capitalize">Just Played?</h2>
          <AddVenueGame
            competitionId={competitionId}
            category={competition.category as Category}
            matchType={competition.matchType as MatchType}
            venueId={venueId}
            rankings={leaderboard}
            userAddingId={session.user.id}
          />
          <p className="text-sm text-muted-foreground">Winner adds final score. Player approves.</p>
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
                        <span className="font-medium text-sm sm:text-base">{game.winnerTeam.map((player) => player.name).join(", ")}</span>
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
                        {game.winnerTeam.map((player) => player.id).includes(session.user.id) && !game.winnerApproved && (
                          <div className="mt-2">
                            <ApproveGameButton gameId={game.id} approvedBy={session.user.id} />
                          </div>
                        )}

                        {game.playerTeam.map((player) => player.id).includes(session.user.id) && !game.playerApproved && (
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
                        <span className="font-medium text-sm sm:text-base">{game.playerTeam.map((player) => player.name).join(", ")}</span>
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
                                <p className="font-bold text-lg">{pr?.masteryScore?.toFixed(2)}</p>
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
                                <p className="font-bold text-lg">{pr?.masteryScore?.toFixed(2)}</p>
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
                            {game.winnerTeam.map((player) => player.name).join(", ")} vs {game.playerTeam.map((player) => player.name).join(", ")}
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
