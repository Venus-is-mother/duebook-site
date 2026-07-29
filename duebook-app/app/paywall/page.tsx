import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function PaywallPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id as string;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const nextReset = new Date(startOfMonth);
  nextReset.setMonth(nextReset.getMonth() + 1);

  const invoicesThisMonth = await prisma.invoice.count({
    where: { userId, createdAt: { gte: startOfMonth } },
  });

  return (
    <div className="paywall-bg">
      <div className="paywall-card">
        <div className="paywall-head">
          <div className="paywall-stamp">LIMIT<br />REACHED</div>
          <h1>This month's ledger is full.</h1>
          <p>You've used all 15 free invoices this month. Upgrade to keep billing, or wait for next month.</p>
        </div>

        <div className="ledger-line">
          <span>Invoices used</span>
          <span>{invoicesThisMonth} / 15</span>
        </div>

        <div className="paywall-options">
          <button className="btn btn-primary" disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>
            Monthly — ₦1,200 (payments coming soon)
          </button>
          <button className="btn btn-outline" disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>
            Yearly — ₦12,000 (payments coming soon)
          </button>
        </div>

        <div className="paywall-note">
          Your free invoices reset {nextReset.toLocaleDateString()}. Payment options will be enabled once billing is connected.
        </div>
      </div>
    </div>
  );
}