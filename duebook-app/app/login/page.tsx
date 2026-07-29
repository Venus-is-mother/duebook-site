"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (res?.error) {
      setError("Incorrect email or password.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="auth-wrap">
      <Link href="/" className="brand"><span className="dot"></span>Duebook</Link>
      <h1>Welcome back</h1>
      <div className="sub">Log in to pick up where you left off.</div>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-gold" style={{ width: "100%" }}>
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="foot-link">New here? <Link href="/signup">Create a free account</Link></div>
    </div>
  );
}