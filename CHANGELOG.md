# Changelog

All notable changes to **TTD Form Helper** will be documented in this file.

Format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Floating on-page quick-action widget (`⚡ TTD Fast Fill` + `⏩ Continue`)
- Live Aadhaar Verhoeff checksum validation on every digit typed
- AES-GCM vault encryption with PBKDF2 key derivation (opt-in, passphrase-protected)
- Chrome side-panel support for persistent panel during booking sessions
- 6-language i18n: English, Hindi, Kannada, Malayalam, Tamil, Telugu
- Pilgrim Sets — named groups of saved pilgrims for one-click loading
- Encrypted backup export / import with passphrase protection
- Senior citizen auto-detection (65+) with age-proof document attachment
- Primary contact assignment from designated pilgrim
- Theme toggle (light / dark mode)

### Fixed
- Angular/Material form fields now correctly receive values via `ngControl.setValue()` injection
- React `isTrusted` event check bypassed via MAIN-world page-bridge script
- mat-select dropdowns opened and options selected programmatically
- Validation errors shown inline beneath offending fields instead of silently ignored

### Changed
- Manifest v3 migration completed (service worker background, module type)
- Minimum Chrome version raised to 114 for full side-panel API support

---

## [1.4.5] — 2024-10

### Added
- Srivani Darshan tab supporting up to 9 pilgrims
- Group seva tab with two-column layout and copy-address-to-all toggle
- Srivari Seva full volunteer registration form with file-upload attachment
- Mobile alt-number and email validation fields

### Fixed
- Fixed pincode leading-zero rejection (now properly blocks `0xxxxx`)
- Fixed DOB ↔ age cross-validation warning when they disagree
- Fixed contact field derivation picking first non-empty value across all pilgrims

---

## [1.3.0] — 2024-08

### Added
- Live field-level validation with red error / yellow warning pills
- Passphrase strength meter with OWASP-recommended PBKDF2 iterations
- "Clear form" action on the floating widget
- Dark mode theme with system preference detection

### Fixed
- Fixed multi-row pilgrim form where row count exceeded available input elements
- Fixed case-insensitive matching for mat-select options containing special characters

---

## [1.0.0] — Initial release

- Core pilgrim booking autofill (up to 6 members)
- Basic Aadhaar / passport validation
- Light theme only
- English locale only
