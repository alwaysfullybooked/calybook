"use client";

import { updateGroup } from "@/actions/groups";
import { SubmitButton } from "@/components/client/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Categories, type Category } from "@/server/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const EditGroupSchema = z.object({
  name: z.string().min(1, "Group name is required").max(255, "Group name must be less than 255 characters"),
  category: z.nativeEnum(Categories, {
    required_error: "Please select a category",
  }),
  description: z.string().min(1, "Description is required").max(255, "Description must be less than 255 characters"),
});

type EditGroupForm = z.infer<typeof EditGroupSchema>;

interface Group {
  id: string;
  name: string;
  category: string;
  description: string | null;
  createdAt: Date;
}

interface EditGroupFormProps {
  group: Group;
  onSuccess?: () => void;
  variant?: "standalone" | "dialog";
}

interface EditGroupDialogProps {
  group: Group;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

function EditGroupFormContent({ group, onSuccess }: { group: Group; onSuccess?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EditGroupForm>({
    resolver: zodResolver(EditGroupSchema),
    defaultValues: {
      name: group.name,
      category: group.category as Category,
      description: group.description || "",
    },
  });

  const onSubmit = async (data: EditGroupForm) => {
    setIsLoading(true);
    try {
      await updateGroup({
        id: group.id,
        name: data.name,
        category: data.category,
        description: data.description,
      });
      toast.success("Group updated successfully");
      onSuccess?.();
    } catch (error) {
      console.error("Error updating group:", error);
      toast.error("Error updating group");
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
            {isLoading ? "Updating..." : "Update Group"}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}

export function EditGroupForm({ group, onSuccess, variant = "standalone" }: EditGroupFormProps) {
  if (variant === "dialog") {
    return <EditGroupFormContent group={group} onSuccess={onSuccess} />;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit className="h-5 w-5" />
          Edit Group
        </CardTitle>
        <CardDescription>Update your group information and settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <EditGroupFormContent group={group} onSuccess={onSuccess} />
      </CardContent>
    </Card>
  );
}

export function EditGroupDialog({ group, onSuccess, trigger }: EditGroupDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Group
          </DialogTitle>
          <DialogDescription>Update your group information and settings.</DialogDescription>
        </DialogHeader>
        <EditGroupForm variant="dialog" group={group} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
