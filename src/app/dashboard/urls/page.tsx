import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LinksDataTable } from "@/components/dashboard/LinksDataTable";
import { UrlShortenerForm } from "@/components/forms/UrlShortenerForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function MyLinksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard/urls");
  }

  const links = await prisma.link.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include : {
      clicks : true
    }
  });

  return (
    <div className="space-y-10">
      <Card className="w-full shadow-sm border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">My Links</CardTitle>
          <CardDescription className="text-muted-foreground">
            Create, view, and manage all your short links.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UrlShortenerForm
            showCustomSlug={true}
            showCustomExpiration={true}
          />
        </CardContent>
      </Card>

      {/* Links table */}
      <div className="w-full">
        <LinksDataTable links={links} />
      </div>
    </div>
  );
}
