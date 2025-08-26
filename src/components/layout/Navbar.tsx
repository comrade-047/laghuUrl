"use client";

import * as React from "react";
import Link from "next/link";
import { Link as LinkIcon, LogOut, Menu, X, LayoutDashboard } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);

  const UserAvatar = () => {
    // 1. Create a displayName variable to handle both name and username
    const displayName = session?.user?.name || session?.user?.username;

    if (status === "authenticated") {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                {/* 2. Use the displayName variable here */}
                <AvatarImage
                  src={session.user?.image ?? ""}
                  alt={displayName ?? ""}
                />
                <AvatarFallback>
                  {displayName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuItem asChild>
              <Link href='/dashboard'>
                <LayoutDashboard className="mr-2 h-4 w-4"/>
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return <Button asChild>
      <Link href='/login'>Get Started</Link>
    </Button>;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <LinkIcon className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">
            laghu
            <span className="text-indigo-500 dark:text-indigo-400">Url</span>
          </span>
        </Link>

        {/* <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav> */}

        <div className="hidden items-center gap-4 md:flex">
          <ModeToggle />
          <UserAvatar />
        </div>

        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col items-center gap-6 py-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <ModeToggle />
            <UserAvatar />
          </nav>
        </div>
      )}
    </header>
  );
}
