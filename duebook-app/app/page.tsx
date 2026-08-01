import Link from "next/link";

export default function Home() {
  return (
    <>
      <nav className="nav-bar">
        <div className="nav-top">
          <div className="brand"><span className="dot"></span>Duebook</div>
        </div>
        <div className="nav-row">
          <div className="nav-links">
            <a href="#pricing" className="nav-link-pill">Pricing</a>
          </div>
          <div className="nav-actions">
            <Link href="/login" className="btn btn-outline">Log in</Link>
            <Link href="/signup" className="btn btn-primary">Get started free</Link>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div>
          <h1>Invoices that look like<br /><em>you got paid</em> to make them.</h1>
          <p className="hero-sub">Build, brand, and download professional invoices in minutes, free for 15 a month.</p>
          <div className="hero-actions">
            <Link href="/signup" className="btn btn-primary">Create your first invoice</Link>
            <a href="#pricing" className="btn btn-gold">See pricing</a>
          </div>
          <div className="hero-note">15 free / month · ₦1,200 monthly · ₦12,000 yearly</div>
        </div>

        <div className="invoice-preview-card">
          <div className="perf-strip"></div>
          <div className="ipc-head">
            <div className="biz">Adaeze Studio</div>
            <div className="meta"><span>INV-0042</span><span>14 Jul 2026</span></div>
          </div>
          <div className="ipc-body">
            <div className="ipc-line"><span>Logo & brand kit</span><span className="leader"></span><span>₦85,000</span></div>
            <div className="ipc-line"><span>Social templates (x6)</span><span className="leader"></span><span>₦40,000</span></div>
            <div className="ipc-total"><span>Total due</span><span className="val">₦125,000</span></div>
          </div>
          <div className="stamp-mark">PAID</div>
        </div>
      </section>

      <section className="audience">
        <div className="audience-grid">
          <div className="audience-card">
            <span className="tag">Freelancer</span>
            <h3>Get paid on time</h3>
            <p>Send a proper invoice in the time it takes to send a DM.</p>
          </div>
          <div className="audience-card">
            <span className="tag">Shopkeeper</span>
            <h3>Receipt on the spot</h3>
            <p>Build and print a customer receipt right at the counter.</p>
          </div>
          <div className="audience-card">
            <span className="tag">Individual</span>
            <h3>One-off, no fuss</h3>
            <p>Selling something once? One invoice, no setup needed.</p>
          </div>
          <div className="audience-card">
            <span className="tag">Company</span>
            <h3>Look the part</h3>
            <p>Letterhead templates for growing teams.</p>
          </div>
        </div>
      </section>

      <section className="pricing" id="pricing">
        <div className="section-head" style={{ margin: "0 auto 40px" }}>
          <h2>Pay only if you outgrow free.</h2>
        </div>
        <div className="pricing-grid">
          <div className="ticket">
            <div className="plan-name">Free</div>
            <div className="price">₦0<span> / month</span></div>
            <p style={{ fontSize: 13.5, color: "var(--slate)", marginBottom: 20 }}>15 invoices/month · all templates · ads shown</p>
            <Link href="/signup" className="btn btn-outline" style={{ width: "100%" }}>Start free</Link>
          </div>
          <div className="ticket featured">
            <div className="plan-name">Monthly</div>
            <div className="price">₦1,200<span> / month</span></div>
            <p style={{ fontSize: 13.5, color: "#aab2c0", marginBottom: 20 }}>Unlimited invoices · no ads</p>
            <Link href="/signup" className="btn btn-gold" style={{ width: "100%" }}>Go monthly</Link>
          </div>
          <div className="ticket">
            <div className="plan-name">Yearly</div>
            <div className="price">₦12,000<span> / year</span></div>
            <p style={{ fontSize: 13.5, color: "var(--slate)", marginBottom: 20 }}>Unlimited invoices · no ads</p>
            <Link href="/signup" className="btn btn-outline" style={{ width: "100%" }}>Save ~17%, pay yearly</Link>
          </div>
        </div>
      </section>

      <footer>Duebook, invoices that get you paid.</footer>
    </>
  );
}