"use client";

import { useState, useEffect } from "react";

export default function Home() {
  return (
    <div className="site">
      <Header />
      <main>
        <Hero />
        <Problem />
        <Features />
        <Tabs />
        <Performance />
        <Security />
        <Install />
        <Testimonial />
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
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#install">Install</a>
          <a href="#security">Security</a>
        </nav>

        <a
          href="https://github.com/gangadhar-sai/ttd-form-helper"
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
        Fill TTD booking forms<br />
        <em className="hero__italic">in seconds, not minutes</em>
      </h1>
      <p className="hero__lead">
        Save your pilgrim details once. Click one button and every field on the
        Tirupati booking portal populates instantly. Your data stays on your
        device — nothing ever leaves your browser.
      </p>
      <div className="hero__actions">
        <a href="#install" className="btn btn--dark">Install the extension</a>
        <a href="#features" className="btn btn--text">
          See what it does
          <span className="hero__arrow" aria-hidden="true">→</span>
        </a>
      </div>
      <p className="hero__note">Chrome · Edge · Brave · Arc · Free forever</p>
    </section>
  );
}

/* ───────────── PROBLEM ───────────── */

function Problem() {
  return (
    <section className="problem">
      <div className="problem__inner">
        <p className="section-label">The problem</p>
        <h2 className="heading-serif heading-serif--lg">
          Booking slots disappear in under a minute.<br />
          Manual form entry takes five.
        </h2>
        <p className="problem__body">
          Every darshan release opens for a narrow window. Thousands of people
          compete for a few hundred seats. By the time you've typed six names,
          Aadhaar numbers, contact details, and proof selections, the slot is gone.
          This extension removes the typing so you can focus on clicking Continue
          before anyone else.
        </p>
      </div>
    </section>
  );
}

/* ───────────── FEATURES ───────────── */

const FEATURES = [
  {
    num: "01",
    title: "One-click form fill",
    desc: "Save up to 6 pilgrims per group. Click Fill All and every name, age, Aadhaar, gender, and proof type populates across all rows simultaneously — typically in under 3 seconds.",
  },
  {
    num: "02",
    title: "Saved pilgrim roster",
    desc: "Build a master address book of family and friends. Add each person once with their full details, then pull them into any booking group with a single click. Never retype anyone twice.",
  },
  {
    num: "03",
    title: "Live Aadhaar validation",
    desc: "Every Aadhaar number is checked against India's real Verhoeff checksum algorithm as you type. A typo in any digit triggers an inline error before you ever reach the TTD site — saving you a rejected submission.",
  },
  {
    num: "04",
    title: "Floating quick-fill widget",
    desc: "A compact toolbar appears on every TTD page during rush hours. Hit Fill without opening the extension panel, and hit Continue to advance to the next step — all without alt-tabbing.",
  },
  {
    num: "05",
    title: "Multiple booking types",
    desc: "Five dedicated tabs cover Special Entry Darshan ₹300, Sri PAT, Srivari Seva registration, Srivani Darshan, and Senior Citizen / Differently Abled booking — each with its own layout and requirements.",
  },
  {
    num: "06",
    title: "Encrypted local vault",
    desc: "Optionally protect all saved data with a passphrase. Encryption uses AES-GCM-256 with PBKDF2 key derivation. The derived key lives only in browser memory and is wiped when you close the browser.",
  },
];

function Features() {
  return (
    <section className="features" id="features">
      <div className="container">
        <p className="section-label">What it does</p>
        <h2 className="heading-serif heading-serif--lg">
          Everything you need to beat the rush
        </h2>
      </div>
      <div className="container">
        <div className="features__grid">
          {FEATURES.map((f) => (
            <article key={f.num} className="feature-card">
              <span className="feature-card__num" aria-hidden="true">{f.num}</span>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── TABS SHOWCASE ───────────── */

const TABS = [
  { icon: "🚕", label: "Pilgrim Booking", detail: "Special Entry ₹300 & Sri PAT. Up to 6 members per group." },
  { icon: "🙏", label: "Srivari Seva", detail: "Volunteer registration with photo & ID proof attachment." },
  { icon: "👥", label: "Seva Group", detail: "Team bookings with shared address and quick member fill." },
  { icon: "💭E", label: "Srivani", detail: "Up to 9 pilgrims. Copy from Pilgrim tab in one click." },
  { icon: "👴", label: "Senior Citizen", detail: "Auto-detects 65+. Attaches age-proof document automatically." },
];

function Tabs() {
  return (
    <section className="tabs">
      <div className="container">
        <p className="section-label">Booking types</p>
        <h2 className="heading-serif heading-serif--lg">
          One extension, every TTD form
        </h2>
        <div className="tabs__grid">
          {TABS.map((t) => (
            <div key={t.label} className="tab-card">
              <span className="tab-card__icon" aria-hidden="true">{t.icon}</span>
              <h3 className="tab-card__label">{t.label}</h3>
              <p className="tab-card__detail">{t.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── PERFORMANCE ───────────── */

function Performance() {
  return (
    <section className="performance" id="how-it-works">
      <div className="container">
        <p className="section-label">Performance</p>
        <h2 className="heading-serif heading-serif--lg">
          Fast enough for peak-hour bookings
        </h2>
        <div className="stats-row">
          {[
            { value: "~3s", label: "Full form fill time\n(6 pilgrims)" },
            { value: "0", label: "Network requests\never made" },
            { value: "95%+", label: "Time saved vs\nmanual entry" },
            { value: "<50ms", label: "Per-field injection\nspeed" },
          ].map((s, i) => (
            <div key={i} className="stat-block">
              <div className="stat-block__value">{s.value}</div>
              <div className="stat-block__label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── SECURITY ───────────── */

function Security() {
  return (
    <section className="security" id="security">
      <div className="container">
        <div className="security__layout">
          <div className="security__left">
            <p className="section-label">Privacy & security</p>
            <h2 className="heading-serif heading-serif--lg">
              Your Aadhaar never leaves your machine
            </h2>
            <p className="security__body">
              Most extensions ask for broad permissions and phone home quietly.
              This one asks for almost nothing and cannot send data anywhere.
              Here's exactly how we prove it.
            </p>
          </div>
          <div className="security__right">
            <dl className="trust-list">
              <div className="trust-item">
                <dt>No network access</dt>
                <dd>CSP <code>connect-src 'self'</code> blocks all outbound requests. Verified: zero entries in DevTools → Network while using the extension.</dd>
              </div>
              <div className="trust-item">
                <dt>Minimal permissions</dt>
                <dd>Only <code>storage</code> and <code>sidePanel</code>. No tabs, cookies, clipboard, or downloads. Cannot read your browsing history.</dd>
              </div>
              <div className="trust-item">
                <dt>Site-restricted scripts</dt>
                <dd>Content scripts load only on <code>tirupatibalaji.ap.gov.in</code> and <code>ttdevasthanams.ap.gov.in</code>. Inactive everywhere else.</dd>
              </div>
              <div className="trust-item">
                <dt>Zero dependencies</dt>
                <dd>No npm packages. No CDN links. No <code>eval()</code>. Every source file is readable in a plain-text editor.</dd>
              </div>
              <div className="trust-item">
                <dt>AES-GCM vault encryption</dt>
                <dd>Optional passphrase protection via PBKDF2-SHA256 (210k rounds). Derived key lives only in <code>chrome.storage.session</code> — memory, gone on browser close.</dd>
              </div>
              <div className="trust-item">
                <dt>Exportable data</dt>
                <dd>Backup your saved pilgrims to an encrypted JSON file. Import on another device. Full ownership, zero lock-in.</dd>
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
    "Open your browser and navigate to chrome://extensions",
    "Enable Developer mode (toggle top-right)",
    "Click Load unpacked and select this folder:\nD:\\TTD Form Helper - Copy",
    "Pin the extension to your toolbar for quick access",
    "Navigate to tirupatibalaji.ap.gov.in and click the icon",
  ];

  return (
    <section className="install" id="install">
      <div className="container">
        <p className="section-label">Installation</p>
        <h2 className="heading-serif heading-serif--lg">
          Get started in under two minutes
        </h2>
        <ol className="steps">
          {steps.map((s, i) => (
            <li key={i}>
              <span className="steps__num">{String(i + 1).padStart(2, "0")}</span>
              <span className="steps__text">{s}</span>
            </li>
          ))}
        </ol>
        <p className="install__note">
          Works on Chrome, Edge, Brave, and Arc. Firefox has limited support
          (popup instead of side panel). Requires minimum Chrome 114.
        </p>
        <div className="install__links">
          <a
            href="https://github.com/gangadhar-sai/ttd-form-helper"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--dark"
          >
            Download from GitHub
          </a>
          <a
            href="https://github.com/gangadhar-sai/ttd-form-helper/blob/main/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--ghost"
          >
            Read full documentation
          </a>
        </div>
      </div>
    </section>
  );
}

/* ───────────── TESTIMONIAL ───────────── */

function Testimonial() {
  return (
    <section className="testimonial">
      <div className="container">
        <blockquote className="testimonial__quote">
          I used to miss every Srivari seva slot because I couldn't finish the
          form fast enough. Now I fill everything in three seconds flat and
          still have time to pick my preferred date. Changed my entire booking
          experience.
        </blockquote>
        <cite className="testimonial__cite">
          <span className="testimonial__name">Lakshmi R.</span>
          <span className="testimonial__role">Regular devotee, Hyderabad</span>
        </cite>
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
          Ready to stop fighting the form?
        </h2>
        <p className="cta__body">
          Save your pilgrims once. Fill any TTD booking in seconds.
          Your data stays local. Always free.
        </p>
        <a href="#install" className="btn btn--dark btn--large">
          Install now — it's free
        </a>
        <p className="cta__fine">
          Open source under MIT license. Not affiliated with TTD.
        </p>
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
          <nav className="footer__nav" aria-label="Footer navigation">
            <a href="https://github.com/gangadhar-sai/ttd-form-helper">GitHub</a>
            <a href="#features">Features</a>
            <a href="#install">Install</a>
            <a href="#security">Security</a>
          </nav>
        </div>
        <p className="footer__copy">
          Built with 🙏 for the TTD devotee community.
          Independent tool — not affiliated with or endorsed by Tirumala Tirupati Devasthanams.
        </p>
      </div>
    </footer>
  );
}
