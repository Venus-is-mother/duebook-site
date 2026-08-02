import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }
  const userId = (session.user as any).id as string;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const invoicesThisMonth = await prisma.invoice.count({
    where: { userId, createdAt: { gte: startOfMonth } },
  });

  if (user?.plan === "FREE" && invoicesThisMonth >= 15) {
    return NextResponse.json(
      { error: "You've used all 15 free invoices this month." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { clientName, clientEmail, items, template } = body;
    const validTemplates = ["BASIC", "STANDARD", "SALES", "CORPORATE"];
    const chosenTemplate = validTemplates.includes(template) ? template : "BASIC";

    if (!clientName || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Client name and at least one line item are required." },
        { status: 400 }
      );
    }

    let subtotal = 0;
    const cleanItems = items.map((it: any) => {
      const quantity = Number(it.quantity) || 0;
      const unitPrice = Number(it.unitPrice) || 0;
      subtotal += quantity * unitPrice;
      return { description: it.description || "Item", quantity, unitPrice };
    });

    const invoiceCount = await prisma.invoice.count({ where: { userId } });
    const invoiceNumber = `INV-${String(invoiceCount + 1).padStart(4, "0")}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        clientName,
        clientEmail: clientEmail || null,
        currency: "NGN",
        template: chosenTemplate,
        subtotal,
        tax: 0,
        total: subtotal,
        userId,
        items: { create: cleanItems },
      },
    });

    return NextResponse.json({ success: true, invoiceId: invoice.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}