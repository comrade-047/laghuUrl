"use client";

import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  ArrowRight,
  Loader2,
  ShieldCheck,
  ShieldX,
  CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { SubmissionResult } from "./SubmissionResult";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  url: z.preprocess((val) => {
    if (typeof val === "string" && val.trim() && !val.trim().startsWith("http")) {
      return `https://${val.trim()}`;
    }
    return val;
  }, z.string().trim().min(1, { message: "Please enter a URL." }).url({ message: "Please enter a valid URL." })),
  expiresAt: z.date().optional(),
  customSlug: z.string().trim().optional(),
});

type FormValues = z.infer<typeof formSchema>;
type ValidationStatus = "valid" | "invalid" | "pending" | "idle";

interface UrlShortenerFormProps {
  showCustomSlug?: boolean;
  showCustomExpiration?: boolean;
}

export function UrlShortenerForm({
  showCustomSlug = false,
  showCustomExpiration = false,
}: UrlShortenerFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [shortUrl, setShortUrl] = React.useState<string | null>(null);
  const [validationStatus, setValidationStatus] =
    React.useState<ValidationStatus>("idle");
  const [isCustomExpiry, setIsCustomExpiry] = React.useState(false);
  const [isCustom, setIsCustom] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: "" },
  });

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
      const response = await fetch(
        `/api/validate-url?url=${encodeURIComponent(validation.data)}`
      );
      const result = await response.json();

      if (result.isValid) {
        setValidationStatus("valid");
        toast.success(result.message);
      } else {
        setValidationStatus("invalid");
        toast.error(result.message);
      }
    } catch {
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
        body: JSON.stringify({
          url: data.url,
          expiresAt: showCustomExpiration && isCustomExpiry ? data.expiresAt : undefined,
          customSlug: showCustomSlug && isCustom ? data.customSlug : undefined,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "An error occurred.");
      setShortUrl(result.shortUrl);
      form.reset();
      setIsCustomExpiry(false);
      setIsCustom(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("url", e.target.value);
    setValidationStatus("idle");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 bg-white dark:bg-slate-900 shadow-md rounded-xl p-6"
        >
          {/* URL Input + Shorten Button */}
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="relative flex-1">
                  <FormControl>
                    <Input
                      placeholder="Paste your long URL here..."
                      className="h-12 flex-1 rounded-lg border-gray-300 bg-gray-50 text-base transition focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-gray-700 dark:bg-slate-800 dark:text-white pr-12"
                      {...field}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {validationStatus === "pending" && (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    )}
                    {validationStatus === "valid" && (
                      <ShieldCheck className="h-5 w-5 text-green-500" />
                    )}
                    {validationStatus === "invalid" && (
                      <ShieldX className="h-5 w-5 text-red-500" />
                    )}
                    {validationStatus === "idle" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleValidateUrl}
                        className="h-8 w-8"
                        aria-label="Check URL validity"
                      >
                        <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 sm:w-auto w-full rounded-lg bg-indigo-600 px-6 text-base text-white transition-colors hover:bg-indigo-700"
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <span>Shorten</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
          <FormMessage className="text-left text-red-500">
            {form.formState.errors.url?.message}
          </FormMessage>

          {/* Advanced Options */}
          {(showCustomSlug || showCustomExpiration) && (
            <div className="space-y-6 border-t pt-6">
              {/* Custom Slug */}
              {showCustomSlug && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="custom-link-toggle"
                      checked={isCustom}
                      onCheckedChange={setIsCustom}
                    />
                    <Label
                      htmlFor="custom-link-toggle"
                      className="font-medium text-sm"
                    >
                      Use a custom short link
                    </Label>
                  </div>
                  {isCustom && (
                    <FormField
                      control={form.control}
                      name="customSlug"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Enter custom slug"
                              className="h-11 rounded-lg"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}

              {/* Custom Expiration */}
              {showCustomExpiration && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="custom-expiry-toggle"
                      checked={isCustomExpiry}
                      onCheckedChange={setIsCustomExpiry}
                    />
                    <Label
                      htmlFor="custom-expiry-toggle"
                      className="font-medium text-sm"
                    >
                      Set custom expiration
                    </Label>
                  </div>
                  {isCustomExpiry && (
                    <FormField
                      control={form.control}
                      name="expiresAt"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "h-11 w-[240px] justify-start rounded-lg pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </form>
      </Form>

      {/* Submission Result */}
      <div className="mt-6">
        <SubmissionResult
          isLoading={isLoading}
          error={error}
          shortUrl={shortUrl}
        />
      </div>
    </div>
  );
}
