import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp } = verifyOtpSchema.parse(body);

    const token = await prisma.verificationToken.findFirst({
      where: { identifier: email, token: otp },
    });

    if (!token) {
      return NextResponse.json({ message: "Invalid OTP provided." }, { status: 400 });
    }

    if (new Date() > new Date(token.expires)) {
      return NextResponse.json({ message: "OTP has expired." }, { status: 400 });
    }

    // OTP is valid, update the user to be verified
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    // Delete the used token
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email, token: otp } },
    });

    return NextResponse.json({ message: "Email verified successfully. You can now log in." }, { status: 200 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}