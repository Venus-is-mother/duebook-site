"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Item = { description: string; quantity: string; unitPrice: string };

export default function NewInvoiceForm() {
  const router = useRouter();

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [items, setItems] = useState<Item[]>([{ description: "", quantity: "1", unitPrice: "" }]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateItem(index: number, field: keyof Item, value: string) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
  }
  function addItem() {
    setItems((prev) => [...prev, { description: "", quantity: "1", unitPrice: "" }]);
  }
  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  const total = items.reduce(
    (sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
    0
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientName, clientEmail, items }),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      if (res.status === 403) {
        router.push("/paywall");
        return;
      }
      setError(data.error || "Something went wrong.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="table-card" style={{ padding: 28, maxWidth: 560 }}>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Client name</label>
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} required />
        </div>
        <div className="field">
          <label>Client email (optional)</label>
          <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
        </div>

        <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--slate)", marginBottom: 10, marginTop: 6 }}>
          Line items
        </label>

        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
            <input
              placeholder="Description"
              value={item.description}
              onChange={(e) => updateItem(i, "description", e.target.value)}
              style={{ flex: 2, padding: 10, borderRadius: 4, border: "1px solid #ddd6c4" }}
            />
            <input
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) => updateItem(i, "quantity", e.target.value)}
              style={{ width: 60, padding: 10, borderRadius: 4, border: "1px solid #ddd6c4" }}
            />
            <input
              placeholder="Price"
              value={item.unitPrice}
              onChange={(e) => updateItem(i, "unitPrice", e.target.value)}
              style={{ width: 100, padding: 10, borderRadius: 4, border: "1px solid #ddd6c4" }}
            />
            {items.length > 1 && (
              <button type="button" onClick={() => removeItem(i)} className="btn btn-outline" style={{ padding: "8px 12px" }}>
                ×
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addItem} className="btn btn-outline" style={{ marginBottom: 22, fontSize: 13 }}>
          + Add line item
        </button>

        <div style={{ borderTop: "1px solid var(--navy)", paddingTop: 14, marginBottom: 18, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>Total</span>
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 19 }}>₦{total.toLocaleString()}</span>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={loading} className="btn btn-gold" style={{ width: "100%" }}>
          {loading ? "Saving..." : "Save invoice"}
        </button>
      </form>
    </div>
  );
}