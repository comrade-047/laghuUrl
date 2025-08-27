import { UrlShortenerForm } from "@/components/forms/UrlShortenerForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, LinkIcon, MousePointerClick, XCircle } from "lucide-react";
import Link from "next/link";
import { LinkActions } from "@/components/dashboard/LinkActions";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const userId = session.user.id;
  const now = new Date();

  const links = await prisma.link.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const totalLinks = links.length;
  const totalClicks = links.reduce((acc, link) => acc + link.clicks, 0);

  const activeLinks = links.filter(
    (link) => !link.expiresAt || link.expiresAt > now
  ).length;

  const expiredLinks = totalLinks - activeLinks;

  const stats = [
    {
      title: "Total Links",
      value: totalLinks.toLocaleString(),
      icon: <LinkIcon className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "Total Clicks",
      value: totalClicks.toLocaleString(),
      icon: <MousePointerClick className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "Active Links",
      value: activeLinks.toLocaleString(),
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    {
      title: "Expired Links",
      value: expiredLinks.toLocaleString(),
      icon: <XCircle className="h-5 w-5 text-red-500" />,
    },
  ];

  const recentLinks = links.slice(0, 5);
  const displayName = session.user.name?.split(" ")[0] || session.user.username;

  return (
    <>
      {/* Welcome + Form */}
      <div className="flex justify-center">
        <div className="w-full bg-white dark:bg-slate-900 shadow-sm rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-slate-800">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center">
            Welcome {displayName}! 👋
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300 text-center">
            Create, manage, and analyze your short links in one place.
          </p>

          <div className="mt-8 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
              Create a new short link
            </h3>
            <UrlShortenerForm />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="shadow-sm border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          >
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Links or Empty State */}
      <Card className="shadow-sm border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-8">
        <CardHeader>
          <CardTitle>Recent Links</CardTitle>
        </CardHeader>
        <CardContent>
          {recentLinks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground uppercase">
                  <tr>
                    <th scope="col" className="py-3 px-4 text-left">Short URL</th>
                    <th scope="col" className="py-3 px-4 text-left">Original URL</th>
                    <th scope="col" className="py-3 px-4 text-center">Clicks</th>
                    <th scope="col" className="py-3 px-4 text-left">Created</th>
                    <th scope="col" className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  {recentLinks.map((link) => (
                    <tr
                      key={link.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <td className="py-3 px-4 font-medium text-indigo-600 dark:text-indigo-400 truncate max-w-[200px]">
                        <Link
                          href={`/${link.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          {process.env.NEXT_PUBLIC_BASE_URL?.replace(/^https?:\/\//, '')}/{link.slug}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground truncate max-w-xs">
                        {link.originalUrl}
                      </td>
                      <td className="py-3 px-4 text-center font-medium">
                        {link.clicks.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {formatDistanceToNow(link.createdAt, { addSuffix: true })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <LinkActions slug={link.slug} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-slate-500 dark:text-slate-400 py-8">
              <p className="mb-2">You haven&apos;t created any links yet.</p>
              <p className="text-sm">Use the form above to create your first one!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
