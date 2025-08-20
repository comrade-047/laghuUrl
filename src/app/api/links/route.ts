import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";
import { NextResponse } from "next/server";
import { z } from "zod";

const createLinkSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { url: originalUrl } = createLinkSchema.parse(body);

    let slug: string;
    let isSlugUnique = false;

    while (!isSlugUnique) {
      slug = generateSlug();
      const existingLink = await prisma.link.findUnique({ where: { slug } });
      if (!existingLink) {
        isSlugUnique = true;
      }
    }

    const newLink = await prisma.link.create({
      data: {
        originalUrl,
        slug,
      },
    });

    const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${newLink.slug}`;

    return NextResponse.json({ shortUrl }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
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
