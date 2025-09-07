import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import * as cheerio from "cheerio";

const updateLinkSchema = z.object({
  originalUrl: z.string().url({ message: "Please provide a valid URL." }),
});

export async function PATCH(req: Request, context: any) {
  const { params } = context;
  const { id } = params;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { originalUrl } = updateLinkSchema.parse(body);

    const linkToUpdate = await prisma.link.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!linkToUpdate) return NextResponse.json({ message: "Link not found or permission denied." }, { status: 404 });

    const metaData = { title: "", description: "", image: "" };
    try {
      const response = await fetch(originalUrl);
      if (response.ok) {
        const html = await response.text();
        const $ = cheerio.load(html);
        metaData.title = $('meta[property="og:title"]').attr("content") || $("title").text() || "";
        metaData.description =
          $('meta[property="og:description"]').attr("content") ||
          $('meta[name="description"]').attr("content") ||
          "";
        metaData.image =
          $('meta[property="og:image"]').attr("content") ||
          $('meta[property="og:image:url"]').attr("content") ||
          "";
      }
    } catch {}

    const updatedLink = await prisma.link.update({
      where: { id },
      data: {
        originalUrl,
        metaTitle: metaData.title,
        metaDescription: metaData.description,
        metaImage: metaData.image,
      },
    });

    return NextResponse.json(updatedLink, { status: 200 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: any) {
  const { params } = context;
  const { id } = params;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const linkToDelete = await prisma.link.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!linkToDelete)
      return NextResponse.json({ message: "Link not found or you do not have permission to delete it." }, { status: 404 });

    await prisma.link.delete({ where: { id } });

    return NextResponse.json({ message: "Link deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}
