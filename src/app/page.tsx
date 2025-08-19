import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FeaturesSection from "@/components/landing/Features";

const HeroSection = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="container flex flex-col items-center gap-6 py-16 sm:py-20 md:py-28 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Shorten Links. Track Clicks. <br className="hidden sm:inline" />
          <span className="text-indigo-600">Simplify Sharing.</span>
        </h1>

        <p className="max-w-2xl text-lg sm:text-xl text-gray-600 dark:text-gray-300">
          laghuUrl makes it easy to create short links that are simple, fast, and reliable. 
          Start shortening today — it’s free.
        </p>

        <div className="mt-6 flex w-full max-w-2xl flex-col sm:flex-row items-center gap-3">
          <Input
            id="url"
            placeholder="Paste your long URL here..."
            className="flex-1 h-12 text-base sm:text-lg transition focus-visible:ring-2 focus-visible:ring-indigo-500"
          />
          <Button
            type="submit"
            className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-base sm:text-lg transition-colors"
          >
            Shorten
          </Button>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
    </>
  );
}
