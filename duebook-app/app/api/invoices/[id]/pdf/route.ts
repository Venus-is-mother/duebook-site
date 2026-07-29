import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InvoiceDocument } from "@/lib/InvoicePdfDocument";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }
  const userId = (session.user as any).id as string;
  const { id } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { items: true, user: true },
  });

  if (!invoice || invoice.userId !== userId) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }

  const element = React.createElement(InvoiceDocument, {
    invoice: {
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      currency: invoice.currency,
      total: invoice.total.toString(),
      createdAt: invoice.createdAt,
    },
    items: invoice.items.map((it) => ({
      description: it.description,
      quantity: it.quantity.toString(),
      unitPrice: it.unitPrice.toString(),
    })),
    businessName: invoice.user.businessName || "Your Business",
  });

  const buffer = await renderToBuffer(element as any);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.invoiceNumber}.pdf"`,
    },
  });
}