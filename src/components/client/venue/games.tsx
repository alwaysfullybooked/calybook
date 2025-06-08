"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createVenueGame } from "@/actions/venue/games";
import { useRouter } from "next/navigation";
import type { Venue } from "@/lib/alwaysbookbooked";
import { type users, type Category, Categories } from "@/server/db/schema";
import { SubmitButton } from "@/components/client/submit-button";
export type User = typeof users.$inferSelect;

import type { Resolver } from "react-hook-form";

const formSchema = z.object({
  venueId: z.string().min(1, "Venue is required"),
  venueName: z.string().min(1, "Venue name is required"),
  category: z.nativeEnum(Categories),
  winnerId: z.string().min(1, "Winner is required"),
  winnerName: z.string().min(1, "Winner name is required"),
  playerId: z.string().min(1, "Player is required"),
  playerName: z.string().min(1, "Player name is required"),
  score: z.string().min(1, "Score is required"),
  playedDate: z.string().min(1, "Played date is required"),
  isCloseMatch: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export function AddTennisGame({ venues }: { venues: Venue[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      venueId: "",
      venueName: "",
      category: "tennis" as Category,
      winnerId: "",
      winnerName: "",
      playerId: "",
      playerName: "",
      score: "",
      playedDate: new Date().toISOString().split("T")[0],
      isCloseMatch: false,
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      await createVenueGame(data);
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
              name="venueId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const selectedVenue = venues.find((venue) => venue.id === value);
                      field.onChange(value);
                      form.setValue("venueName", selectedVenue?.name ?? "");
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a venue" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {venues.map((venue) => (
                        <SelectItem key={venue.id} value={venue.id}>
                          {venue.name}
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
                name="winnerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Winner</FormLabel>
                    <FormControl>
                      <Input {...field} value={form.watch("winnerName")} />
                    </FormControl>
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
                    <FormControl>
                      <Input {...field} value={form.watch("playerName")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
              <FormField
                control={form.control}
                name="isCloseMatch"
                render={({ field }) => (
                  <FormItem className="flex gap-2 justify-center items-center mt-5">
                    <FormLabel>Close Match</FormLabel>
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
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
