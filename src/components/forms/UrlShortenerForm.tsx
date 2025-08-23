"use client";

import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Loader2, Copy } from "lucide-react";
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

const formSchema = z.object({
  url: z.preprocess((val) => {
    if (typeof val === "string" && val.trim() && !val.trim().startsWith("http")) {
      return `https://${val.trim()}`;
    }
    return val;
  }, z.string().trim().url({ message: "Please enter a valid URL." })),
});

type FormValues = z.infer<typeof formSchema>;

export function UrlShortenerForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [shortUrl, setShortUrl] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: "" },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setShortUrl(null);

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
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shortUrl) navigator.clipboard.writeText(shortUrl);
  };

  return (
    <div className="w-full max-w-2xl">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col items-center gap-4 sm:flex-row"
        >
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Paste your long URL here..."
                    className="h-14 w-full rounded-xl border border-gray-300 bg-white px-4 text-base shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-left text-red-500 mt-1" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="h-14 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 text-base font-medium text-white transition hover:from-indigo-700 hover:to-indigo-600 sm:w-auto flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                Shorten
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </Form>

      {/* Result Area */}
      {shortUrl && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 flex items-center justify-between transition-all duration-300">
          <span className="truncate text-indigo-600 font-medium">{shortUrl}</span>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" /> Copy
          </Button>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-500 text-sm font-medium">{error}</div>
      )}

      <SubmissionResult isLoading={isLoading} error={error} shortUrl={shortUrl} />
    </div>
  );
}
