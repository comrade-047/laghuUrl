"use client";

import { formatDistanceToNow, isBefore } from "date-fns";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LinkActions } from "@/components/dashboard/LinkActions";
import type { Link as LinkType, Click } from "@prisma/client";

type LinkWithClicks = LinkType & { clicks: Click[] };

export function LinksDataTable({ links }: { links: LinkWithClicks[] }) {
  const now = new Date();
  const pathname = usePathname();
  const isUrlPage = pathname === "/dashboard/urls";
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-slate-900 shadow-sm rounded-2xl border border-gray-200 dark:border-slate-800">
      <div className="overflow-x-auto">
        {links.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground uppercase">
              <tr>
                <th className="py-3 px-4 text-left">Short URL</th>
                <th className="py-3 px-4 text-left">Original URL</th>
                <th className="py-3 px-4 text-center">Clicks</th>
                <th className="py-3 px-4 text-left">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {links.map((link) => {
                const isExpired =
                  link.expiresAt && isBefore(new Date(link.expiresAt), now);
                const totalClicks = link.clicks.length;

                return (
                  <tr
                    key={link.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer`}
                    onClick={() => {
                      if (isUrlPage) {
                        router.push(`/dashboard/urls/${link.id}`);
                      }
                    }}
                  >
                    <td
                      className={`py-3 px-4 font-medium ${
                        isExpired
                          ? "text-red-600 dark:text-red-400"
                          : "text-indigo-600 dark:text-indigo-400"
                      }`}
                    >
                      <Link
                        href={`/${link.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()} 
                      >
                        {process.env.NEXT_PUBLIC_BASE_URL?.replace(
                          /^https?:\/\//,
                          ""
                        )}
                        /{link.slug}
                      </Link>
                    </td>
                    <td
                      className={`py-3 px-4 truncate max-w-xs ${
                        isExpired
                          ? "text-red-500 dark:text-red-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {link.originalUrl}
                    </td>
                    <td
                      className={`py-3 px-4 text-center font-medium ${
                        isExpired
                          ? "text-red-600 dark:text-red-400"
                          : "text-foreground"
                      }`}
                    >
                      {totalClicks.toLocaleString()}
                    </td>
                    <td
                      className={`py-3 px-4 ${
                        isExpired
                          ? "text-red-500 dark:text-red-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {formatDistanceToNow(new Date(link.createdAt), {
                        addSuffix: true,
                      })}
                      {isExpired && " • Expired"}
                    </td>
                    <td
                      className="py-3 px-4 text-right"
                      onClick={(e) => e.stopPropagation()} 
                    >
                      <LinkActions link={link} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-slate-500 dark:text-slate-400 py-8">
            <p className="mb-2">You haven&apos;t created any links yet.</p>
            <p className="text-sm">
              Use the form above to create your first one!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
