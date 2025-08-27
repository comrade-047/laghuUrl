import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";


const urlSchema = z.string();

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const urlToValidate = urlSchema.parse(searchParams.get("url"));

    const response = await fetch(urlToValidate, {
      method: 'HEAD',
      redirect: 'follow', 
    });

    if (response.ok) { 
      return NextResponse.json({
        isValid: true,
        message: "Link is live and reachable.",
        status: response.status,
      });
    } else {
      return NextResponse.json({
        isValid: false,
        message: `Link returned a ${response.status} status.`,
        status: response.status,
      });
    }
  } catch (error) {
    console.error('Error validating the url',error);
    return NextResponse.json({
      isValid: false,
      message: "Link could not be reached.",
      status: 500,
    });
  }
}