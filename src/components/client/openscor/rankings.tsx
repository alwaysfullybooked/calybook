"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { joinVenueRankings } from "@/actions/openscor/rankings";
import { Categories, type Category } from "@/server/db/schema";

interface JoinVenueButtonProps {
  country: string;
  lang: string;
  city: string;
  venueId: string;
  venueName: string;
  playerId: string;
  playerName: string;
  playerContactMethod: string;
  playerContactId: string;
  playerEmailId: string;
}

export function JoinRankingsButton({ country, lang, city, venueId, venueName, playerId, playerName, playerContactMethod, playerContactId, playerEmailId }: JoinVenueButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState<Category | "">("");
  const router = useRouter();

  const categories = Object.values(Categories) as unknown as Category[];

  const handleJoin = async () => {
    if (!category) {
      return;
    }

    try {
      setIsLoading(true);
      await joinVenueRankings({ country, lang, city, venueId, venueName, category, playerId, playerName, playerContactMethod, playerContactId, playerEmailId });
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
          Join Rankings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Venue Rankings</DialogTitle>
          <DialogDescription>Join this venue's rankings to track your progress and compete with other players. You'll start with 1000 challenge points.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category">Select Your Category</Label>
            <Select value={category} onValueChange={(value: Category) => setCategory(value)}>
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
