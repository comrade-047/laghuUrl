// src/components/forms/UrlShortenerForm.tsx
"use client";

import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Loader2, ShieldCheck, ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { SubmissionResult } from "./SubmissionResult";
import { toast } from "sonner";

const formSchema = z.object({
  url: z.preprocess((val) => {
    if (typeof val === 'string' && val.trim() && !val.trim().startsWith('http')) {
      return `https://${val.trim()}`;
    }
    return val;
  }, z.string().trim().min(1, { message: "Please enter a URL." }).url({ message: "Please enter a valid URL." })),
});

type FormValues = z.infer<typeof formSchema>;
type ValidationStatus = "valid" | "invalid" | "pending" | "idle";

export function UrlShortenerForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [shortUrl, setShortUrl] = React.useState<string | null>(null);
  const [validationStatus, setValidationStatus] = React.useState<ValidationStatus>("idle");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: "" },
  });

  // Function to handle the pre-submission validation check
  const handleValidateUrl = async () => {
    const url = form.getValues("url");
    const validation = formSchema.shape.url.safeParse(url);

    if (!validation.success) {
      toast.error("Please enter a syntactically valid URL first.");
      return;
    }

    setValidationStatus("pending");
    toast.info("Checking link status...");

    try {
      const response = await fetch(`/api/validate-url?url=${encodeURIComponent(validation.data)}`);
      const result = await response.json();

      if (result.isValid) {
        setValidationStatus("valid");
        toast.success(result.message);
      } else {
        setValidationStatus("invalid");
        toast.error(result.message);
      }
    } catch (err) {
      setValidationStatus("invalid");
      toast.error("Failed to check the link.");
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setShortUrl(null);
    setValidationStatus("idle");

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: data.url }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "An error occurred.");
      setShortUrl(result.shortUrl);
      form.reset();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset validation status when the user types in the input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("url", e.target.value);
    setValidationStatus("idle");
  };

  return (
    <div className="w-full max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex w-full flex-col items-center gap-3 sm:flex-row">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="w-full relative">
                  <FormControl>
                    <Input
                      placeholder="Paste your long URL here..."
                      className="h-14 flex-1 rounded-lg border-gray-300 bg-white text-base transition focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white pr-12"
                      {...field}
                      onChange={handleInputChange} // Use custom change handler
                    />
                  </FormControl>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {validationStatus === 'pending' && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
                    {validationStatus === 'valid' && <ShieldCheck className="h-5 w-5 text-green-500" />}
                    {validationStatus === 'invalid' && <ShieldX className="h-5 w-5 text-red-500" />}
                    {validationStatus === 'idle' && (
                      <Button type="button" variant="ghost" size="icon" onClick={handleValidateUrl} className="h-8 w-8" aria-label="Check URL validity">
                        <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="h-14 w-full rounded-lg bg-indigo-600 px-8 text-base text-white transition-colors hover:bg-indigo-700 sm:w-auto">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <><span>Shorten</span><ArrowRight className="ml-2 h-5 w-5" /></>}
            </Button>
          </div>
          <FormMessage className="text-left text-red-500">{form.formState.errors.url?.message}</FormMessage>
        </form>
      </Form>
      <div className="mt-4 h-16">
        <SubmissionResult isLoading={isLoading} error={error} shortUrl={shortUrl} />
      </div>
    </div>
  );
}