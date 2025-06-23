"use client";

import { createGroup } from "@/actions/groups";
import { SubmitButton } from "@/components/client/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Categories } from "@/server/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Users } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const CreateGroupSchema = z.object({
  name: z.string().min(1, "Group name is required").max(255, "Group name must be less than 255 characters"),
  category: z.nativeEnum(Categories, {
    required_error: "Please select a category",
  }),
  description: z.string().min(1, "Description is required").max(255, "Description must be less than 255 characters"),
});

type CreateGroupForm = z.infer<typeof CreateGroupSchema>;

interface CreateGroupFormProps {
  onSuccess?: () => void;
  variant?: "standalone" | "dialog";
}

interface CreateGroupDialogProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

function CreateGroupFormContent({ onSuccess }: { onSuccess?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateGroupForm>({
    resolver: zodResolver(CreateGroupSchema),
    defaultValues: {
      name: "",
      category: Categories.TENNIS,
      description: "",
    },
  });

  const onSubmit = async (data: CreateGroupForm) => {
    setIsLoading(true);
    try {
      await createGroup({
        name: data.name,
        category: data.category,
        description: data.description,
      });
      toast.success("Group created successfully");
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Error creating group");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter group name" {...field} />
              </FormControl>
              <FormDescription>Choose a descriptive name for your group.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(Categories).map((category) => (
                    <SelectItem key={category} value={category}>
                      <span className="capitalize">{category}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select the sport or activity category for this group.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your group's purpose, skill level, or any other relevant information" className="resize-none" rows={3} {...field} />
              </FormControl>
              <FormDescription>Provide details about the group's purpose and requirements.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isLoading} className="flex-1">
            Reset
          </Button>
          <SubmitButton type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Creating..." : "Create Group"}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}

export function CreateGroupForm({ onSuccess, variant = "standalone" }: CreateGroupFormProps) {
  if (variant === "dialog") {
    return <CreateGroupFormContent onSuccess={onSuccess} />;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Create New Group
        </CardTitle>
        <CardDescription>Create a new group to organize your activities.</CardDescription>
      </CardHeader>
      <CardContent>
        <CreateGroupFormContent onSuccess={onSuccess} />
      </CardContent>
    </Card>
  );
}

export function CreateGroupDialog({ onSuccess, trigger }: CreateGroupDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Group
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Create New Group
          </DialogTitle>
          <DialogDescription>Create a new group to organize your activities.</DialogDescription>
        </DialogHeader>
        <CreateGroupForm variant="dialog" onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
