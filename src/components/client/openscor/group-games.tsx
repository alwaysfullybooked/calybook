"use client";

import { createOpenScorGame } from "@/actions/openscor/games";
import { SubmitButton } from "@/components/client/submit-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Ranking } from "@/lib/openscor";
import type { users } from "@/server/db/schema";
import { Categories, type Category, type MatchType, MatchTypes } from "@/server/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { groupVenues } from "@/server/db/schema";
// export type User = typeof users.$inferSelect;

import type { Resolver } from "react-hook-form";

const formSchema = z
  .object({
    groupId: z.string().min(1, "Group is required"),
    competitionId: z.string().min(1, "Competition is required"),
    venueId: z.string().min(1, "Venue is required"),
    venueName: z.string().min(1, "Venue name is required"),
    venueCountry: z.string().min(1, "Venue country is required"),
    category: z.nativeEnum(Categories),
    matchType: z.nativeEnum(MatchTypes),
    winnerId: z.string().min(1, "Winner is required"),
    winnerName: z.string().min(1, "Winner name is required"),
    playerId: z.string().min(1, "Player is required"),
    playerName: z.string().min(1, "Player name is required"),
    score: z
      .string()
      .min(1, "Score is required")
      .regex(/^\d+-\d+(?:\s+\d+-\d+){0,2}$/, "No commas, score must be in X-X with spaces"),
    playedDate: z.string().min(1, "Played date is required"),
  })
  .refine((data) => data.winnerId !== data.playerId, {
    message: "Winner and player cannot be the same person",
    path: ["playerId"],
  });

type FormValues = z.infer<typeof formSchema>;

export function AddGroupGame({
  groupId,
  category,
  venues,
  rankings,
  userAddingId,
}: { groupId: string; competitionId: string; category: Category; venues: (typeof groupVenues.$inferSelect)[]; rankings: Ranking[]; userAddingId: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  console.log(rankings);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      groupId,
      venueId: "",
      category,
      winnerId: userAddingId,
      winnerName: rankings.find((r) => r.playerId === userAddingId)?.playerName ?? "UNKNOWN",
      playerId: "",
      playerName: "",
      score: "",
      playedDate: new Date().toISOString().split("T")[0],
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      // Ensure the current user is the winner
      if (data.winnerId !== userAddingId) {
        toast.error("Only the winner can add the game");
        return;
      }

      const payload = {
        ...data,
        venueId: data.venueId,
      };

      await createOpenScorGame(payload);
      toast.success("Game created successfully");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create game");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="capitalize">Add {category} Game</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Tennis Game</DialogTitle>
          <DialogDescription>Add a new tennis game record.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="venueId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const selectedVenue = venues.find((venue) => venue.id === value);
                      field.onChange(value);
                      form.setValue("venueName", selectedVenue?.venueName ?? "UNKNOWN");
                      form.setValue("venueCountry", selectedVenue?.venueCountry ?? "UNKNOWN");
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a venue" className="truncate" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {venues.map((venue) => (
                        <SelectItem key={venue.id} value={venue.id}>
                          {venue.venueName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="winnerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Winner</FormLabel>
                  <Select defaultValue={field.value} disabled={true}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a winner" className="truncate" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rankings.map((ranking) => (
                        <SelectItem key={ranking.playerId} value={ranking.playerId}>
                          {ranking.playerName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="playerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const selectedPlayer = rankings.find((ranking) => ranking.playerId === value);
                      field.onChange(value);
                      form.setValue("playerName", selectedPlayer?.playerName ?? "UNKNOWN");
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a player" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rankings
                        .filter((ranking) => ranking.playerId !== form.getValues("winnerId"))
                        .map((ranking) => (
                          <SelectItem key={ranking.playerId} value={ranking.playerId}>
                            {ranking.playerName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold mb-3">Score Format</span>
                      <span>For Tennis, format is 6-4 with spaces for sets</span>
                      <span>For Football, format is 2-1</span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., 6-4 6-3" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="playedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Played Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton type="submit">{form.formState.isSubmitting ? "Submitting..." : "Submit"}</SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
