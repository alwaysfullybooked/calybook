import { AddVenueDialog } from "@/components/client/groups/add-venue";
import { InviteLink } from "@/components/client/groups/invite";
import { AddGroupGame } from "@/components/client/openscor/group-games";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { alwaysfullybooked } from "@/lib/alwaysfullybooked";
import { openscor } from "@/lib/openscor";
import { auth } from "@/server/auth";
import type { Category, MatchType } from "@/server/db/schema";
import { api } from "@/trpc/server";
import { Gamepad2, Info, Link, Store, Trophy, User, Users } from "lucide-react";
import { redirect } from "next/navigation";

interface GroupDetailPageProps {
  params: Promise<{ groupId: string }>;
}

export default async function GroupDetailPage({ params }: GroupDetailPageProps) {
  const { groupId } = await params;

  const session = await auth();

  const [group, groupMembers] = await Promise.all([api.groups.find({ groupId }), api.groups.searchMembers({ groupId })]);

  if (!group) {
    redirect("/groups?error=group-not-found");
  }

  const memberIds = groupMembers.map((member) => member.userId);

  const [venues, playerRankings, competition] = await Promise.all([
    alwaysfullybooked.venues.publicSearch({
      country: "Belgium",
      city: "Brussels",
    }),
    openscor.leaderboards.search({
      competitionId: group.competitionId,
      playerIds: memberIds,
    }),
    openscor.competitions.find({ competitionId: group.competitionId }),
  ]);

  const groupVenues = group?.venues ?? [];

  const playedRankings = playerRankings.filter((pr) => pr?.matchCount && pr.matchCount > 0);
  const unplayedRankings = playerRankings.filter((pr) => pr?.matchCount === 0);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Group Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {group.name}
            </CardTitle>
            <CardDescription>{group.description || "No description provided"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs capitalize">
                {group.category}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="players" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="players" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Players ({groupMembers.length})
            </TabsTrigger>
            <TabsTrigger value="venues" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Venues ({groupVenues.length})
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" />
              Games
            </TabsTrigger>
            {/* <TabsTrigger value="rankings" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Rankings
            </TabsTrigger> */}
          </TabsList>

          {/* Players Tab */}
          <TabsContent value="players" className="space-y-4">
            <div className="flex justify-start my-4">
              <InviteLink
                groupId={groupId}
                groupName={group.name ?? ""}
                trigger={
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    Invite
                  </Button>
                }
              />
            </div>

            {groupMembers.length === 0 && <p className="text-muted-foreground text-center py-4">No members yet</p>}

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
                              <p className="font-bold text-lg">{pr.masteryScore?.toFixed(2)}</p>
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
                              <p className="font-bold text-lg">{pr.masteryScore?.toFixed(2)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Invitation Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  How to Join This Group
                </CardTitle>
                <CardDescription>Invitation required to join this group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Invitation Required</p>
                    <p className="text-sm text-muted-foreground">To join this group, you need an invitation link from an existing member. Contact a group member to get invited.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Venues Tab */}
          <TabsContent value="venues" className="space-y-4">
            <div className="flex justify-start my-4">
              <AddVenueDialog groupId={groupId} venues={venues} />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Group Venues
                </CardTitle>
                <CardDescription>Current venues of this group, where games are played</CardDescription>
              </CardHeader>
              <CardContent>
                {venues.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No venues yet</p>
                ) : (
                  <div className="space-y-3">
                    {groupVenues.map((venue) => (
                      <div key={venue.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{venue.venueName}</span>
                        <span className="text-muted-foreground">{venue.venueCountry}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Invitation Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Join This Group
                </CardTitle>
                <CardDescription>Invitation required to join this group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Invitation Required</p>
                    <p className="text-sm text-muted-foreground">To join this group, you need an invitation link from an existing member. Contact a group member to get invited.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Games Tab */}
          <TabsContent value="games" className="space-y-4">
            <div className="flex justify-start my-4">
              {session?.user.id && (
                <AddGroupGame
                  groupId={groupId}
                  competitionId={group.competitionId}
                  category={group.category as Category}
                  matchType={competition?.matchType as MatchType}
                  venues={groupVenues}
                  rankings={playerRankings}
                  userAddingId={session.user.id}
                />
              )}
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5" />
                  Group Games
                </CardTitle>
                <CardDescription>Track games and matches within this group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Games Yet</h3>
                  <p className="text-muted-foreground mb-4">Games and matches played within this group will appear here.</p>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rankings Tab */}
          <TabsContent value="rankings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Group Rankings
                </CardTitle>
                <CardDescription>Leaderboard and rankings for this group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Rankings Yet</h3>
                  <p className="text-muted-foreground mb-4">Group rankings and leaderboards will appear here once games are played.</p>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
