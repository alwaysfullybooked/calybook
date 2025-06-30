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
import type { Category, MatchType } from "@/server/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export type User = typeof users.$inferSelect;

import type { Resolver } from "react-hook-form";

// Base schema for common fields
const baseSchema = z.object({
  score: z
    .string()
    .min(1, "Score is required")
    .regex(/^[0-9]+-[0-9]+(?:\s+[0-9]+-[0-9]+){0,2}$/, "No commas, score must be in X-X with spaces"),
  playedDate: z.string().min(1, "Played date is required"),
});

// Singles schema
const singlesSchema = baseSchema.extend({
  matchType: z.literal("singles"),
  winnerId: z.string().min(1, "Winner is required"),
  winnerName: z.string().min(1, "Winner name is required"),
  playerId: z.string().min(1, "Player is required"),
  playerName: z.string().min(1, "Player name is required"),
});

singlesSchema.superRefine((data, ctx) => {
  if (data.winnerId === data.playerId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Winner and player cannot be the same person",
      path: ["playerId"],
    });
  }
});

// Doubles schema
const doublesSchema = baseSchema.extend({
  matchType: z.literal("doubles"),
  winnerId: z.string().min(1, "Winner is required"),
  winnerName: z.string().min(1, "Winner name is required"),
  winnerPartnerId: z.string().min(1, "Winner partner is required"),
  winnerPartnerName: z.string().min(1, "Winner partner name is required"),
  playerId: z.string().min(1, "Player is required"),
  playerName: z.string().min(1, "Player name is required"),
  playerPartnerId: z.string().min(1, "Player partner is required"),
  playerPartnerName: z.string().min(1, "Player partner name is required"),
});

doublesSchema.superRefine((data, ctx) => {
  const winnerPlayers = [data.winnerId, data.winnerPartnerId];
  const playerPlayers = [data.playerId, data.playerPartnerId];
  if (winnerPlayers.some((id) => playerPlayers.includes(id))) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Players cannot be on both teams",
      path: ["playerPartnerId"],
    });
  }
});

// Team schema
const teamSchema = baseSchema.extend({
  matchType: z.literal("team"),
  winnerTeamId: z.string().min(1, "Winner team is required"),
  playerTeamId: z.string().min(1, "Player team is required"),
});

teamSchema.superRefine((data, ctx) => {
  if (data.winnerTeamId === data.playerTeamId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Winner team and player team cannot be the same",
      path: ["playerTeamId"],
    });
  }
});

const formSchema = z.discriminatedUnion("matchType", [singlesSchema, doublesSchema, teamSchema]);
type FormValues = z.infer<typeof formSchema>;

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
  venueName: string;
  venueCountry: string;
  rankings: Ranking[];
  userAddingId: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: (() => {
      if (matchType === "singles") {
        return {
          matchType,
          winnerId: userAddingId,
          winnerName: rankings.find((r) => r.playerId === userAddingId)?.playerName ?? "UNKNOWN",
          playerId: "",
          playerName: "",
          score: "",
          playedDate: new Date().toISOString().split("T")[0],
        } as FormValues;
      }
      if (matchType === "doubles") {
        return {
          matchType,
          winnerId: userAddingId,
          winnerName: rankings.find((r) => r.playerId === userAddingId)?.playerName ?? "UNKNOWN",
          winnerPartnerId: "",
          winnerPartnerName: "",
          playerId: "",
          playerName: "",
          playerPartnerId: "",
          playerPartnerName: "",
          score: "",
          playedDate: new Date().toISOString().split("T")[0],
        } as FormValues;
      }
      // team
      return {
        matchType,
        winnerTeamId: "",
        playerTeamId: "",
        score: "",
        playedDate: new Date().toISOString().split("T")[0],
      } as FormValues;
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
              </>
            )}
            {matchType === "doubles" && (
              <>
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
                  name="winnerPartnerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Winner Partner</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const selectedPlayer = rankings.find((ranking) => ranking.playerId === value);
                          field.onChange(value);
                          form.setValue("winnerPartnerName", selectedPlayer?.playerName ?? "UNKNOWN");
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
                            .filter((ranking) => ranking.playerId !== form.getValues("winnerId") && ranking.playerId !== form.getValues("winnerPartnerId"))
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
                  name="playerPartnerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player Partner</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const selectedPlayer = rankings.find((ranking) => ranking.playerId === value);
                          field.onChange(value);
                          form.setValue("playerPartnerName", selectedPlayer?.playerName ?? "UNKNOWN");
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
                              (ranking) => ranking.playerId !== form.getValues("winnerId") && ranking.playerId !== form.getValues("winnerPartnerId") && ranking.playerId !== form.getValues("playerId"),
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
                  name="winnerTeamId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Winner Team</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  name="playerTeamId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player Team</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select player team" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rankings
                            .filter((ranking) => ranking.playerId !== form.getValues("winnerTeamId"))
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
