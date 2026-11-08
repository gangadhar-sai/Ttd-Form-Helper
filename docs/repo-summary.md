# Repository Summary

**Repository name:** `ttd-form-helper` (or `latest-ttd-auto-fill-extension`)

**Full name on GitHub:** TTD Form Helper — Chrome Extension

---

## What This Is

A free, open-source Chrome/Edge/Brave extension that automates form-filling on the
Tirumala Tirupati Devasthanams (TTD) booking portals:

- https://tirupatibalaji.ap.gov.in
- https://ttdevasthanams.ap.gov.in

It saves your personal details once, then populates every booking form with a
single click — reducing a 3–5 minute manual process to roughly 3 seconds.

All data stays on the user's device. The extension makes zero network requests
and asks for only two permissions: `storage` and `sidePanel`.

---

## Key Stats

| Metric | Value |
|--------|-------|
| Manifest version | 3 |
| Total lines of code | ~6,950 |
| Source files | 20 JS + 3 CSS + 4 HTML + 6 locale JSONs |
| Languages supported | 6 (EN, HI, KN, ML, TA, TE) |
| External dependencies | None |
| Minimum Chrome version | 114 |
| License | MIT |

---

## Tabs / Use Cases Covered

1. **🛕 Pilgrim Booking** — Special Entry Darshan ₹300, Sri PAT (up to 6 people)
2. **🙏 Srivari Seva** — Volunteer registration with photo/ID attachment
3. **👥 Seva (Group)** — Multi-member seva teams with leader-address propagation
4. **🪔 Srivani Darshan** — Up to 9 pilgrims, copy-from-Pilgrim-tab shortcut
5. **👴 Senior Citizen** — Auto age-proof Aadhaar attachment for 65+ pilgrims

---

## Notable Technical Achievements

### 1. React `isTrusted` Bypass
TTD's forms reject any programmatic input whose event lacks
`nativeEvent.isTrusted = true`. Since content scripts run in an isolated
world, their events are always untrusted. The fix is a dedicated
`content/page-bridge.js` script that injects into the page's OWN (MAIN) world
and replays events through React's actual handler chain, preserving the trust
flag. Without this, none of the autofill would work.

### 2. Angular Material Deep Injection
Setting `.value` on an Angular Material `<input>` isn't enough — the framework
doesn't know the value changed. The filler walks up the DOM tree via
`window.ng.getComponent(el)` and calls `ctrl.control.setValue()` directly,
then `markAsDirty()`, `markAsTouched()`, and `updateValueAndValidity()`.

### 3. `<mat-select>` Programmatic Opening
Mat-select dropdowns are rendered inside `.cdk-overlay-container` elements
that don't exist until the trigger is clicked. The filler dispatches a real
mousedown/click on the trigger, waits 120ms for the overlay to appear, finds
the matching option by fuzzy text match, then clicks it.

### 4. Verhoeff Aadhaar Checksum
India's 12-digit Aadhaar number uses a Verhoeff checksum on the final digit.
Any single-digit typo (e.g., entering 8 instead of 3) is caught with 100%
reliability before the user even reaches the TTD site. This prevents the
common "invalid ID number" rejection that wastes precious booking-window time.

### 5. PBKDF2 + AES-GCM Vault
Optional at-rest encryption derives a 256-bit key from a user passphrase using
210,000 PBKDF2 rounds (OWASP-recommended). The key is stored in
`chrome.storage.session` (in-memory, gone on browser close). The passphrase
itself is never stored anywhere. Wrong password = data stays encrypted forever.

---

## File Map

| Path | Purpose |
|------|---------|
| `manifest.json` | MV3 extension manifest |
| `background.js` | Service worker — handles `TFH_SECURE_GET` messages for decrypted data |
| `content/page-bridge.js` | MAIN-world React bridge (isTrusted bypass) |
| `content/autofill.js` | DOM filler — Angular control injection, mat-select automation |
| `popup/index.html` | Side panel root markup |
| `popup/popup.js` | Panel controller — tab routing, theme, lock, settings wiring |
| `popup/tabs/*.js` | Individual tab renderers (pilgrimTab, sevaTab, groupTab, etc.) |
| `shared/validation.js` | Aadhaar Verhoeff, mobile/email/PIN/passport/DOB validators |
| `shared/crypto.js` | Web Crypto API wrapper — PBKDF2, AES-GCM, base64 encode/decode |
| `shared/secureStore.js` | Encrypted/plain storage facade with vault unlock/lock |
| `shared/i18n.js` | Runtime locale loader and `t(key)` translation function |
| `shared/pilgrimForm.js` | Dynamic pilgrim record form builder with live validation |
| `shared/formValidation.js` | Inline error/warning badge rendering helpers |
| `options/index.html` | Settings page (backup, security, language, theme, tabs) |
| `options/options.js` | Settings page controller |
| `_locales/*/messages.json` | 6-language message bundles |
| `icons/*.png` / `*.svg` | Toolbar and store icons |
| `test_ttd_page.html` | Standalone form simulation for local testing |

---

## GitHub Repo Name Suggestions

Pick one of these for your repository name:

1. **`ttd-form-helper`** — clean, short, searchable
2. **`ttd-auto-fill-extension`** — descriptive for search
3. **`ttd-booking-helper`** — focuses on the booking use case
4. **`ttd-fast-fill`** — emphasises speed

Recommended: **`ttd-form-helper`** — matches the extension's display name exactly, easy to remember, and clear what it does.

---

## Suggested GitHub Topics

Add these topics to the repository for discoverability:

```
ttd, tirupati, chrome-extension, autofill, chromium, manifest-v3, 
aadhaar, india, temple-booking, webextension, privacy, aes-gcm, 
open-source, free-software, tamizh Nadu, andhra-pradesh, telangana, karnataka, kerela
```

---

## Suggested README Badges to Add

Once the repo exists, update the shields.io badges with real stats:

```markdown
[![GitHub Stars](https://img.shields.io/github/stars/OWNER/ttd-form-helper?style=social)](https://github.com/OWNER/ttd-form-helper/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/OWNER/ttd-form-helper)](https://github.com/OWNER/ttd-form-helper/issues)
[![GitHub Forks](https://img.shields.io/github/forks/OWNER/ttd-form-helper?style=social)](https://github.com/OWNER/ttd-form-helper/network/members)
[![GitHub License](https://img.shields.io/github/license/OWNER/ttd-form-helper)](https://github.com/OWNER/ttd-form-helper/blob/main/LICENSE)
```

---
