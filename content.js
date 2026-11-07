/**
 * TTD Form Helper - Ultimate Angular & Material Reactive Form Filler
 * Uses deep Angular element injection, native property setters, robust label-based matching,
 * and forced change detection cycles to ensure 100% success on TTD portals.
 */

(function () {
  'use strict';

  if (window.__TTD_FORM_HELPER_V5__) return;
  window.__TTD_FORM_HELPER_V5__ = true;

  console.log('[TTD Helper v5] Ultimate Angular & Material Filler Active');

  // ==========================================================================
  // 1. ADVANCED ANGULAR VALUE INJECTION & EVENT DISPATCHING
  // ==========================================================================

  function setValueAndEvents(el, value) {
    if (!el) return false;
    const strVal = String(value == null ? '' : value).trim();
    if (!strVal) return false;

    try {
      el.focus();

      // Native prototype value setter
      const proto = el.tagName === 'TEXTAREA'
        ? window.HTMLTextAreaElement.prototype
        : window.HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;

      if (setter) {
        setter.call(el, strVal);
      } else {
        el.value = strVal;
      }

      // Comprehensive event dispatching for Angular Reactive Forms & Material
      const events = [
        new Event('focus', { bubbles: true }),
        new InputEvent('input', { bubbles: true, cancelable: true, composed: true, data: strVal, inputType: 'insertText' }),
        new Event('change', { bubbles: true, cancelable: true }),
        new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: strVal.slice(-1) }),
        new KeyboardEvent('keyup', { bubbles: true, cancelable: true, key: strVal.slice(-1) }),
        new Event('blur', { bubbles: true })
      ];

      for (const ev of events) {
        el.dispatchEvent(ev);
      }

      // Deep Angular Component & Control Injection
      pushIntoAngularControl(el, strVal);

      // Visual success highlight
      el.classList.add('ttd-autofilled-highlight');
      setTimeout(() => el.classList.remove('ttd-autofilled-highlight'), 1500);

      return true;
    } catch (err) {
      console.warn('[TTD Helper v5] setValueAndEvents error:', err);
      return false;
    }
  }

  function pushIntoAngularControl(el, value) {
    try {
      const ng = window.ng;
      if (!ng) return;

      let curr = el;
      for (let i = 0; i < 6 && curr; i++) {
        const cmp = ng.getComponent ? ng.getComponent(curr) : null;
        if (cmp) {
          // Check common control properties
          const ctrl = cmp.ngControl || cmp.control || cmp.formControl;
          if (ctrl) {
            if (ctrl.control && typeof ctrl.control.setValue === 'function') {
              ctrl.control.setValue(value);
              ctrl.control.markAsDirty();
              ctrl.control.markAsTouched();
              ctrl.control.updateValueAndValidity();
              return;
            }
            if (typeof ctrl.setValue === 'function') {
              ctrl.setValue(value);
              return;
            }
          }
        }
        curr = curr.parentElement;
      }
    } catch (e) {
      // Ignore if Angular debug API is stripped
    }
  }

  // ==========================================================================
  // 2. SELECT & MAT-SELECT AUTOMATION
  // ==========================================================================

  async function setSelectValue(el, desiredValue) {
    if (!el || !desiredValue) return false;
    const target = String(desiredValue).toLowerCase().trim();

    // A. Native <select>
    if (el.tagName === 'SELECT' || el.options) {
      let matchedOpt = null;
      for (const opt of el.options) {
        const txt = (opt.text || '').toLowerCase().trim();
        const val = (opt.value || '').toLowerCase().trim();
        if (txt === target || val === target || matchesText(txt, target)) {
          matchedOpt = opt;
          break;
        }
      }

      if (matchedOpt) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value')?.set;
        if (setter) setter.call(el, matchedOpt.value);
        else el.value = matchedOpt.value;

        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new Event('blur', { bubbles: true }));
        pushIntoAngularControl(el, matchedOpt.value);
        el.classList.add('ttd-autofilled-highlight');
        setTimeout(() => el.classList.remove('ttd-autofilled-highlight'), 1500);
        return true;
      }
    }

    // B. Angular Material <mat-select>
    const matSelect = el.closest('mat-select') || el.querySelector('mat-select, [role="combobox"]');
    if (matSelect) {
      try {
        matSelect.scrollIntoView({ block: 'center' });
        const trigger = matSelect.querySelector('.mat-select-trigger, .mat-mdc-select-trigger') || matSelect;

        trigger.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
        trigger.click();

        await new Promise(r => setTimeout(r, 120));

        const options = Array.from(document.querySelectorAll(
          '.cdk-overlay-container mat-option, .cdk-overlay-container mat-mdc-option, .cdk-overlay-container [role="option"], mat-option'
        ));

        let matchedOption = null;
        for (const opt of options) {
          const txt = (opt.textContent || '').toLowerCase().replace(/\s+/g, ' ').trim();
          if (txt === target || matchesText(txt, target)) {
            matchedOption = opt;
            break;
          }
        }

        if (matchedOption) {
          matchedOption.scrollIntoView({ block: 'nearest' });
          matchedOption.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
          matchedOption.click();
          await new Promise(r => setTimeout(r, 80));
          return true;
        } else {
          // Close overlay if no match
          const backdrop = document.querySelector('.cdk-overlay-backdrop');
          if (backdrop) backdrop.click();
        }
      } catch (err) {
        console.warn('[TTD Helper v5] mat-select error:', err);
      }
    }

    return false;
  }

  function matchesText(optionText, target) {
    if (!optionText || !target) return false;
    if (target.includes('aadhaar') || target.includes('adhar')) {
      return optionText.includes('aadhaar') || optionText.includes('adhar');
    }
    return optionText.includes(target) || target.includes(optionText);
  }

  // ==========================================================================
  // 3. FIELD DESCRIPTOR & SECTION DETECTION
  // ==========================================================================

  function getFieldMetadata(el) {
    if (!el) return '';
    let text = '';
    const container = el.closest('mat-form-field, .mat-mdc-form-field, .form-group') || el.parentElement;

    if (container) {
      const labels = container.querySelectorAll('mat-label, label, .mdc-floating-label, .mat-form-field-label, span');
      labels.forEach(l => { text += ' ' + l.textContent; });
    }

    text += ' ' + (el.id || '');
    text += ' ' + (el.getAttribute('placeholder') || '');
    text += ' ' + (el.getAttribute('aria-label') || '');
    text += ' ' + (el.getAttribute('formcontrolname') || '');
    text += ' ' + (el.getAttribute('name') || '');

    return text.toLowerCase().replace(/[*:]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function getPilgrimHeading() {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, legend, .card-title, div, span, strong'));
    for (const h of headings) {
      const txt = (h.textContent || '').trim().toLowerCase();
      if (txt === 'pilgrim details' || (txt.includes('pilgrim details') && txt.length < 35)) {
        return h;
      }
    }
    return null;
  }

  function isElementAfter(el, marker) {
    if (!marker) return false;
    return !!(marker.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING);
  }

  // ==========================================================================
  // 4. MAIN FILL ENGINE
  // ==========================================================================

  async function fillAllBookingForm(pilgrims, contact) {
    console.log('[TTD Helper v5] Executing fill with pilgrims:', pilgrims, 'contact:', contact);
    showPageToast('⚡ TTD Helper: Filling form...', true);

    const marker = getPilgrimHeading();
    const allInputs = Array.from(document.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="file"])'));
    const allSelects = Array.from(document.querySelectorAll('select, mat-select, [role="combobox"]'));

    let generalFilled = 0;
    let pilgrimFilled = 0;

    // A. Fill General Details (before Pilgrim Details header)
    if (contact) {
      for (const inp of allInputs) {
        if (marker && isElementAfter(inp, marker)) continue;
        const meta = getFieldMetadata(inp);

        if ((meta.includes('email') || meta.includes('mail')) && contact.email) {
          if (setValueAndEvents(inp, contact.email)) generalFilled++;
        } else if (meta.includes('city') && !meta.includes('state') && contact.city) {
          if (setValueAndEvents(inp, contact.city)) generalFilled++;
        } else if (meta.includes('state') && contact.state) {
          if (setValueAndEvents(inp, contact.state)) generalFilled++;
        } else if (meta.includes('country') && (contact.country || 'India')) {
          if (setValueAndEvents(inp, contact.country || 'India')) generalFilled++;
        } else if ((meta.includes('pincode') || meta.includes('pin') || meta.includes('postal')) && contact.pincode) {
          if (setValueAndEvents(inp, contact.pincode)) generalFilled++;
        }
      }
    }

    // B. Fill Pilgrim Details (after Pilgrim Details header)
    const inPilgrimSection = el => !marker || isElementAfter(el, marker);

    const nameInputs = allInputs.filter(i => inPilgrimSection(i) && getFieldMetadata(i).includes('name') && !getFieldMetadata(i).includes('father') && !getFieldMetadata(i).includes('spouse') && !getFieldMetadata(i).includes('sur'));
    const ageInputs = allInputs.filter(i => inPilgrimSection(i) && getFieldMetadata(i).includes('age') && !getFieldMetadata(i).includes('pincode'));
    const idNumInputs = allInputs.filter(i => inPilgrimSection(i) && (getFieldMetadata(i).includes('number') || getFieldMetadata(i).includes('id no') || getFieldMetadata(i).includes('proof no')));

    const genderFields = allSelects.filter(s => inPilgrimSection(s) && getFieldMetadata(s).includes('gender'));
    const proofFields = allSelects.filter(s => inPilgrimSection(s) && (getFieldMetadata(s).includes('proof') || getFieldMetadata(s).includes('id type') || getFieldMetadata(s).includes('card type')));

    console.log('[TTD Helper v5] Mapped pilgrim fields:', {
      names: nameInputs.length,
      ages: ageInputs.length,
      genders: genderFields.length,
      proofs: proofFields.length,
      idNumbers: idNumInputs.length
    });

    const rowsCount = Math.max(nameInputs.length, ageInputs.length, 1);
    const totalToFill = Math.min((pilgrims || []).length, rowsCount);

    for (let i = 0; i < totalToFill; i++) {
      const p = pilgrims[i];
      let rowSuccess = false;

      // Name
      if (nameInputs[i] && setValueAndEvents(nameInputs[i], p.name)) {
        rowSuccess = true;
      }
      // Age
      if (ageInputs[i] && setValueAndEvents(ageInputs[i], p.age)) {
        rowSuccess = true;
      }
      // Gender
      if (genderFields[i] && p.gender) {
        if (await setSelectValue(genderFields[i], p.gender)) {
          rowSuccess = true;
        }
      }
      // ID Proof Type
      if (proofFields[i] && p.idType) {
        if (await setSelectValue(proofFields[i], p.idType)) {
          rowSuccess = true;
        }
      }
      // ID Proof Number
      if (idNumInputs[i] && setValueAndEvents(idNumInputs[i], p.idNumber)) {
        rowSuccess = true;
      }

      if (rowSuccess) pilgrimFilled++;
    }

    const summaryMsg = `⚡ Successfully filled ${pilgrimFilled} pilgrim(s) & General details!`;
    showPageToast(summaryMsg, true);
    return { generalCount: generalFilled, pilgrimCount: pilgrimFilled };
  }

  // ==========================================================================
  // 5. TOAST & FLOATING WIDGET
  // ==========================================================================

  function showPageToast(message, isSuccess = true) {
    let toast = document.getElementById('ttd-page-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ttd-page-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.borderColor = isSuccess ? '#10b981' : '#ef4444';
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 4000);
  }

  function injectFloatingWidget() {
    if (document.getElementById('ttd-helper-floating-bar')) return;

    const bar = document.createElement('div');
    bar.id = 'ttd-helper-floating-bar';
    bar.innerHTML = `
      <button class="ttd-floating-btn" id="ttd-float-fill-btn" title="Fill TTD Form">
        <span>⚡</span><span class="ttd-btn-text">TTD Fast Fill</span>
      </button>
      <button class="ttd-floating-continue" id="ttd-float-continue-btn" title="Click Continue">
        <span>⏩</span><span class="ttd-btn-text">Continue</span>
      </button>
      <button class="ttd-floating-toggle" id="ttd-float-toggle" title="Close">✕</button>
    `;
    document.body.appendChild(bar);

    document.getElementById('ttd-float-fill-btn').addEventListener('click', () => {
      chrome.storage.local.get(['ttdState'], async (result) => {
        const state = result?.ttdState;
        if (!state) {
          showPageToast('Open TTD Form Helper extension and add pilgrims first!', false);
          return;
        }
        const currentGroup = state.groups?.[state.currentGroupId] || Object.values(state.groups || {})[0];
        if (!currentGroup || !currentGroup.pilgrims || currentGroup.pilgrims.length === 0) {
          showPageToast('No pilgrims in current group!', false);
          return;
        }

        const primary = currentGroup.pilgrims.find(p => p.isPrimary) || currentGroup.pilgrims[0];
        const contact = {
          email: primary.email || state.commonContact?.email || '',
          city: primary.city || state.commonContact?.city || '',
          state: primary.state || state.commonContact?.state || '',
          country: primary.country || state.commonContact?.country || 'India',
          pincode: primary.pincode || state.commonContact?.pincode || ''
        };

        await fillAllBookingForm(currentGroup.pilgrims, contact);
      });
    });

    document.getElementById('ttd-float-continue-btn').addEventListener('click', () => {
      const btn = findButton(['continue', 'proceed']);
      if (btn) {
        btn.click();
        showPageToast('Clicked Continue', true);
      } else {
        showPageToast('Continue button not found', false);
      }
    });

    document.getElementById('ttd-float-toggle').addEventListener('click', () => {
      bar.classList.toggle('minimized');
    });
  }

  function findButton(keywords) {
    const els = Array.from(document.querySelectorAll('button, a, [role="button"]'));
    for (const el of els) {
      const t = (el.innerText || el.textContent || '').toLowerCase().trim();
      if (keywords.some(k => t.includes(k))) return el;
    }
    return null;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFloatingWidget);
  } else {
    injectFloatingWidget();
  }

  // ==========================================================================
  // 6. MESSAGE LISTENER
  // ==========================================================================

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log('[TTD Helper v5] Message received:', msg.action);

    if (msg.action === 'fillPilgrimAll') {
      fillAllBookingForm(msg.pilgrims, msg.contact).then(res => {
        sendResponse({ success: true, count: res.pilgrimCount });
      });
      return true;
    }

    if (msg.action === 'fillPilgrimSingle') {
      fillAllBookingForm([msg.pilgrim], null).then(() => {
        sendResponse({ success: true });
      });
      return true;
    }

    if (msg.action === 'clickNext') {
      const btn = findButton(['next']);
      if (btn) btn.click();
      sendResponse({ success: !!btn });
      return;
    }

    if (msg.action === 'clickContinue') {
      const btn = findButton(['continue', 'proceed']);
      if (btn) btn.click();
      sendResponse({ success: !!btn });
      return;
    }

    if (msg.action === 'clearForm') {
      document.querySelectorAll('input:not([type="hidden"])').forEach(inp => {
        setValueAndEvents(inp, '');
      });
      showPageToast('Form cleared', true);
      sendResponse({ success: true });
      return;
    }
  });

})();
