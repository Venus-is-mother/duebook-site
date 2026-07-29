import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }
  const userId = (session.user as any).id as string;

  try {
    const body = await request.json();
    const { businessName, currency } = body;

    await prisma.user.update({
      where: { id: userId },
      data: { businessName, currency },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}