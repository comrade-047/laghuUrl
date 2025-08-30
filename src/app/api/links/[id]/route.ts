import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const linkToDelete = await prisma.link.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!linkToDelete) {
      return NextResponse.json({ message: "Link not found or you do not have permission to delete it." }, { status: 404 });
    }

    await prisma.link.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Link deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}