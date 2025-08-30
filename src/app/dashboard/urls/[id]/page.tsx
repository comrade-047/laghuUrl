import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { format } from "date-fns";
import { LinkAnalytics } from "@/components/dashboard/LinkAnalytics";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default async function LinkDetailsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard/urls");
  }

  const link = await prisma.link.findUnique({
    where: { id: params.id },
    include: { clicks: true },
  });

  if (!link || link.userId !== session.user.id) {
    redirect("/dashboard/urls");
  }

  return (
    <div className="space-y-10">
      {/* Heading */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Link Analytics</h1>
        <p className="text-muted-foreground">
          Track clicks and insights for your short link.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Short URL</CardTitle>
            <CardDescription>Your generated link</CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href={`/${link.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 font-medium break-all"
            >
              {process.env.NEXT_PUBLIC_BASE_URL}/{link.slug}
            </a>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
            <CardDescription>All-time clicks</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {link.clicks.length}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Created</CardTitle>
            <CardDescription>When the link was made</CardDescription>
          </CardHeader>
          <CardContent>
            {format(new Date(link.createdAt), "PPpp")}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Expires</CardTitle>
            <CardDescription>Expiry date</CardDescription>
          </CardHeader>
          <CardContent>
            {link.expiresAt ? format(new Date(link.expiresAt), "PPpp") : "Never"}
          </CardContent>
        </Card>
      </div>

      {/* Analytics */}
      <LinkAnalytics clicks={link.clicks} />
    </div>
  );
}
