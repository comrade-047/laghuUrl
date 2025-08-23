"use client";

import * as React from "react";
import { Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmissionResultProps {
  isLoading: boolean;
  error: string | null;
  shortUrl: string | null;
}

export function SubmissionResult({ isLoading, error, shortUrl }: SubmissionResultProps) {
  const [isCopied, setIsCopied] = React.useState<boolean>(false);

  const handleCopy = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); 
    }
  };

  if (isLoading) {
    return <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (shortUrl) {
    return (
      <div className="relative flex w-full animate-in fade-in-20 items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-base dark:border-gray-700 dark:bg-gray-800">
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-indigo-600 hover:underline dark:text-indigo-400"
        >
          {shortUrl.replace(/^https?:\/\//, "")}
        </a>
        <Button variant="ghost" size="icon" onClick={handleCopy} className="h-9 w-9">
          <Copy className="h-5 w-5" />
          <span className="sr-only">Copy</span>
        </Button>
        {isCopied && (
          <span className="absolute right-12 text-sm text-indigo-600">Copied!</span>
        )}
      </div>
    );
  }

  return null; 
}