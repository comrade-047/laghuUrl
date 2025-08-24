import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { FloatingHeader } from "@/components/dashboard/FloatingHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar always visible */}
      <Sidebar />

      <div className="flex-1 relative overflow-y-auto transition-all duration-300">
        {/* FloatingHeader always visible */}
        <FloatingHeader />
        
        {/* Page-specific content */}
        <main className="p-6 pt-24 space-y-10">
          {children}
        </main>
      </div>
    </div>
  );
}
