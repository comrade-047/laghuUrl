import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

type RedirectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function RedirectPage({ params }: RedirectPageProps) {
  // Await params because it's typed as Promise
  const { slug } = await params;

  const link = await prisma.link.findUnique({
    where: { slug },
  });

  if (!link) notFound();

  if (link.expiresAt && new Date() > new Date(link.expiresAt)) {
    notFound();
  }

  await prisma.click.create({ data: { linkId: link.id } });

  redirect(link.originalUrl);

  return null; // TS happy
}
