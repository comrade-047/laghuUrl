import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

const completeProfileSchema = z.object({
  username: z.string().regex(/^[a-z0-9_-]{3,15}$/g, 'Invalid username format.'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { username, password } = completeProfileSchema.parse(body);

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return NextResponse.json({ message: "Username is already taken." }, { status: 409 });
    }
    
    // Securely hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user with their new username AND hashed password
    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        username,
        password: hashedPassword,
        emailVerified : new Date()
      },
    });

    return NextResponse.json({ message: "Profile completed successfully." }, { status: 200 });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}