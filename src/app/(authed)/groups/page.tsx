import { CreateGroupDialog } from "@/components/client/groups/create";
import { EditGroupDialog } from "@/components/client/groups/edit";
import { InviteLink } from "@/components/client/groups/invite";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { AlertCircle, Crown, Plus, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface GroupsPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function GroupsPage({ searchParams }: GroupsPageProps) {
  const session = await auth();
  const { error } = await searchParams;

  if (!session?.user?.id) {
    redirect("/login");
  }

  const groups = await api.groups.search();
  const joinedGroups = await api.groups.searchMemberGroups();

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Groups</h1>
          <CreateGroupDialog />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error === "group-not-found" && "The group you're looking for doesn't exist."}
              {error === "invalid-group" && "Invalid group link. Please check the URL and try again."}
              {error === "already-member" && "You are already a member of this group."}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Tabs defaultValue="joined" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="joined" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Groups Joined ({joinedGroups.length})
          </TabsTrigger>
          <TabsTrigger value="created" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Groups Created ({groups.length})
          </TabsTrigger>
        </TabsList>

        {/* Groups Joined Tab */}
        <TabsContent value="joined" className="space-y-4">
          {joinedGroups.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No groups joined yet</h3>
                <p className="text-muted-foreground text-center mb-4">Join groups to participate in activities with other players.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Groups You've Joined
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <div className="space-y-3 sm:space-y-4">
                  {joinedGroups.map((group) => (
                    <div key={group.id} className="rounded-lg border p-3 sm:p-4 transition-colors hover:bg-muted/50">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                        <div className="text-center sm:text-left">
                          <Link href={`/groups/${group.id}`}>
                            <span className="font-medium text-sm sm:text-base">{group.name}</span>
                          </Link>
                          {group.description && <p className="text-xs text-muted-foreground mt-1">{group.description}</p>}
                        </div>
                        <div className="flex gap-2 justify-center">
                          <Badge variant="secondary" className="text-xs capitalize">
                            {group.category}
                          </Badge>
                          {group.country && (
                            <Badge variant="secondary" className="text-xs capitalize">
                              {group.city}, {group.country}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2 justify-center">
                          <InviteLink
                            groupId={group.id}
                            groupName={group.name}
                            trigger={
                              <Button variant="outline" size="sm" className="flex items-center gap-2">
                                Invite
                              </Button>
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Groups Created Tab */}
        <TabsContent value="created" className="space-y-4">
          {groups.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No groups created yet</h3>
                <p className="text-muted-foreground text-center mb-4">Create your first group to start organizing activities with other players.</p>
                <CreateGroupDialog
                  trigger={
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Create Your First Group
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Groups You've Created
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <div className="space-y-3 sm:space-y-4">
                  {groups.map((group) => (
                    <div key={group.id} className="rounded-lg border p-3 sm:p-4 transition-colors hover:bg-muted/50">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                        <div className="text-center sm:text-left">
                          <Link href={`/groups/${group.id}`}>
                            <span className="font-medium text-sm sm:text-base">{group.name}</span>
                          </Link>
                          {group.description && <p className="text-xs text-muted-foreground mt-1">{group.description}</p>}
                        </div>
                        <div className="flex gap-2 justify-center">
                          <Badge variant="secondary" className="text-xs capitalize">
                            {group.category}
                          </Badge>
                          {group.country && (
                            <Badge variant="secondary" className="text-xs capitalize">
                              {group.city}, {group.country}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2 justify-center">
                          <InviteLink
                            groupId={group.id}
                            groupName={group.name}
                            trigger={
                              <Button variant="outline" size="sm" className="flex items-center gap-2">
                                Invite
                              </Button>
                            }
                          />
                          <EditGroupDialog
                            group={group}
                            trigger={
                              <Button variant="outline" size="sm" className="flex items-center gap-2">
                                Edit
                              </Button>
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
