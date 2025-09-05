import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long."),
  username: z.string().regex(/^[a-z0-9_-]{3,15}$/g, 'Invalid username'),
  bio: z.string().max(160, "Bio must be 160 characters or less.").optional(),
});

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, username, bio } = updateUserSchema.parse(body);

    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: { username: username, NOT: { id: session.user.id } },
      });
      if (existingUser) {
        return NextResponse.json({ message: "Username is already taken." }, { status: 409 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: name,
        username : username,
        bio : bio
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    }

    console.error(error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return NextResponse.json({ message: "Account deleted successfully." }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}