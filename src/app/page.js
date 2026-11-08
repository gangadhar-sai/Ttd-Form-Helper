"use client";

import { useState, useEffect } from "react";

export default function Home() {
  return (
    <div className="site">
      <Header />
      <main>
        <Hero />
        <UseCases />
        <Features />
        <Architecture />
        <Install />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

/* ───────────── HEADER ───────────── */

function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <div className="header__inner">
        <a href="#" className="header__brand">
          <span className="header__mark" aria-hidden="true">TFH</span>
          <span className="header__name">TTD Form Helper</span>
        </a>

        <nav className="header__nav" aria-label="Main navigation">
          <a href="#use-cases">Use Cases</a>
          <a href="#features">Features</a>
          <a href="#architecture">Architecture</a>
          <a href="#install">Install</a>
        </nav>

        <a
          href="https://github.com/gangadhar-sai/Ttd-Form-Helper"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--ghost"
        >
          View on GitHub
        </a>
      </div>
    </header>
  );
}

/* ───────────── HERO ───────────── */

function Hero() {
  return (
    <section className="hero">
      <p className="hero__eyebrow">Manifest V3 · Free · Open Source</p>
      <h1 className="hero__title">
        Automate your TTD booking forms<br />
        <em className="hero__italic">in seconds, not minutes</em>
      </h1>
      <p className="hero__lead">
        Stop fighting against time during darshan booking windows. TTD Form Helper
        securely saves your pilgrim details and fills the entire TTD website form
        with a single click. Your data never leaves your browser.
      </p>
      <div className="hero__actions">
        <a href="#install" className="btn btn--dark">Get the extension</a>
        <a href="/ttd-form-helper-v1.4.5.zip" className="btn btn--ghost" download>
          Download ZIP
        </a>
      </div>
      <p className="hero__note">Chrome · Edge · Brave · Arc</p>
    </section>
  );
}

/* ───────────── USE CASES ───────────── */

function UseCases() {
  return (
    <section className="problem" id="use-cases">
      <div className="container">
        <p className="section-label">Use Cases</p>
        <h2 className="heading-serif heading-serif--lg">
          Perfect for high-demand bookings
        </h2>
        <div className="use-grid">
          <div className="use-case">
            <h3>Special Entry Darshan</h3>
            <p>Fill pilgrim details and contact info for the ₹300/Sri PAT darshan in under 3 seconds.</p>
          </div>
          <div className="use-case">
            <h3>Srivari Seva</h3>
            <p>Automate volunteer registration, including personal details, fitness checks, and photo/ID proof attachment.</p>
          </div>
          <div className="use-case">
            <h3>Group & Srivani</h3>
            <p>Manage large seva teams or Srivani family bookings with one-click group filling.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── FEATURES ───────────── */

const FEATURES = [
  { title: "One-click autofill", desc: "Fill up to 6 pilgrim rows and contact details simultaneously." },
  { title: "Saved pilgrim roster", desc: "Build a permanent address book of family and friends to reuse across any booking." },
  { title: "Live Aadhaar validation", desc: "Verhoeff checksum catches typos instantly, preventing last-minute submission rejections." },
  { title: "Floating widget", desc: "Fill and Continue without opening the extension popup, even during slow site traffic." },
  { title: "Senior Citizen support", desc: "Auto-detects age 65+ and auto-attaches proof documents." },
  { title: "AES-GCM encryption", desc: "Optional local vault encryption ensures your data is safe on shared computers." },
];

function Features() {
  return (
    <section className="features" id="features">
      <div className="container">
        <p className="section-label">Features</p>
        <h2 className="heading-serif heading-serif--lg">Designed for reliability</h2>
        <div className="features__grid">
          {FEATURES.map((f, i) => (
            <article key={i} className="feature-card">
              <span className="feature-card__num" aria-hidden="true">{(i + 1).toString().padStart(2, "0")}</span>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── ARCHITECTURE ───────────── */

function Architecture() {
  return (
    <section className="security" id="architecture">
      <div className="container">
        <div className="security__layout">
          <div className="security__left">
            <p className="section-label">Architecture</p>
            <h2 className="heading-serif heading-serif--lg">Built to be trusted</h2>
            <p className="security__body">
              TTD uses React event guards that block programmatic input. We bypass
              this cleanly without breaking site logic. Everything is local,
              static, and inspectable.
            </p>
          </div>
          <div className="security__right">
            <dl className="trust-list">
              <div className="trust-item">
                <dt>Main-world event bridge</dt>
                <dd>Uses a bridge script in the page's MAIN world to simulate trusted, human-like events that React accepts.</dd>
              </div>
              <div className="trust-item">
                <dt>Angular control injection</dt>
                <dd>Injects values directly into the underlying Angular/Material form controls to ensure guaranteed change detection.</dd>
              </div>
              <div className="trust-item">
                <dt>Zero-network footprint</dt>
                <dd>Zero external libraries. CSP <code>connect-src 'self'</code> ensures the extension cannot talk to any server.</dd>
              </div>
              <div className="trust-item">
                <dt>Pure Web Crypto</dt>
                <dd>Encryption happens locally using the browser's native Web Crypto API. No external dependencies.</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── INSTALL ───────────── */

function Install() {
  const steps = [
    "Download the extension ZIP file using the button below.",
    "Unzip the file into a permanent folder on your computer.",
    "Open your browser and navigate to chrome://extensions",
    "Enable Developer mode (toggle top-right).",
    "Click Load unpacked and select the folder you unzipped.",
    "Pin TTD Form Helper to your toolbar.",
  ];

  return (
    <section className="install" id="install">
      <div className="container">
        <p className="section-label">Installation</p>
        <h2 className="heading-serif heading-serif--lg">Set up in 2 minutes</h2>
        <div className="install__actions">
          <a href="/ttd-form-helper-v1.4.5.zip" className="btn btn--dark btn--large" download>
            Download Extension ZIP (v1.4.5)
          </a>
        </div>
        <ol className="steps">
          {steps.map((s, i) => (
            <li key={i}>
              <span className="steps__num">{String(i + 1).padStart(2, "0")}</span>
              <span className="steps__text">{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────── CTA ───────────── */

function CTA() {
  return (
    <section className="cta">
      <div className="container">
        <h2 className="heading-serif heading-serif--lg">
          Ready to save time?
        </h2>
        <p className="cta__body">
          Install the extension now and be ready for the next booking window.
        </p>
        <a href="#install" className="btn btn--dark btn--large">
          Download ZIP
        </a>
      </div>
    </section>
  );
}

/* ───────────── FOOTER ───────────── */

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__row">
          <div className="footer__brand">
            <span className="footer__mark" aria-hidden="true">TFH</span>
            <span className="footer__name">TTD Form Helper</span>
          </div>
        </div>
        <p className="footer__copy">
          Independent tool — not affiliated with Tirumala Tirupati Devasthanams.
          Open Source (MIT).
        </p>
      </div>
    </footer>
  );
}
