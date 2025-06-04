"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createTennisPreferences } from "@/actions/preferences/tennis";
import { toast } from "sonner";

const TennisPreferencesSchema = z.object({
  universalTennisRating: z
    .string()
    .min(1, "UTR is required")
    .max(16.5, "UTR must be less than 16.50")
    .regex(/^\d+(\.\d{1,2})?$/, "UTR must be a number between 1 and 16.50"), // From 1 to 16.50
});

type ContactMethodForm = z.infer<typeof TennisPreferencesSchema>;

interface TennisPreferencesFormProps {
  universalTennisRating: string;
}

export function TennisPreferencesForm({ universalTennisRating }: TennisPreferencesFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ContactMethodForm>({
    resolver: zodResolver(TennisPreferencesSchema),
    defaultValues: {
      universalTennisRating,
    },
  });

  const onSubmit = async (data: ContactMethodForm) => {
    setIsLoading(true);
    try {
      await createTennisPreferences({
        universalTennisRating: data.universalTennisRating,
      });
      toast.success("UTR updated successfully");
    } catch (error) {
      console.error("Error updating UTR:", error);
      toast.error("Error updating UTR");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-2xl font-bold">Tennis Preferences</h2>
        </CardTitle>
        <CardDescription>To help us find the best matches for you.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormItem>
              <FormLabel>Universal Tennis Rating (UTR) 1.00 - 16.50</FormLabel>
              <FormControl>
                <Input {...form.register("universalTennisRating")} />
              </FormControl>
            </FormItem>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
