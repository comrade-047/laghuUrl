"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Link } from "@prisma/client";

const formSchema = z.object({
  originalUrl: z.string().trim().min(1, { message: "Please enter a URL." }).url({ message: "Please enter a valid URL." }),
});
type FormValues = z.infer<typeof formSchema>;

interface EditLinkFormProps {
  link: Link;
  onSuccess: () => void; 
}

export function EditLinkForm({ link, onSuccess }: EditLinkFormProps) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originalUrl: link.originalUrl,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const promise = fetch(`/api/links/${link.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ originalUrl: data.originalUrl }),
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to update link.");
      return res.json();
    });

    toast.promise(promise, {
      loading: "Saving changes...",
      success: () => {
        onSuccess(); 
        router.refresh(); 
        return "Link updated successfully!";
      },
      error: "Failed to update link.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <FormField
          control={form.control}
          name="originalUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Original URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/your-new-url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
}