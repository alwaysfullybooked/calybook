"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { approveOpenScorGame } from "@/actions/openscor/games";

interface ApproveGameButtonProps {
  gameId: string;
  approvedBy: string;
}

export function ApproveGameButton({ gameId, approvedBy }: ApproveGameButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    try {
      setIsLoading(true);
      await approveOpenScorGame({ gameId, approvedBy });
      toast.success("Game approved successfully");
      router.refresh();
    } catch (error) {
      console.error("Error approving game:", error);
      toast.error("Failed to approve game");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleApprove} disabled={isLoading} variant="default" size="sm">
      {isLoading ? "Approving..." : "Approve Game"}
    </Button>
  );
}
