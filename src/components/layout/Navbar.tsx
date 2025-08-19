import Link from "next/link";
import { ModeToggle } from "../mode-toggle";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white hover:opacity-90 transition-opacity"
        >
          laghu<span className="text-indigo-500 dark:text-indigo-400">Url</span>
        </Link>

        <ModeToggle />
      </div>
    </header>
  );
};

export default Navbar;
