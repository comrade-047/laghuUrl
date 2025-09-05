import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UpdateProfileForm } from "@/components/forms/UpdateProfileForm";
import { DeleteAccountForm } from "@/components/forms/DeleteAccountForm";

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
    <div className="flex justify-center">
      <div className="w-full max-w-3xl space-y-10">
        {/* Page Heading */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Manage your account settings and preferences.
          </p>
        </div>

        <UpdateProfileForm user={user} />
        <DeleteAccountForm />
      </div>
    </div>
  );
}
