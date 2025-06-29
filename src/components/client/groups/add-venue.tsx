"use client";

import { addVenueToGroup } from "@/actions/groups";
import { SubmitButton } from "@/components/client/submit-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Venue } from "@/lib/alwaysfullybooked";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AddVenueDialogProps {
  groupId: string;
  trigger?: React.ReactNode;
  venues: Venue[];
}

type AddVenueForm = {
  venueId: string;
};

export function AddVenueDialog({ groupId, trigger, venues }: AddVenueDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<AddVenueForm>({
    defaultValues: {
      venueId: "",
    },
  });

  async function handleSearch() {
    setLoading(true);
    try {
      // Filter by search string (case-insensitive)
      const filtered = venues.find((venue) => venue.name.toLowerCase().includes(search.toLowerCase()));
      form.setValue("venueId", filtered?.id ?? "");
    } catch (e) {
      console.error(e);
      toast.error("Failed to search venues");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(data: AddVenueForm) {
    const venue = venues.find((v) => v.id === data.venueId);
    if (!venue) {
      toast.error("Venue not found");
      return;
    }
    try {
      await addVenueToGroup({
        groupId,
        venueId: venue.id,
        venueName: venue.name,
        venueCountry: venue.country,
      });
      toast.success("Venue added to group");
      setOpen(false);
      form.reset();
    } catch (e) {
      console.error(e);
      toast.error("Failed to add venue");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            Add Venue
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Venue to Group</DialogTitle>
          <DialogDescription>Select a venue to add to this group.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormItem>
              <FormLabel>Search Venue</FormLabel>
              <div className="flex gap-2">
                <Input placeholder="Type venue name..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
                <Button type="button" onClick={handleSearch} disabled={loading || !search}>
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
            </FormItem>
            <FormField
              control={form.control}
              name="venueId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a venue" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {venues.length === 0 && (
                        <SelectItem value="" disabled>
                          No venues found
                        </SelectItem>
                      )}
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
            <SubmitButton type="submit" disabled={form.formState.isSubmitting || !form.watch("venueId")}>
              Add Venue
            </SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
