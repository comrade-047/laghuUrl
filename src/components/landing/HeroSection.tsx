import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="container flex flex-col items-center gap-6 py-16 sm:py-20 md:py-28 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white">
          Shorten Links. Track Clicks. <br className="hidden sm:inline" />
          <span className="text-indigo-600 dark:text-indigo-400">Simplify Sharing.</span>
        </h1>

        <p className="max-w-2xl text-lg sm:text-xl text-gray-600 dark:text-gray-300">
          Join laghuUrl to create short links that are simple, fast, and reliable. All features are available after a quick sign-up.
        </p>

        <div className="mt-6 flex w-full max-w-2xl flex-col items-center gap-3 sm:flex-row">
          <div className="relative w-full flex-1">
            <Input
              placeholder="Paste your long URL here..."
              className="h-14 w-full cursor-not-allowed rounded-lg border-gray-300 bg-white text-base dark:border-gray-600 dark:bg-gray-800"
              disabled
            />
            <div className="absolute inset-0 rounded-lg bg-gray-50/30 dark:bg-gray-900/30"></div>
          </div>
          
          <Button asChild size="lg" className="h-14 w-full rounded-lg bg-indigo-600 px-8 text-base text-white transition-colors hover:bg-indigo-700 sm:w-auto">
            <Link href="/api/auth/signin">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};