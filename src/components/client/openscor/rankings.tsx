"use client";

import { joinVenueRankings } from "@/actions/openscor/rankings";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Categories, type Category } from "@/server/db/schema";
import { Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface JoinVenueButtonProps {
  country: string;
  lang: string;
  city: string;
  venueId: string;
  competitionId: string;
  category: Category;
  playerId: string;
  playerName: string;
  playerContactMethod: string;
  playerContactId: string;
  playerEmailId: string;
  ranking: boolean;
}

export function JoinRankingsButton({
  country,
  lang,
  city,
  venueId,
  competitionId,
  category,
  playerId,
  playerName,
  playerContactMethod,
  playerContactId,
  playerEmailId,
  ranking,
}: JoinVenueButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const categories = Object.values(Categories) as unknown as Category[];

  const handleJoin = async () => {
    if (!category) {
      return;
    }

    try {
      setIsLoading(true);
      await joinVenueRankings({ country, lang, city, venueId, competitionId, category, playerId, playerName, playerContactMethod, playerContactId, playerEmailId, ranking });
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error joining venue:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2 bg-primary">
          <Trophy className="h-4 w-4" />
          Join Competition
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Venue Rankings</DialogTitle>
          <DialogDescription>Join this venue's rankings to track your progress and compete with other players. You'll start with 300 Mastery Score.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} disabled>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    <span className="capitalize">{cat}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleJoin} disabled={isLoading || !category}>
            {isLoading ? "Joining..." : "Join Rankings"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
