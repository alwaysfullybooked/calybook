"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createOpenScorGame } from "@/actions/openscor/games";
import { useRouter } from "next/navigation";
import { type users, type Category, Categories } from "@/server/db/schema";
import { SubmitButton } from "@/components/client/submit-button";
import type { Ranking } from "@/lib/openscor";
export type User = typeof users.$inferSelect;

import type { Resolver } from "react-hook-form";

const formSchema = z
  .object({
    category: z.nativeEnum(Categories),
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

export function AddGame({ venueId, venueName, rankings, userAddingId }: { venueId: string; venueName: string; rankings: Ranking[]; userAddingId: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      category: "tennis" as Category,
      winnerId: userAddingId,
      winnerName: rankings.find((r) => r.playerId === userAddingId)?.playerName ?? "",
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

      await createOpenScorGame({
        venueId,
        venueName,
        category: data.category,
        winnerId: data.winnerId,
        winnerName: data.winnerName,
        playerId: data.playerId,
        playerName: data.playerName,
        score: data.score,
        playedDate: data.playedDate,
      });
      toast.success("Tennis game created successfully");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create tennis game");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Tennis Game</Button>
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
                      form.setValue("playerName", selectedPlayer?.playerName ?? "");
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
                  <FormLabel>Score (No commas for score, format X-X with spaces)</FormLabel>
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
