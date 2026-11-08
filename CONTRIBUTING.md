# Contributing to TTD Form Helper

Thanks for interested in making TTD booking easier for everyone! 🙏

## Code of Conduct

Be respectful and helpful. This project serves real devotees who need reliable tools during high-pressure booking windows.

## Getting Started

1. Fork the repository
2. Clone locally: `git clone https://github.com/<your-username>/ttd-form-helper.git`
3. Load unpacked in Chrome: open `chrome://extensions`, enable Developer mode, select the cloned folder
4. Make your changes and test on a live TTD booking page or the provided [`test_ttd_page.html`](./test_ttd_page.html)

## Project Structure

```
├── manifest.json            # Extension manifest (MV3)
├── background.js            # Service worker — handles secure data reads
├── content/                 # Scripts injected into TTD pages
│   ├── page-bridge.js       # MAIN-world bridge (bypasses React isTrusted guard)
│   └── autofill.js          # DOM filler with Angular control injection
├── popup/                   # Side panel / popup UI
│   ├── index.html           # Panel markup
│   ├── popup.js             # Panel controller + tab router
│   ├── tabs/                # Per-tab renderers (pilgrim, seva, group, etc.)
│   └── toast.js             # Toast notification helper
├── shared/                  # Shared logic across popup and options
│   ├── validation.js        # Aadhaar Verhoeff, mobile, email, DOB validators
│   ├── crypto.js            # AES-GCM encryption wrapper (Web Crypto API)
│   ├── secureStore.js       # Vault storage with optional encryption
│   ├── pilgrimForm.js       # Dynamic pilgrim form builder
│   ├── formValidation.js    # Inline validation UI helpers
│   └── i18n.js              # Runtime internationalisation
├── _locales/                # Translations (en, hi, kn, ml, ta, te)
├── options/                 # Settings page
└── icons/                   # Extension icons
```

## Architecture Notes

### Two-world strategy
[`content/page-bridge.js`](./content/page-bridge.js) runs in the page's **MAIN** world so it can access React's internal props (`__reactProps$*`). [`content/autofill.js`](./content/autofill.js) runs in the default **ISOLATED** world and communicates by dispatching `ttdfh:page-op` custom events. The bridge intercepts those events and replays them through React's own handler chain, preserving `nativeEvent.isTrusted === true`.

### Angular control injection
Many TTD form fields are Angular Material controls. Setting `.value` alone doesn't trigger change detection. The filler walks up the DOM tree looking for `ng.getComponent(el)` and calls `.control.setValue()` directly, then marks dirty/touched and updates validity — exactly what a user typing would do.

### Validation approach
Validations use two severities:
- **error** — blocks the fill action (user must fix before proceeding)
- **warning** — lets the user proceed but shows what might be wrong

This matches TTD's own behaviour: some fields reject on submit, others just show advisory messages.

## Pull Request Process

1. Write clear commit messages in imperative mood: `Fix: validate mobile number format`
2. Include a brief description of what changed and why
3. Update README.md if you add a feature or change behaviour
4. Run the local test page (`test_ttd_page.html`) before submitting
5. Screenshots of UI changes are greatly appreciated

## Reporting Bugs

Open an issue and include:
- Browser and version
- TTD page URL where the issue occurs
- Steps to reproduce
- Screenshot if the UI looks wrong

## Adding Translations

Edit the relevant `_locales/<lang>/messages.json` file. Add new keys to `en/messages.json` first, then translate across all locales. Run the extension after editing — locale changes are hot-reloaded.

---

Built with ❤️ for the TTD community.
