"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createOpenScorGame } from "@/actions/openscor/games";
import { SubmitButton } from "@/components/client/submit-button";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Ranking } from "@/lib/openscor";
import type { groupVenues } from "@/server/db/schema";
import { Categories, type Category, type MatchType } from "@/server/db/schema";
// export type User = typeof users.$inferSelect;

import type { Resolver } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

// Schema for singles matches
const singlesSchema = z.object({
  matchType: z.literal("singles"),
  winnerTeam: z.array(z.string().min(1, "Winner is required")).length(1),
  playerTeam: z.array(z.string().min(1, "Player is required")).length(1),
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
  winnerTeam: z.array(z.string().min(1, "Winner is required")).length(2),
  playerTeam: z.array(z.string().min(1, "Player is required")).length(2),
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
  winnerTeam: z.array(z.string().min(1, "Winner team is required")).length(5),
  playerTeam: z.array(z.string().min(1, "Player team is required")).length(5),
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
      if (matchType === "singles") {
        return {
          matchType: "singles" as const,
          winnerTeam: [userAddingId],
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
          winnerTeam: [userAddingId],
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
        winnerTeam: [userAddingId],
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
      if (data.winnerTeam[0] !== userAddingId) {
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
                  name="winnerTeam"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Winner</FormLabel>
                      <Select defaultValue={field.value[0]} disabled={true}>
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
                  name="playerTeam"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player</FormLabel>
                      <FormControl>
                        <Combobox
                          options={rankings
                            .filter((ranking) => !form.getValues("winnerTeam").includes(ranking.playerId))
                            .map((ranking) => ({
                              value: ranking.playerId,
                              label: ranking.playerName,
                            }))}
                          value={field.value[0]}
                          onValueChange={(value) => {
                            const selectedPlayer = rankings.find((ranking) => ranking.playerId === value);
                            field.onChange(value);
                            form.setValue("playerTeam.0", selectedPlayer?.playerName ?? "UNKNOWN");
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
                  name="winnerTeam"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Winner</FormLabel>
                      <Select defaultValue={field.value[0]} disabled={true}>
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
                  name="winnerTeam"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Winner Partner</FormLabel>
                      <FormControl>
                        <Combobox
                          options={rankings
                            .filter((ranking) => ranking.playerId !== form.getValues("winnerTeam")[0])
                            .map((ranking) => ({
                              value: ranking.playerId,
                              label: ranking.playerName,
                            }))}
                          value={field.value[1]}
                          onValueChange={(value) => {
                            const selectedPlayer = rankings.find((ranking) => ranking.playerId === value);
                            field.onChange(value);
                            form.setValue("winnerTeam.1", selectedPlayer?.playerName ?? "UNKNOWN");
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
                  name="playerTeam"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player</FormLabel>
                      <FormControl>
                        <Combobox
                          options={rankings
                            .filter((ranking) => !form.getValues("winnerTeam").includes(ranking.playerId))
                            .map((ranking) => ({
                              value: ranking.playerId,
                              label: ranking.playerName,
                            }))}
                          value={field.value[0]}
                          onValueChange={(value) => {
                            const selectedPlayer = rankings.find((ranking) => ranking.playerId === value);
                            field.onChange(value);
                            form.setValue("playerTeam.0", selectedPlayer?.playerName ?? "UNKNOWN");
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
                  name="playerTeam"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player Partner</FormLabel>
                      <FormControl>
                        <Combobox
                          options={rankings
                            .filter(
                              (ranking) =>
                                ranking.playerId !== form.getValues("winnerTeam")[0] && ranking.playerId !== form.getValues("winnerTeam")[1] && ranking.playerId !== form.getValues("playerTeam")[0],
                            )
                            .map((ranking) => ({
                              value: ranking.playerId,
                              label: ranking.playerName,
                            }))}
                          value={field.value[1]}
                          onValueChange={(value) => {
                            const selectedPlayer = rankings.find((ranking) => ranking.playerId === value);
                            field.onChange(value);
                            form.setValue("playerTeam.1", selectedPlayer?.playerName ?? "UNKNOWN");
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
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <div className="font-semibold mb-2">
                      Winner Team <span className="text-xs text-muted-foreground">({form.watch("winnerTeam")?.length || 0}/5)</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {rankings.map((ranking) => {
                        const checked = form.watch("winnerTeam")?.some((p) => p === ranking.playerId);
                        const disabled = form.watch("playerTeam")?.some((p) => p === ranking.playerId) || (form.watch("winnerTeam")?.length >= 5 && !checked);
                        return (
                          <div key={ranking.playerId} className={`flex items-center gap-2 ${disabled ? "opacity-50" : ""}`}>
                            <Checkbox
                              checked={checked}
                              disabled={disabled}
                              onCheckedChange={(val) => {
                                const current = form.getValues("winnerTeam") || [];
                                if (val) {
                                  if (current.length < 5) {
                                    form.setValue("winnerTeam", [...current, ranking.playerId]);
                                  }
                                } else {
                                  form.setValue(
                                    "winnerTeam",
                                    current.filter((p) => p !== ranking.playerId),
                                  );
                                }
                              }}
                            />
                            <span>{ranking.playerName}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-2">
                      Player Team <span className="text-xs text-muted-foreground">({form.watch("playerTeam")?.length || 0}/5)</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {rankings.map((ranking) => {
                        const checked = form.watch("playerTeam")?.some((p) => p === ranking.playerId);
                        const disabled = form.watch("winnerTeam")?.some((p) => p === ranking.playerId) || (form.watch("playerTeam")?.length >= 5 && !checked);
                        return (
                          <div key={ranking.playerId} className={`flex items-center gap-2 ${disabled ? "opacity-50" : ""}`}>
                            <Checkbox
                              checked={checked}
                              disabled={disabled}
                              onCheckedChange={(val) => {
                                const current = form.getValues("playerTeam") || [];
                                if (val) {
                                  if (current.length < 5) {
                                    form.setValue("playerTeam", [...current, ranking.playerId]);
                                  }
                                } else {
                                  form.setValue(
                                    "playerTeam",
                                    current.filter((p) => p !== ranking.playerId),
                                  );
                                }
                              }}
                            />
                            <span>{ranking.playerName}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <FormMessage />
              </div>
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
