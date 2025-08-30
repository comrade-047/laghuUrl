import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export default async function RedirectPage({
  params: { slug }, 
}: {
  params: { slug: string };
}) {
  const link = await prisma.link.findUnique({
    where: { slug },
  });

  if (!link) {
    notFound();
  }

  if (link.expiresAt && new Date() > new Date(link.expiresAt)) {
    notFound();
  }

  await prisma.click.create({
    data: {
      linkId: link.id,
    },
  });

  redirect(link.originalUrl);
}