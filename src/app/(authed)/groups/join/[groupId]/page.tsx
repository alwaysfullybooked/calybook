import { JoinGroupForm } from "@/components/client/groups/join";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { Users } from "lucide-react";
import { redirect } from "next/navigation";

interface JoinGroupPageProps {
  params: Promise<{ groupId: string }>;
}

export default async function JoinGroupPage({ params }: JoinGroupPageProps) {
  const { groupId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/groups/join/${groupId}`);
  }

  try {
    const group = await api.groups.find({ groupId });

    if (!group) {
      redirect("/groups?error=group-not-found");
    }

    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Join Group
              </CardTitle>
              <CardDescription>You've been invited to join this group.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{group.name}</h3>
                  {group.description && <p className="text-sm text-muted-foreground mt-1">{group.description}</p>}
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {group.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Created {new Date(group.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <JoinGroupForm groupId={groupId} groupName={group.name} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch {
    redirect("/groups?error=invalid-group");
  }
}
