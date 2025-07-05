"use client";

import { createOpenScorGame } from "@/actions/openscor/games";
import { SubmitButton } from "@/components/client/submit-button";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
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
  groupId: z.string().min(1, "Group is required"),
  competitionId: z.string().min(1, "Competition is required"),
  venueId: z.string().min(1, "Venue is required"),
  venueName: z.string().min(1, "Venue name is required"),
  venueCountry: z.string().min(1, "Venue country is required"),
  category: z.nativeEnum(Categories),
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
  groupId: z.string().min(1, "Group is required"),
  competitionId: z.string().min(1, "Competition is required"),
  venueId: z.string().min(1, "Venue is required"),
  venueName: z.string().min(1, "Venue name is required"),
  venueCountry: z.string().min(1, "Venue country is required"),
  category: z.nativeEnum(Categories),
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
  groupId: z.string().min(1, "Group is required"),
  competitionId: z.string().min(1, "Competition is required"),
  venueId: z.string().min(1, "Venue is required"),
  venueName: z.string().min(1, "Venue name is required"),
  venueCountry: z.string().min(1, "Venue country is required"),
  category: z.nativeEnum(Categories),
});

// Union schema for all match types
const gameSchema = z.discriminatedUnion("matchType", [singlesSchema, doublesSchema, teamSchema]);

type FormValues = z.infer<typeof gameSchema>;

export function AddGroupGame({
  groupId,
  competitionId,
  category,
  matchType,
  venues,
  rankings,
  userAddingId,
}: {
  groupId: string;
  competitionId: string;
  category: Category;
  matchType: MatchType;
  venues: (typeof groupVenues.$inferSelect)[];
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
          groupId,
          competitionId,
          venueId: "",
          venueName: "",
          venueCountry: "",
          category,
        };
      }
      if (matchType === "doubles") {
        return {
          matchType: "doubles" as const,
          winnerTeam: [{ id: userAddingId, name: userName }],
          playerTeam: [],
          score: "",
          playedDate: new Date().toISOString().split("T")[0],
          groupId,
          competitionId,
          venueId: "",
          venueName: "",
          venueCountry: "",
          category,
        };
      }
      // team
      return {
        matchType: "team" as const,
        winnerTeam: [{ id: userAddingId, name: `${userName}'s Team` }],
        playerTeam: [],
        score: "",
        playedDate: new Date().toISOString().split("T")[0],
        groupId,
        competitionId,
        venueId: "",
        venueName: "",
        venueCountry: "",
        category,
      };
    })(),
  });

  async function onSubmit(data: FormValues) {
    try {
      // Ensure the current user is the winner
      if (data.winnerTeam[0]?.id !== userAddingId) {
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
        <Button className="capitalize">
          Add {category} {matchType} Game
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add {category} {matchType} Game
          </DialogTitle>
          <DialogDescription>Add game final score.</DialogDescription>
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
                      <FormControl>
                        <Combobox
                          options={rankings
                            .filter((ranking) => ranking.playerId !== form.getValues("winnerTeam.0.id"))
                            .map((ranking) => ({
                              value: ranking.playerId,
                              label: ranking.playerName,
                            }))}
                          value={field.value}
                          onValueChange={(value) => {
                            const selectedPlayer = rankings.find((ranking) => ranking.playerId === value);
                            field.onChange(value);
                            form.setValue("playerTeam.0.name", selectedPlayer?.playerName ?? "UNKNOWN");
                          }}
                          placeholder="Select a player"
                          searchPlaceholder="Search players..."
                        />
                      </FormControl>
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
                      <FormControl>
                        <Combobox
                          options={rankings
                            .filter((ranking) => ranking.playerId !== form.getValues("winnerTeam.0.id"))
                            .map((ranking) => ({
                              value: ranking.playerId,
                              label: ranking.playerName,
                            }))}
                          value={field.value}
                          onValueChange={(value) => {
                            const selectedPlayer = rankings.find((ranking) => ranking.playerId === value);
                            field.onChange(value);
                            form.setValue("winnerTeam.1.name", selectedPlayer?.playerName ?? "UNKNOWN");
                          }}
                          placeholder="Select a winner partner"
                          searchPlaceholder="Search players..."
                        />
                      </FormControl>
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
                      <FormControl>
                        <Combobox
                          options={rankings
                            .filter((ranking) => ranking.playerId !== form.getValues("winnerTeam.0.id") && ranking.playerId !== form.getValues("winnerTeam.1.id"))
                            .map((ranking) => ({
                              value: ranking.playerId,
                              label: ranking.playerName,
                            }))}
                          value={field.value}
                          onValueChange={(value) => {
                            const selectedPlayer = rankings.find((ranking) => ranking.playerId === value);
                            field.onChange(value);
                            form.setValue("playerTeam.0.name", selectedPlayer?.playerName ?? "UNKNOWN");
                          }}
                          placeholder="Select a player"
                          searchPlaceholder="Search players..."
                        />
                      </FormControl>
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
                      <FormControl>
                        <Combobox
                          options={rankings
                            .filter(
                              (ranking) =>
                                ranking.playerId !== form.getValues("winnerTeam.0.id") &&
                                ranking.playerId !== form.getValues("winnerTeam.1.id") &&
                                ranking.playerId !== form.getValues("playerTeam.0.id"),
                            )
                            .map((ranking) => ({
                              value: ranking.playerId,
                              label: ranking.playerName,
                            }))}
                          value={field.value}
                          onValueChange={(value) => {
                            const selectedPlayer = rankings.find((ranking) => ranking.playerId === value);
                            field.onChange(value);
                            form.setValue("playerTeam.1.name", selectedPlayer?.playerName ?? "UNKNOWN");
                          }}
                          placeholder="Select a player partner"
                          searchPlaceholder="Search players..."
                        />
                      </FormControl>
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
                      <FormControl>
                        <Combobox
                          options={rankings.map((ranking) => ({
                            value: ranking.playerId,
                            label: `${ranking.playerName}'s Team`,
                          }))}
                          value={field.value}
                          onValueChange={(value) => {
                            const selectedPlayer = rankings.find((ranking) => ranking.playerId === value);
                            field.onChange(value);
                            form.setValue("winnerTeam.0.name", `${selectedPlayer?.playerName ?? "UNKNOWN"}'s Team`);
                          }}
                          placeholder="Select winner team"
                          searchPlaceholder="Search teams..."
                        />
                      </FormControl>
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
                      <FormControl>
                        <Combobox
                          options={rankings
                            .filter((ranking) => ranking.playerId !== form.getValues("winnerTeam.0.id"))
                            .map((ranking) => ({
                              value: ranking.playerId,
                              label: `${ranking.playerName}'s Team`,
                            }))}
                          value={field.value}
                          onValueChange={(value) => {
                            const selectedPlayer = rankings.find((ranking) => ranking.playerId === value);
                            field.onChange(value);
                            form.setValue("playerTeam.0.name", `${selectedPlayer?.playerName ?? "UNKNOWN"}'s Team`);
                          }}
                          placeholder="Select player team"
                          searchPlaceholder="Search teams..."
                        />
                      </FormControl>
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
