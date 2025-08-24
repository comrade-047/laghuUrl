import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UpdateProfileForm } from "@/components/forms/UpdateProfileForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/api/auth/signin?callbackUrl=/dashboard/settings");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="space-y-10">
      {/* Page Heading */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Profile Form */}
      <Card className="shadow-sm border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
            Profile
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Update your profile information like name, email, and avatar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateProfileForm user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
