import { UrlShortenerForm } from "@/components/forms/UrlShortenerForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const stats = [
    { title: "Total Links", value: "128" },
    { title: "Total Clicks", value: "3,452" },
    { title: "Active Links", value: "112" },
    { title: "Expired Links", value: "16" },
  ];

  const recentLinks = [
    {
      short: "laghu.url/abc123",
      long: "https://github.com",
      clicks: 124,
      created: "2 days ago",
    },
    {
      short: "laghu.url/xyz789",
      long: "https://vercel.com",
      clicks: 89,
      created: "5 days ago",
    },
  ];

  return (
    <>
      {/* Welcome + Form */}
      <div className="flex justify-center ">
        <div className="w-full  bg-white dark:bg-slate-900 shadow-sm rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-slate-800">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center">
            Welcome to your Dashboard 👋
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="shadow-sm border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          >
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Links Table */}
      <div className="bg-white dark:bg-slate-900 shadow-sm rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-slate-800">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Recent Links
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="text-xs uppercase text-slate-500 dark:text-slate-400 border-b dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Short URL</th>
                <th className="py-3 px-4">Original URL</th>
                <th className="py-3 px-4 text-center">Clicks</th>
                <th className="py-3 px-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {recentLinks.map((link) => (
                <tr
                  key={link.short}
                  className="border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="py-4 px-4 font-medium text-indigo-600 dark:text-indigo-400">
                    {link.short}
                  </td>
                  <td className="py-4 px-4 truncate max-w-xs">{link.long}</td>
                  <td className="py-4 px-4 text-center">{link.clicks}</td>
                  <td className="py-4 px-4">{link.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
