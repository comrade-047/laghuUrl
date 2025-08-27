"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { useState } from "react";

export function LinkActions({ slug }: { slug: string }) {
  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000); 
    } catch (error) {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      aria-label="Copy short link to clipboard"
      title={copied ? "Copied!" : "Copy link"}
    >
      <Copy className="h-4 w-4" />
      <span className="sr-only">Copy Link</span>
    </Button>
  );
}

