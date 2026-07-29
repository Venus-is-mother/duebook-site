"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.error || "Something went wrong.");
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    router.push("/onboarding");
  }

  return (
    <div className="auth-wrap">
      <Link href="/" className="brand"><span className="dot"></span>Duebook</Link>
      <h1>Create your account</h1>
      <div className="sub">Free to start. 15 invoices a month, no card needed.</div>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Full name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-gold" style={{ width: "100%" }}>
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>

      <div className="foot-link">Already have an account? <Link href="/login">Log in</Link></div>
    </div>
  );
}