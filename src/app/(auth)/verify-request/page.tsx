import { MailCheck } from "lucide-react";

export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="max-w-md text-center">
        <MailCheck className="mx-auto h-16 w-16 text-indigo-500" />
        <h1 className="mt-6 text-3xl font-bold tracking-tight">Check your email</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We&apos;ve sent a sign-in link to your inbox. Please check your email to continue.
        </p>
      </div>
    </div>
  );
}