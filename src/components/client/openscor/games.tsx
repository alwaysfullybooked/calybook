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

const formSchema = z.object({
  category: z.nativeEnum(Categories),
  winnerId: z.string().min(1, "Winner is required"),
  winnerName: z.string().min(1, "Winner name is required"),
  playerId: z.string().min(1, "Player is required"),
  playerName: z.string().min(1, "Player name is required"),
  score: z.string().min(1, "Score is required"),
  playedDate: z.string().min(1, "Played date is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function AddTennisGame({ venueId, venueName, rankings }: { venueId: string; venueName: string; rankings: Ranking[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      category: "tennis" as Category,
      winnerId: "",
      winnerName: "",
      playerId: "",
      playerName: "",
      score: "",
      playedDate: new Date().toISOString().split("T")[0],
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      await createOpenScorGame({ ...data, venueId, venueName });
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
                  <Select
                    onValueChange={(value) => {
                      const selectedWinner = rankings.find((ranking) => ranking.id === value);
                      field.onChange(value);
                      form.setValue("winnerName", selectedWinner?.playerName ?? "");
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a winner" className="truncate" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rankings.map((ranking) => (
                        <SelectItem key={ranking.id} value={ranking.id}>
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
                      const selectedPlayer = rankings.find((ranking) => ranking.id === value);
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
                      {rankings.map((ranking) => (
                        <SelectItem key={ranking.id} value={ranking.id}>
                          {ranking.playerName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-2 items-center">
              <FormField
                control={form.control}
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Score (Format: X-X X-X)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 items-center">
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
            </div>
            <SubmitButton type="submit">Submit</SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
