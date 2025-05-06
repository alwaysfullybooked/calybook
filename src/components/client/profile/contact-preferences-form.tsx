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
import { updateUser } from "@/actions/user";

const contactMethodSchema = z.object({
  preferredMethod: z.enum(["email", "line", "whatsapp"]),
  contactWhatsAppId: z.string().min(1, "WhatsApp ID is required"),
  contactLineId: z.string().min(1, "LINE ID is required"),
});

type ContactMethodForm = z.infer<typeof contactMethodSchema>;

interface ContactPreferencesFormProps {
  email: string;
  contactMethod: string | undefined;
  contactWhatsAppId: string | undefined;
  contactLineId: string | undefined;
}

export function ContactPreferencesForm({ email, contactMethod, contactWhatsAppId, contactLineId }: ContactPreferencesFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ContactMethodForm>({
    resolver: zodResolver(contactMethodSchema),
    defaultValues: {
      preferredMethod: contactMethod as "email" | "line" | "whatsapp",
      contactWhatsAppId: contactWhatsAppId,
      contactLineId: contactLineId,
    },
  });

  const onSubmit = async (data: ContactMethodForm) => {
    setIsLoading(true);
    try {
      await updateUser({
        contactMethod: data.preferredMethod,
        contactWhatsAppId: data.contactWhatsAppId,
        contactLineId: data.contactLineId,
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Preferences</CardTitle>
        <CardDescription>For bookings and updates.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormItem>
              <FormLabel>Registered Email</FormLabel>
              <FormControl>
                <Input value={email} disabled />
              </FormControl>
              <FormDescription>Cannot be changed.</FormDescription>
            </FormItem>

            <FormField
              control={form.control}
              name="preferredMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Contact Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your preferred contact method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="line">LINE</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose how you would like to be contacted.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("preferredMethod") === "whatsapp" && (
              <FormField
                control={form.control}
                name="contactWhatsAppId"
                defaultValue={contactWhatsAppId}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your WhatsApp number with country code (+66981234567)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your WhatsApp number" {...field} />
                    </FormControl>
                    <FormDescription>Best to paste the value here.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {form.watch("preferredMethod") === "line" && (
              <FormField
                control={form.control}
                name="contactLineId"
                defaultValue={contactLineId}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your LINE ID (username)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your LINE ID" {...field} />
                    </FormControl>
                    <FormDescription>Paste the exact value here.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
