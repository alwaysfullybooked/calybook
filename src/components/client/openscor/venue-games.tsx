"use client";

import { createOpenScorGame } from "@/actions/openscor/games";
import { SubmitButton } from "@/components/client/submit-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Ranking } from "@/lib/openscor";
import type { Category, MatchType } from "@/server/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { Resolver } from "react-hook-form";

// Schema for singles matches
const singlesSchema = z.object({
  matchType: z.literal("singles"),
  winnerTeam: z
    .array(
      z.object({
        id: z.string().min(1, "Winner is required"),
        name: z.string().min(1, "Winner name is required"),
      }),
    )
    .length(1),
  playerTeam: z
    .array(
      z.object({
        id: z.string().min(1, "Player is required"),
        name: z.string().min(1, "Player name is required"),
      }),
    )
    .length(1),
  score: z
    .string()
    .min(1, "Score is required")
    .regex(/^[0-9]+-[0-9]+(?:\s+[0-9]+-[0-9]+){0,2}$/, "No commas, score must be in X-X with spaces"),
  playedDate: z.string().min(1, "Played date is required"),
});

// Schema for doubles matches
const doublesSchema = z.object({
  matchType: z.literal("doubles"),
  winnerTeam: z
    .array(
      z.object({
        id: z.string().min(1, "Winner is required"),
        name: z.string().min(1, "Winner name is required"),
      }),
    )
    .length(2),
  playerTeam: z
    .array(
      z.object({
        id: z.string().min(1, "Player is required"),
        name: z.string().min(1, "Player name is required"),
      }),
    )
    .length(2),
  score: z
    .string()
    .min(1, "Score is required")
    .regex(/^[0-9]+-[0-9]+(?:\s+[0-9]+-[0-9]+){0,2}$/, "No commas, score must be in X-X with spaces"),
  playedDate: z.string().min(1, "Played date is required"),
});

// Schema for team matches
const teamSchema = z.object({
  matchType: z.literal("team"),
  winnerTeam: z
    .array(
      z.object({
        id: z.string().min(1, "Winner team is required"),
        name: z.string().min(1, "Winner team name is required"),
      }),
    )
    .length(5),
  playerTeam: z
    .array(
      z.object({
        id: z.string().min(1, "Player team is required"),
        name: z.string().min(1, "Player team name is required"),
      }),
    )
    .length(5),
  score: z
    .string()
    .min(1, "Score is required")
    .regex(/^[0-9]+-[0-9]+(?:\s+[0-9]+-[0-9]+){0,2}$/, "No commas, score must be in X-X with spaces"),
  playedDate: z.string().min(1, "Played date is required"),
});

// Union schema for all match types
const gameSchema = z.discriminatedUnion("matchType", [singlesSchema, doublesSchema, teamSchema]);

type FormValues = z.infer<typeof gameSchema>;

export function AddVenueGame({
  competitionId,
  category,
  matchType,
  venueId,
  rankings,
  userAddingId,
}: {
  competitionId: string;
  matchType: MatchType;
  category: Category;
  venueId: string;
  rankings: Ranking[];
  userAddingId: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(gameSchema) as Resolver<FormValues>,
    defaultValues: (() => {
      const userRanking = rankings.find((r) => r.playerId === userAddingId);
      const userName = userRanking?.playerName ?? "UNKNOWN";

      if (matchType === "singles") {
        return {
          matchType: "singles" as const,
          winnerTeam: [{ id: userAddingId, name: userName }],
          playerTeam: [],
          score: "",
          playedDate: new Date().toISOString().split("T")[0],
        };
      }
      if (matchType === "doubles") {
        return {
          matchType: "doubles" as const,
          winnerTeam: [{ id: userAddingId, name: userName }],
          playerTeam: [],
          score: "",
          playedDate: new Date().toISOString().split("T")[0],
        };
      }
      // team
      return {
        matchType: "team" as const,
        winnerTeam: [{ id: userAddingId, name: `${userName}'s Team` }],
        playerTeam: [],
        score: "",
        playedDate: new Date().toISOString().split("T")[0],
      };
    })(),
  });

  async function onSubmit(data: FormValues) {
    try {
      const payload = {
        ...data,
        competitionId,
        category,
        matchType,
        venueId,
      };
      await createOpenScorGame(payload);
      toast.success(`${category} game created successfully`);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to create ${category} game`);
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
            {matchType === "singles" && (
              <>
                <FormField
                  control={form.control}
                  name="winnerTeam.0.id"
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
                  name="playerTeam.0.id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const selectedPlayer = rankings.find((ranking) => ranking.playerId === value);
                          field.onChange(value);
                          form.setValue("playerTeam.0.name", selectedPlayer?.playerName ?? "UNKNOWN");
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
                            .filter((ranking) => ranking.playerId !== form.getValues("winnerTeam.0.id"))
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
              </>
            )}
            {matchType === "doubles" && (
              <>
                <FormField
                  control={form.control}
                  name="winnerTeam.0.id"
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
                  name="winnerTeam.1.id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Winner Partner</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const selectedPlayer = rankings.find((ranking) => ranking.playerId === value);
                          field.onChange(value);
                          form.setValue("winnerTeam.1.name", selectedPlayer?.playerName ?? "UNKNOWN");
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a winner partner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rankings
                            .filter((ranking) => ranking.playerId !== form.getValues("winnerTeam.0.id"))
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
                  name="playerTeam.0.id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const selectedPlayer = rankings.find((ranking) => ranking.playerId === value);
                          field.onChange(value);
                          form.setValue("playerTeam.0.name", selectedPlayer?.playerName ?? "UNKNOWN");
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
                            .filter((ranking) => ranking.playerId !== form.getValues("winnerTeam.0.id") && ranking.playerId !== form.getValues("winnerTeam.1.id"))
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
                  name="playerTeam.1.id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player Partner</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const selectedPlayer = rankings.find((ranking) => ranking.playerId === value);
                          field.onChange(value);
                          form.setValue("playerTeam.1.name", selectedPlayer?.playerName ?? "UNKNOWN");
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a player partner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rankings
                            .filter(
                              (ranking) =>
                                ranking.playerId !== form.getValues("winnerTeam.0.id") &&
                                ranking.playerId !== form.getValues("winnerTeam.1.id") &&
                                ranking.playerId !== form.getValues("playerTeam.0.id"),
                            )
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
              </>
            )}
            {matchType === "team" && (
              <>
                <FormField
                  control={form.control}
                  name="winnerTeam.0.id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Winner Team</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const selectedPlayer = rankings.find((ranking) => ranking.playerId === value);
                          field.onChange(value);
                          form.setValue("winnerTeam.0.name", `${selectedPlayer?.playerName ?? "UNKNOWN"}'s Team`);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select winner team" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rankings.map((ranking) => (
                            <SelectItem key={ranking.playerId} value={ranking.playerId}>
                              {ranking.playerName}'s Team
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
                  name="playerTeam.0.id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player Team</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const selectedPlayer = rankings.find((ranking) => ranking.playerId === value);
                          field.onChange(value);
                          form.setValue("playerTeam.0.name", `${selectedPlayer?.playerName ?? "UNKNOWN"}'s Team`);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select player team" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rankings
                            .filter((ranking) => ranking.playerId !== form.getValues("winnerTeam.0.id"))
                            .map((ranking) => (
                              <SelectItem key={ranking.playerId} value={ranking.playerId}>
                                {ranking.playerName}'s Team
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
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
