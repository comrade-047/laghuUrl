import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
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
import { QrCodeDisplay } from "@/components/dashboard/QRCodeDisplay";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function LinkDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard/urls");
  }
  const param = await params;
  const link = await prisma.link.findUnique({
    where: { id: param.id, userId: session.user.id },
    include: { clicks: true },
  });

  if (!link) {
    notFound();
  }

  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${link.slug}`;

  // We no longer need to fetch. We just use the saved data.
  const metaData = {
    title: link.metaTitle,
    description: link.metaDescription,
    image: link.metaImage,
  };

  return (
    <div className="space-y-10">
      {/* Heading */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Link Analytics</h1>
        <p className="text-muted-foreground">
          Insights, QR codes, and engagement data for your short link.
        </p>
      </div>

      {/* Main Details Card */}
      <Card className="shadow-md border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <CardHeader className="text-center">
          <CardTitle>Link Details</CardTitle>
          <CardDescription>
            Preview, short link, and QR code in one place.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Left: Destination Preview */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Destination Preview
            </h3>
            <div className="flex items-center gap-4 rounded-lg border bg-muted/40 p-4">
              {metaData.image && (
                <Image
                  src={metaData.image}
                  alt={metaData.title || "Link preview"}
                  width={80}
                  height={80}
                  className="rounded-md object-cover h-20 w-20 hidden sm:block"
                />
              )}
              <div className="space-y-1 min-w-0">
                <p className="text-base font-semibold truncate">
                  {metaData.title || link.originalUrl}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {metaData.description || "No description available."}
                </p>
                <Link
                  href={link.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Visit Original <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Short URL + QR */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              QR for Short Link
            </h3>
            <QrCodeDisplay shortUrl={shortUrl} slug={link.slug} />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
            <CardDescription>All-time link visits</CardDescription>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {link.clicks.length.toLocaleString()}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Created</CardTitle>
            <CardDescription>When the link was made</CardDescription>
          </CardHeader>
          <CardContent className="text-lg font-medium">
            {format(new Date(link.createdAt), "PP")}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Expires</CardTitle>
            <CardDescription>Link expiration date</CardDescription>
          </CardHeader>
          <CardContent className="text-lg font-medium">
            {link.expiresAt ? format(new Date(link.expiresAt), "PP") : "Never"}
          </CardContent>
        </Card>
      </div>

      {/* Analytics */}
      <LinkAnalytics clicks={link.clicks} />
    </div>
  );
}