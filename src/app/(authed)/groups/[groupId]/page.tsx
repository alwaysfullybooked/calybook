import { InviteLink } from "@/components/client/groups/invite";
import { AddGame } from "@/components/client/openscor/games";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/server";
import type { MatchType } from "@openscor-com/sdk-node";
import { Gamepad2, Info, Link, Trophy, User, Users } from "lucide-react";
import { redirect } from "next/navigation";

interface GroupDetailPageProps {
  params: Promise<{ groupId: string }>;
}

export default async function GroupDetailPage({ params }: GroupDetailPageProps) {
  const { groupId } = await params;

  const group = await api.groups.find({ groupId });

  if (!group) {
    redirect("/groups?error=group-not-found");
  }

  const members = group?.members?.map((member) => member.user) ?? [];

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
              <Badge variant="secondary" className="text-xs">
                {group.category}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
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

        {/* Tabs */}
        <Tabs defaultValue="players" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="players" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Players ({members.length})
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Group Members
                </CardTitle>
                <CardDescription>Current members of this group</CardDescription>
              </CardHeader>
              <CardContent>
                {members.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No members yet</p>
                ) : (
                  <div className="space-y-3">
                    {group?.members?.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{member.user.name || "Unknown User"}</span>
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
            {/* <AddGame
            competitionId={group.competitionId}
            category={category}
            matchType={competition.matchType as MatchType}
            venueId={venueId}
            venueName={venue.name}
            venueCountry={venue.country}
            rankings={rankings}
            userAddingId={session.user.id}
          /> */}
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
                  <Trophy className="h-5 w-5" />
                  Group Rankings
                </CardTitle>
                <CardDescription>Leaderboard and rankings for this group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
