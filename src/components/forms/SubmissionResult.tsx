"use client";

import * as React from "react";
import { Copy, Loader2, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SubmissionResultProps {
  isLoading: boolean;
  error: string | null;
  shortUrl: string | null;
}

export function SubmissionResult({
  isLoading,
  error,
  shortUrl,
}: SubmissionResultProps) {
  const [isCopied, setIsCopied] = React.useState(false);
  const [isSharing, setIsSharing] = React.useState(false);

  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleCopy = () => {
    if (!shortUrl) return;

    navigator.clipboard.writeText(shortUrl);
    setIsCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!shortUrl) return;

    if (navigator.share) {
      try {
        setIsSharing(true);
        await navigator.share({
          title: "Check out this short link",
          url: shortUrl,
        });
        toast.success("Link shared successfully!");
      } catch {
        toast.error("Sharing was cancelled or failed.");
      } finally {
        setIsSharing(false);
      }
    } else {
      toast.info("Sharing is not supported in your browser.");
    }
  };

  if (isLoading) {
    return (
      <div className="mt-6 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!shortUrl) return null;

  return (
    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 p-4 shadow-sm transition-all">
      <a
        href={shortUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="truncate text-indigo-600 font-medium hover:underline dark:text-indigo-400"
      >
        {shortUrl.replace(/^https?:\/\//, "")}
      </a>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopy}
          title="Copy link"
        >
          {isCopied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="sr-only">Copy link</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleShare}
          disabled={isSharing}
          title="Share link"
        >
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Share link</span>
        </Button>
      </div>
    </div>
  );
}