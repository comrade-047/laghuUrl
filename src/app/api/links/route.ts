import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";

const createLinkSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
  customSlug: z.string().regex(/^[a-z0-9_-]{3,20}$/, "Invalid custom name").optional().or(z.literal("")),
  expiresAt: z.string().datetime().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      url: originalUrl,
      customSlug,
      expiresAt: customExpiresAt,
    } = createLinkSchema.parse(body);

    const existingUrl = await prisma.link.findFirst({
      where: {
        userId: session.user.id,
        originalUrl,
      },
    });

    if (existingUrl) {
      return NextResponse.json(
        {
          message: "You already created a short link for this URL.",
          shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${existingUrl.slug}`,
        },
        { status: 409 }
      );
    }

    let finalSlug: string;
    let isCustom = false;

    if (customSlug) {
      const customLinkCount = await prisma.link.count({
        where: { userId: session.user.id, isCustom: true },
      });
      if (customLinkCount >= 5) {
        return NextResponse.json(
          { message: "You have reached your limit of 5 custom links." },
          { status: 403 }
        );
      }

      const existingLink = await prisma.link.findUnique({
        where: { slug: customSlug },
      });
      if (existingLink) {
        return NextResponse.json(
          { message: "This custom name is already in use." },
          { status: 409 }
        );
      }

      finalSlug = customSlug;
      isCustom = true;
    } else {
      let randomSlug = "";
      let isSlugUnique = false;
      while (!isSlugUnique) {
        randomSlug = generateSlug();
        const existingLink = await prisma.link.findUnique({
          where: { slug: randomSlug },
        });
        if (!existingLink) isSlugUnique = true;
      }
      finalSlug = randomSlug;
    }

    const expiresAt = customExpiresAt
      ? new Date(customExpiresAt)
      : new Date(Date.now() + 12 * 60 * 60 * 1000);

    const newLink = await prisma.link.create({
      data: {
        originalUrl,
        slug: finalSlug,
        userId: session.user.id,
        expiresAt,
        isCustom,
      },
    });

    const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${newLink.slug}`;
    return NextResponse.json({ newLink, shortUrl }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
