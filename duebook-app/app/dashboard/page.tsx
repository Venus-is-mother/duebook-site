import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function statusClass(status: string) {
  return status.toLowerCase();
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id as string;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const invoices = await prisma.invoice.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const invoicesThisMonth = await prisma.invoice.count({
    where: { userId, createdAt: { gte: startOfMonth } },
  });

  const limit = user?.plan === "FREE" ? 15 : null;
  const percentUsed = limit ? Math.min(100, (invoicesThisMonth / limit) * 100) : 0;

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
          <h1>Your invoices</h1>
          <Link href="/dashboard/new" className="btn btn-gold">+ New invoice</Link>
        </div>

        {limit && (
          <div className="usage-card">
            <div>
              <div className="usage-text">
                This month: <b>{invoicesThisMonth} / {limit}</b> free invoices used
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${percentUsed}%` }}></div>
              </div>
            </div>
          </div>
        )}

        {invoices.length === 0 ? (
          <div className="empty-card">
            <p>No invoices yet. Build your first one, it takes about a minute.</p>
            <Link href="/dashboard/new" className="btn btn-primary">Create your first invoice</Link>
          </div>
        ) : (
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Template</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv: any) => (
                  <tr key={inv.id}>
                    <td>{inv.clientName}<br /><span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--slate)" }}>{inv.invoiceNumber}</span></td>
                    <td style={{ fontSize: 13 }}>{inv.template.charAt(0) + inv.template.slice(1).toLowerCase()}</td>
                    <td><span className={`status ${statusClass(inv.status)}`}>{inv.status}</span></td>
                    <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{inv.currency} {inv.total.toString()}</td>
                    <td>{inv.createdAt.toLocaleDateString()}</td>
                    <td><a href={`/api/invoices/${inv.id}/pdf`} style={{ color: "var(--navy)", fontWeight: 600, fontSize: 13 }}>Download PDF</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}