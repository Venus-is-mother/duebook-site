import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NewInvoiceForm from "./NewInvoiceForm";

export default async function NewInvoicePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id as string;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const invoicesThisMonth = await prisma.invoice.count({
    where: { userId, createdAt: { gte: startOfMonth } },
  });

  if (user?.plan === "FREE" && invoicesThisMonth >= 15) {
    redirect("/paywall");
  }

  return (
    <div className="shell">
      <div className="sidebar">
        <Link href="/dashboard" className="brand"><span className="dot"></span>Duebook</Link>
        <div className="sidebar-nav">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/new">New invoice</Link>
        </div>
        <div className="sidebar-logout">
          <a href="/api/auth/signout">Log out</a>
        </div>
      </div>
      <main>
        <div className="topbar">
          <h1>New invoice</h1>
        </div>
        <NewInvoiceForm />
      </main>
    </div>
  );
}