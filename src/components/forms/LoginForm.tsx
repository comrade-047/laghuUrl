"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const SocialIcon = ({ type }: { type: "google" | "github" }) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2">
    {type === "google" ? (
      <>
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 24c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 22.52 7.7 24 12 24z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.48 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </>
    ) : (
      <path
        fill="currentColor"
        d="M12 1.27a11 11 0 00-3.48 21.46c.55.1.73-.24.73-.53v-1.84c-3.03.66-3.67-1.46-3.67-1.46a2.84 2.84 0 00-1.18-1.55c-.97-.66.07-.65.07-.65a2.24 2.24 0 011.63 1.1c.94 1.63 2.48 1.16 3.08.88a2.29 2.29 0 01.66-1.43c-2.35-.26-4.82-1.18-4.82-5.23a4.08 4.08 0 011.1-2.84A3.72 3.72 0 015.63 5c.88-.28 2.88 1.08 2.88 1.08a9.83 9.83 0 015 0s2-1.36 2.88-1.08a3.72 3.72 0 01.1 2.34a4.08 4.08 0 011.1 2.84c0 4.06-2.47 4.96-4.82 5.22a2.53 2.53 0 01.73 2v2.75c0 .29.18.63.73.53A11 11 0 0012 1.27"
      />
    )}
  </svg>
);

const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});
type FormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = React.useState<"google" | "github" | "credentials" | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", password: "" },
  });

  React.useEffect(() => {
    const error = searchParams.get("error");
    if (error === "OAuthAccountNotLinked") {
      toast.error("Account not found.", {
        description: "Please create an account first to link your social login.",
      });
    }
  }, [searchParams]);

  React.useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const onCredentialsSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading("credentials");
    try {
      const signInResult = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) throw new Error(signInResult.error);

      toast.success("Signed in successfully!");
      router.push("/dashboard");
    } catch (error) {
      let description = "Please check your details and try again.";
      if (error instanceof Error) {
        if (error.message === "CredentialsSignin") {
          description = "Invalid username or password.";
        } else {
          description = error.message;
        }
      }
      toast.error("Sign in failed", { description });
    } finally {
      setIsLoading(null);
    }
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-1">
            <Image src="/logo.svg" alt="laghuUrl Logo" width={120} height={40} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onCredentialsSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="yourusername" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={!!isLoading}>
                {isLoading === "credentials" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={() => {
                setIsLoading("google");
                signIn("google");
              }}
              disabled={!!isLoading}
            >
              {isLoading === "google" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SocialIcon type="google" />}{" "}
              Sign in with Google
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                setIsLoading("github");
                signIn("github");
              }}
              disabled={!!isLoading}
            >
              {isLoading === "github" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SocialIcon type="github" />}{" "}
              Sign in with GitHub
            </Button>
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
