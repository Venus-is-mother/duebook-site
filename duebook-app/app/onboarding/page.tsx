"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [usageType, setUsageType] = useState("Freelancer");
  const [businessName, setBusinessName] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const usageOptions = [
    { key: "Freelancer", desc: "Client work, projects" },
    { key: "Shopkeeper", desc: "In-person sales, receipts" },
    { key: "Company", desc: "Contracts, letterhead" },
    { key: "Individual", desc: "One-off sale" },
  ];

  async function finish() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/onboarding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessName, currency }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Something went wrong saving your details.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="onboarding-bg">
      <div className="onboarding-wrap">
        <div className="brand"><span className="dot"></span>Duebook</div>

        <div className="steps-row">
          <div className={`step-bar ${step >= 1 ? "done" : ""}`}></div>
          <div className={`step-bar ${step >= 2 ? "done" : ""}`}></div>
          <div className={`step-bar ${step >= 3 ? "done" : ""}`}></div>
        </div>

        <div className="onboarding-panel">
          {step === 1 && (
            <>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--stamp-green)", marginBottom: 8 }}>STEP 1 OF 3</div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 21 }}>What are you billing for?</h1>
              <p style={{ color: "var(--slate)", fontSize: 13.5, marginBottom: 22 }}>This just picks your starting template. You can switch anytime.</p>
              <div className="tile-grid">
                {usageOptions.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    className={`tile ${usageType === opt.key ? "selected" : ""}`}
                    onClick={() => setUsageType(opt.key)}
                  >
                    <div className="name">{opt.key}</div>
                    <div className="desc">{opt.desc}</div>
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="btn btn-gold" onClick={() => setStep(2)}>Continue</button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--stamp-green)", marginBottom: 8 }}>STEP 2 OF 3</div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 21 }}>Your business details</h1>
              <p style={{ color: "var(--slate)", fontSize: 13.5, marginBottom: 22 }}>This appears at the top of every invoice you send.</p>
              <div className="field">
                <label>Business name</label>
                <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Ngozi Fashion House" />
              </div>
              <div className="field">
                <label>Default currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  style={{ width: "100%", padding: 11, borderRadius: 4, border: "1px solid #ddd6c4" }}
                >
                  <option value="NGN">₦ Nigerian Naira</option>
                  <option value="USD">$ US Dollar</option>
                  <option value="GBP">£ British Pound</option>
                </select>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                <button className="btn btn-gold" onClick={() => setStep(3)}>Continue</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--stamp-green)", marginBottom: 8 }}>STEP 3 OF 3</div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 21 }}>Almost there</h1>
              <p style={{ color: "var(--slate)", fontSize: 13.5, marginBottom: 22 }}>
                Logo upload isn't wired up yet, we'll add that once file storage is set up. You can finish setup without one for now.
              </p>
              {error && <p className="error-text">{error}</p>}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button className="btn btn-outline" onClick={() => setStep(2)}>Back</button>
                <button className="btn btn-gold" onClick={finish} disabled={loading}>
                  {loading ? "Saving..." : "Finish setup"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}