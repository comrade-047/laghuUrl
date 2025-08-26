"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  Link as LinkIcon,
  LayoutDashboard,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/urls", label: "My Links", icon: LinkIcon },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const displayName = session?.user?.name || session?.user?.username;

  return (
    <aside
      className={cn(
        "group flex flex-col border-r dark:border-gray-800",
        "bg-white/90 dark:bg-gray-900/80 backdrop-blur-md",
        "w-16 hover:w-64 transition-all duration-300 ease-in-out shadow-lg flex-none"
      )}
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b dark:border-gray-800 h-16">
        <Link href="/" className="flex items-center gap-3">
            <Image
                src="/logo.svg"
                alt="laghuUrl Logo"
                width={32}
                height={32}
            />
          <span className="text-lg font-bold text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            laghuUrl
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <TooltipProvider delayDuration={0}>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-md transition-all relative",
                      "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                      isActive &&
                        "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 font-semibold"
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-0 h-full w-1 bg-indigo-500 rounded-r-md" />
                    )}
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span
                      className={cn(
                        "opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="group-hover:hidden">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </TooltipProvider>

      {/* User info + logout */}
      <div className="p-4 border-t dark:border-gray-800 flex items-center gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage
            src={session?.user?.image ?? ""}
            alt={displayName ?? ""}
          />
          <AvatarFallback>
            {displayName?.charAt(0).toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {displayName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {session?.user?.email}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => signOut()}
          aria-label="Log out"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50 dark:hover:bg-red-900/30"
        >
          <LogOut className="h-5 w-5 text-red-500" />
        </Button>
      </div>
    </aside>
  );
}
