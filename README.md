# TTD Form Helper — Chrome Extension

[![Chrome Web Store](https://img.shields.io/badge/Status-Development%20Ready-orange?style=for-the-badge)](#)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue?style=for-the-badge)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)
[![Translation: 6 Languages](https://img.shields.io/badge/Languages-6-%23e8a84b?style=for-the-badge)](#i18n-localization)
[![Security: AES-GCM](https://img.shields.io/badge/Encryption-AES--GCM--256-red?style=for-the-badge)](#-security--privacy)
[![Stars](https://img.shields.io/github/stars/?repo=&style=for-the-badge)](#)
[![Issues](https://img.shields.io/github/issues/?repo=&style=for-the-badge)](#)

> **⚡ Fill any TTD booking form in ~3 seconds.** Save pilgrim details once, reuse them across every booking session. Your data never leaves your browser.

**Supported portals:** [tirupatibalaji.ap.gov.in](https://tirupatibalaji.ap.gov.in) · [ttdevasthanams.ap.gov.in](https://ttdevasthanams.ap.gov.in)

---

## Table of Contents

- [Quick Start](#quick-start)
- [What It Does](#what-it-does)
- [Features](#features)
- [How It Works](#how-it-works)
- [Security & Privacy](#-security--privacy)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Browser Compatibility](#browser-compatibility)
- [I18N Localization](#i18n-localization)
- [Usage Guide](#usage-guide)
- [Backup & Restore](#backup--restore)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## Quick Start

```bash
# 1. Clone or download this repository
git clone https://github.com/YOUR-USERNAME/ttd-form-helper.git
cd ttd-form-helper

# 2. Open chrome://extensions in your browser
# 3. Enable "Developer mode" (toggle top-right)
# 4. Click "Load unpacked" → select this folder
# 5. Pin the extension to your toolbar
# 6. Navigate to the TTD booking page and click the icon!
```

---

## What It Does

When you book darshan, seva, or srivani on the TTD website, you fill the same personal details over and over again — name, age, Aadhaar number, contact info, gothram, etc. **TTD Form Helper lets you save that data once and fill every form with a single click.**

### Time saved per booking session

| Task | Manual | With TTD Form Helper | Savings |
|------|--------|---------------------|---------|
| Fill 6-pilgrim booking form | 3–5 minutes | ~3 seconds | **95%+** |
| Re-enter contact details each round | 30–60 sec | Instant (auto-derived) | 100% |
| Validate Aadhaar for typos | Manual check | Live Verhoeff checksum | Prevents rejection |
| Attach senior citizen age proof | Find file + upload | Auto-attached on fill | Saves 30+ sec |
| Fill complete seva registration | 2–3 minutes | ~3 seconds | **95%+** |

During peak booking windows where seats disappear in under a minute, this extension can be the difference between getting a slot and missing it entirely.

---

## Features

### 🛕 Pilgrim Booking (Special Entry Darshan ₹300 & Sri PAT)

- **⚡ Fill All** — fills up to 6 pilgrim rows and contact details simultaneously
- **Group Management** — save multiple groups (e.g., "Family", "December Trip") with up to 6 members each
- **Master Saved Pilgrims** — build a reusable roster; add any saved person to a booking group with one click
- **Primary Contact Assignment** — auto-picks email, city, state, country, pincode, and gothram from the pilgrim who has the most complete info
- **Live Aadhaar Validation** — real-time Verhoeff checksum catches typos before submission
- **Quick Action Bar** — `⚡ Fill all`, `ℹ️ Next`, `⏩ Continue`, `🧹 Clear`

### 🙏 Srivari Seva (Volunteer Registration)

- Full volunteer form: personal details, fitness checkboxes, residential address
- Qualifications, languages spoken, and reference fields
- **Auto-attach Photo & ID Proof** using the HTML5 DataTransfer API
- Inline validation error list surfaced before you start filling

### 👥 Seva (Group)

- Two-column layout: team member sidebar (`#1 Team Leader`, `#2 Member`, …)
- **Quick fill by member number** — type a number, hit fill
- **Copy Address to All Members** toggle propagates leader's address instantly

### 🪔 Srivani Darshan

- Supports up to 9 pilgrims
- One-click fill from saved data
- One-click **"Copy from Pilgrim Tab"** transfers the current booking list directly

### 👴 Senior Citizen / Differently Abled Darshan

- Automatically detects seniors (age 65+) and their spouse from the booking list
- **Automatically attaches age-proof Aadhaar** (PDF, PNG, or JPEG ≤ 1 MB) to the upload field
- Single-action flow: `Fill → Attach → Continue`

### ⚡ Floating On-Page Widget

A floating toolbar appears on every TTD page:
- **⚡ TTD Fast Fill** — fills without opening the panel
- **⏩ Continue** — clicks the form's Continue button for you
- **✕ Close** — dismisses the widget
- Stays visible during rush hours so you never have to alt-tab

### 🔐 AES-GCM Vault Encryption (Opt-In)

- Optional passphrase-protected encryption for all sensitive data
- PBKDF2-SHA256 key derivation (210,000 iterations — OWASP recommended)
- Derived key held only in `chrome.storage.session` (memory, cleared on browser close)
- Passphrase is **never stored** anywhere — if you lose it, only a backup restore works
- Lock/unlock button in the panel header when encryption is enabled

### ✅ Aadhaar Verhoeff Checksum Validation

Every Aadhaar number you enter is checked against India's real 12-digit Verhoeff algorithm:
- Detects any single-digit typo (100% detection rate)
- Detects most adjacent digit swaps
- Shows a red inline error **before** you ever reach the TTD site
- Also validates passport format, mobile number range, PIN code, DOB consistency, and email format

### 🌐 6-Language Support

Switch language instantly from within the popup settings:
- 🇬🇧 English
- 🇮🇳 हिन्दी (Hindi)
- 🇮🇳 ಕನ್ನಡ (Kannada)
- 🇮🇳 മലയാളം (Malayalam)
- 🇮🇳 தமிழ் (Tamil)
- 🇮🇳 తెలుగు (Telugu)

---

## How It Works

TTD uses **Angular Material** forms with React-style event guards (`event.nativeEvent.isTrusted`). A normal content script dispatches untrusted events that TTD silently ignores. This extension solves that with a **two-world strategy**:

1. **`page-bridge.js`** runs in the page's own **MAIN** world (same as React). It intercepts custom `ttdfh:page-op` events and replays them through React's actual handler chain, making `isTrusted === true`.

2. **`autofill.js`** (the ISOLATED content script) sends those events with the values to fill.

For Angular Material selects (`<mat-select>`), the filler opens the dropdown overlay programmatically and clicks the matching option — just like a real user would.

Values are also injected directly into Angular's `ngControl.setValue()` call chain so React's change detection sees them identically to typing.

---

## 🔒 Security & Privacy

This extension is built for a simple reason: **booking your temple darshan shouldn't require trusting a stranger with your Aadhaar number.**

| Aspect | Implementation |
|--------|---------------|
| **Network access** | None. CSP `connect-src 'self'` blocks all outbound requests |
| **Permissions** | Only `storage` and `sidePanel` — no tabs, cookies, clipboard, or downloads |
| **Site access** | Restricted to `tirupatibalaji.ap.gov.in` and `ttdevasthanams.ap.gov.in` only |
| **Third-party code** | Zero — no npm packages, no CDN, no analytics SDKs |
| **Data storage** | `chrome.storage.local` — local to your browser profile, encrypted at rest if vault is on |
| **Key material** | PBKDF2-derived AES-GCM key lives only in `chrome.storage.session` (RAM); wiped on browser close |
| **Passphrase** | Never stored, never transmitted. Lost passphrases cannot be recovered |

You can verify these claims yourself:
1. Open DevTools → Network tab while using the extension — see zero outbound requests
2. Right-click the extension icon → "Inspect popup" → read the source code (it's unminified)
3. Check `chrome://extensions` → "Details" → confirm site access is limited to the two TTD domains

---

## Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Language** | JavaScript (ES2022) — no TypeScript, no transpiler |
| **Styling** | CSS 3 with CSS Custom Properties (variables), flexbox, grid |
| **Markup** | Plain HTML5 — no framework, no build step |
| **Extension API** | Manifest V3 — service worker, side panel, storage, i18n |
| **Cryptography** | Web Crypto API — PBKDF2-SHA256, AES-GCM-256 |
| **Validation** | Verhoeff algorithm (Aadhaar), regex validators (mobile, email, PIN, passport) |
| **DOM Engineering** | Angular Material injection, React isTrusted bypass via MAIN-world bridge |
| **Internationalisation** | `chrome.i18n` + runtime locale switching via JSON message bundles |

**Total lines of code:** ~6,950 lines across 20 source files. No dependencies.

---

## Installation

### From Source (Recommended for developers)

1. Open your browser and navigate to:
   ```
   chrome://extensions
   ```
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked** (top-left button)
4. Select the cloned repository folder
5. The extension **TTD Form Helper** is now loaded — pin it to your toolbar

### From Chrome Web Store

Search **"TTD Form Helper"** in the Chrome Web Store once published.

### Supported Browsers

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 114+ | ✅ Full support (side panel) |
| Edge | 114+ | ✅ Full support (Chromium-based) |
| Brave | Latest | ✅ Full support |
| Arc | Latest | ✅ Full support |
| Firefox | 115+ | ⚠️ Works (uses popup fallback, not side panel) |
| Safari | 17+ | ⚠️ Limited (no service workers in MV3) |

---

## I18N Localization

The UI supports 6 languages, switchable from Settings without reloading:

| Locale | Language | File |
|--------|----------|------|
| `en` | English | `_locales/en/messages.json` |
| `hi` | हिन्दी (Hindi) | `_locales/hi/messages.json` |
| `kn` | ಕನ್ನಡ (Kannada) | `_locales/kn/messages.json` |
| `ml` | മലയാളം (Malayalam) | `_locales/ml/messages.json` |
| `ta` | தமிழ் (Tamil) | `_locales/ta/messages.json` |
| `te` | తెలుగు (Telugu) | `_locales/te/messages.json` |

To add a new language: copy `_locales/en/messages.json` to `_locales/<lang>/messages.json` and translate each `message` value. The extension picks it up immediately — no restart needed.

---

## Usage Guide

### Saving Your First Pilgrim

1. Click the extension icon to open the panel
2. Go to the **🛕 Pilgrim Booking** tab
3. Click **"+ Add Pilgrim"** and fill in the form
4. Enter their name, age, gender, and Aadhaar number
5. The Aadhaar field shows a live green/red indicator as you type
6. Expand **Contact details for the booking** to add email, city, gothram, etc.
7. Click **Add Pilgrim** — they're saved locally

### Making a Booking

1. Navigate to [tirupatibalaji.ap.gov.in](https://tirupatibalaji.ap.gov.in) and start a booking
2. Open the extension panel (click the icon or use the toolbar pin)
3. Ensure the correct pilgrims are listed in the Pilgrim tab
4. Click **⚡ Fill All Details**
5. Watch every field populate in milliseconds
6. Click **⏩ Continue** or use the floating widget's continue button
7. Complete the booking as usual on the TTD page

### Using the Floating Widget

While on a TTD page, a small bar floats at the bottom of the screen:
- **⚡ TTD Fast Fill** — triggers autofill immediately
- **⏩ Continue** — clicks the form's Continue button
- **✕** — hides the widget (reappears on next page load)

### Managing Saved Pilgrims

Open the extension → click the **⚙ Saved Pilgrims & settings** gear icon → manage your master list. You can:
- Add/edit/delete individuals
- Create named sets (e.g., "Family", "Office Trip")
- Import/export encrypted backups
- Toggle dark/light theme
- Change language
- Turn on/off vault encryption

---

## Backup & Restore

Your data lives only in this browser. If you switch computers or reinstall, use the backup feature:

### Export
Settings → **💾 Backup & Restore** → **⬇ Export backup** → choose encrypted or plain JSON → download to a safe location

### Import
Settings → **⬆ Import backup** → select the downloaded file → enter passphrase if encrypted → choose Merge or Replace

> ⚠️ **Never share an unencrypted backup file.** It contains Aadhaar numbers and personal contact details in plain text. Always prefer encrypted exports.

---

## Development

### Project Structure

```
├── manifest.json            # MV3 manifest
├── background.js            # Service worker (secure data reads)
├── content/
│   ├── page-bridge.js       # MAIN-world React event bridge
│   └── autofill.js          # DOM filler engine
├── popup/                   # Side panel UI
│   ├── index.html           # Panel root
│   ├── popup.js             # Router + tab management
│   ├── tabs/                # Per-tab renderers
│   └── toast.js             # Toast notifications
├── shared/                  # Shared modules
│   ├── validation.js        # Verhoeff, mobile, email, DOB validators
│   ├── crypto.js            # AES-GCM encryption layer
│   ├── secureStore.js       # Encrypted vault storage
│   ├── pilgrimForm.js       # Dynamic pilgrim form builder
│   ├── formValidation.js    # Inline validation UI
│   └── i18n.js              # Runtime locale manager
├── options/                 # Settings page
├── _locales/                # 6 translation bundles
└── icons/                   # SVG & PNG assets
```

### Local Testing

A standalone test page simulates TTD form behaviour:
```
Open test_ttd_page.html in Chrome
→ Add pilgrims in the popup
→ Click ⚡ Fill All
→ Watch the simulated form populate
```

### Running Tests

```bash
npm test
# or open test_ttd_page.html manually for integration testing
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

Quick steps:
1. Fork the repo and create a branch: `git checkout -b feat/srivani-auto-fill`
2. Make your changes and test on `test_ttd_page.html`
3. Commit with clear messages: `Fix: validate mobile number leading digit`
4. Push and open a Pull Request

---

## License

This project is licensed under the [MIT License](./LICENSE). Free to use, modify, and distribute.

---

## Disclaimer

TTD Form Helper is an independent, community-built tool. It is **not affiliated with, endorsed by, or connected to** Tirumala Tirupati Devasthanams in any way. It does not bypass CAPTCHA, OTP, or payment verification. It only fills fields you've explicitly saved and only when you press a Fill button.

Built with 🙏 for the TTD devotee community.
