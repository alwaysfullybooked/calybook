"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Check, Copy, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface InviteLinkProps {
  groupId: string;
  groupName: string;
  trigger?: React.ReactNode;
}

export function InviteLink({ groupId, groupName, trigger }: InviteLinkProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteUrl, setInviteUrl] = useState("");

  useEffect(() => {
    // Only generate URL on client side
    setInviteUrl(`${window.location.origin}/groups/${groupId}/join`);
  }, [groupId]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast.success("Invite link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy invite link");
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${groupName}`,
          text: `Join my group "${groupName}" on CalyBook!`,
          url: inviteUrl,
        });
      } catch {
        // User cancelled sharing
      }
    } else {
      // Fallback to copy
      copyToClipboard();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Invite
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Invite Friends to {groupName}
          </DialogTitle>
          <DialogDescription>Share this link with friends to invite them to join your group.</DialogDescription>
        </DialogHeader>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="invite-link" className="text-sm font-medium">
                  Invite Link
                </label>
                <div className="flex gap-2">
                  <Input id="invite-link" value={inviteUrl} readOnly className="flex-1" placeholder="Loading..." />
                  <Button variant="outline" size="icon" onClick={copyToClipboard} className="shrink-0" disabled={!inviteUrl}>
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={shareLink} className="flex-1" disabled={!navigator.share || !inviteUrl}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" onClick={copyToClipboard} className="flex-1" disabled={!inviteUrl}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">Anyone with this link can join your group. Share it via messaging apps, email, or social media.</div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
