"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/client/submit-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createTennisPreferences } from "@/actions/preferences/tennis";
import { toast } from "sonner";
import { convertUTRtoNTRP } from "@/lib/utils";

const TennisPreferencesSchema = z.object({
  universalTennisRating: z
    .string()
    .min(1, "UTR is required")
    .max(16.5, "UTR must be less than 16.50")
    .regex(/^\d+(\.\d{1,2})?$/, "UTR must be a number between 1 and 16.50"), // From 1 to 16.50
  nationalTennisRatingProgram: z
    .string()
    .min(1.5, "NTRP is required")
    .max(7.0, "NTRP must be less than 7.0")
    .regex(/^\d+(\.\d{1,2})?$/, "NTRP must be a number between 1.5 and 7.0"), // From 1.5 to 7.0,
});

type ContactMethodForm = z.infer<typeof TennisPreferencesSchema>;

interface TennisPreferencesFormProps {
  tennisPreferences:
    | {
        id: string;
        userId: string;
        universalTennisRating: string;
        nationalTennisRatingProgram: string;
      }
    | undefined;
}

export function TennisPreferencesForm({ tennisPreferences }: TennisPreferencesFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ContactMethodForm>({
    resolver: zodResolver(TennisPreferencesSchema),
    defaultValues: {
      universalTennisRating: tennisPreferences?.universalTennisRating ?? "",
      nationalTennisRatingProgram: tennisPreferences?.nationalTennisRatingProgram ?? "",
    },
  });

  // Add handler for UTR input changes
  const handleUTRChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const utr = e.target.value;
    if (utr) {
      form.setValue("nationalTennisRatingProgram", convertUTRtoNTRP(utr));
    } else {
      form.setValue("nationalTennisRatingProgram", "");
    }
  };

  const onSubmit = async (data: ContactMethodForm) => {
    setIsLoading(true);
    try {
      await createTennisPreferences({
        universalTennisRating: data.universalTennisRating,
        nationalTennisRatingProgram: data.nationalTennisRatingProgram,
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
                <Input
                  {...form.register("universalTennisRating")}
                  onChange={(e) => {
                    form.register("universalTennisRating").onChange(e);
                    handleUTRChange(e);
                  }}
                />
              </FormControl>
              {form.watch("universalTennisRating") && <FormDescription>Estimated NTRP Rating: {convertUTRtoNTRP(form.watch("universalTennisRating"))}</FormDescription>}
            </FormItem>

            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </SubmitButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
