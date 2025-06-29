"use client";

import { joinGroup } from "@/actions/groups";
import { Button } from "@/components/ui/button";
import type { Category } from "@/server/db/schema";
import { Check, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface JoinGroupFormProps {
  groupId: string;
  groupName: string;
  category: Category;
  playerId: string;
  playerName: string;
  playerContactMethod: string;
  playerContactId: string;
  playerEmailId: string;
  ranking: boolean;
}

export function JoinGroupForm({ groupId, groupName, category, playerId, playerName, playerContactMethod, playerContactId, playerEmailId, ranking }: JoinGroupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    setIsLoading(true);
    try {
      await joinGroup({
        groupId,
        category,
        playerId,
        playerName,
        playerContactMethod,
        playerContactId,
        playerEmailId,
        ranking,
      });
      setHasJoined(true);
      toast.success(`Successfully joined ${groupName}!`);

      // Redirect to groups page after a short delay
      setTimeout(() => {
        router.push("/groups");
      }, 1500);
    } catch (error) {
      console.error("Error joining group:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error joining group");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (hasJoined) {
    return (
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Welcome to {groupName}!</h3>
          <p className="text-sm text-muted-foreground">You've successfully joined the group. Redirecting to your groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">Click the button below to join this group and start participating in activities.</p>
      </div>

      <Button onClick={handleJoin} disabled={isLoading} className="w-full" size="lg">
        {isLoading ? (
          <>
            <Users className="h-4 w-4 mr-2 animate-pulse" />
            Joining...
          </>
        ) : (
          <>
            <Users className="h-4 w-4 mr-2" />
            Join {groupName}
          </>
        )}
      </Button>
    </div>
  );
}
