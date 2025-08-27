import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

interface Params {
  params: {
    slug: string;
  };
}

export default async function RedirectPage({ params }: Params) {
  const { slug } = params;

  const link = await prisma.link.findUnique({
    where: { slug },
  });

  if (!link) {
    notFound();
  }

  if (link.expiresAt && new Date() > new Date(link.expiresAt)) {
    notFound();
  }

  await prisma.link.update({
    where: { slug },
    data: {
      clicks: {
        increment: 1,
      },
    },
  });

  redirect(link.originalUrl);
}