/**
 * TTD Form Helper - Popup Controller
 * High-performance data management & automation bridge
 */

// ============================================================================
// Verhoeff Algorithm for Aadhaar Validation
// ============================================================================
const VERHOEFF_D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

const VERHOEFF_P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

function validateAadhaar(aadhaarStr) {
  const clean = String(aadhaarStr).replace(/\s+/g, '');
  if (!/^\d{12}$/.test(clean)) return false;
  let c = 0;
  const digits = clean.split('').map(Number).reverse();
  for (let i = 0; i < digits.length; i++) {
    c = VERHOEFF_D[c][VERHOEFF_P[i % 8][digits[i]]];
  }
  return c === 0;
}

// ============================================================================
// State Management
// ============================================================================
let appState = {
  activeTab: 'pilgrim',
  groups: {
    'default': {
      id: 'default',
      name: 'Default Group',
      pilgrims: []
    }
  },
  currentGroupId: 'default',
  savedPilgrims: [],
  srivariProfile: {},
  sevaGroupMembers: [
    {
      id: 'sg-1',
      role: 'Team Leader',
      idType: 'Aadhaar Card',
      idNumber: '',
      name: '',
      surname: '',
      father: '',
      dob: '',
      age: '',
      mobile: '',
      email: '',
      blood: '',
      gender: 'Male',
      fitMental: true,
      fitPhysical: true,
      address: '',
      photoData: null
    }
  ],
  srivaniPeople: [],
  seniorAgeProof: null
};

// ============================================================================
// DOM Elements
// ============================================================================
const toastEl = document.getElementById('toast');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

// Tab 1 Elements
const groupSelect = document.getElementById('group-select');
const btnNewGroup = document.getElementById('btn-new-group');
const btnDeleteGroup = document.getElementById('btn-delete-group');
const pilgrimCountEl = document.getElementById('pilgrim-count');
const pilgrimCountRatioEl = document.getElementById('pilgrim-count-ratio');
const pilgrimsListEl = document.getElementById('pilgrims-list');
const btnToggleSaved = document.getElementById('btn-toggle-saved');
const savedPilgrimsBody = document.getElementById('saved-pilgrims-body');
const savedPilgrimsCountEl = document.getElementById('saved-pilgrims-count');
const savedPilgrimsListEl = document.getElementById('saved-pilgrims-list');
const formPilgrim = document.getElementById('form-pilgrim');
const formCardTitle = document.getElementById('form-card-title');
const btnCancelEdit = document.getElementById('btn-cancel-edit');
const editPilgrimIdInput = document.getElementById('edit-pilgrim-id');
const pNameInput = document.getElementById('p-name');
const pRelationInput = document.getElementById('p-relation');
const pAgeInput = document.getElementById('p-age');
const pGenderInput = document.getElementById('p-gender');
const pIdTypeInput = document.getElementById('p-id-type');
const pIdNumberInput = document.getElementById('p-id-number');
const aadhaarFeedback = document.getElementById('aadhaar-feedback');
const btnToggleContact = document.getElementById('btn-toggle-contact');
const contactDetailsBody = document.getElementById('contact-details-body');
const pEmailInput = document.getElementById('p-email');
const pCityInput = document.getElementById('p-city');
const pStateInput = document.getElementById('p-state');
const pCountryInput = document.getElementById('p-country');
const pPincodeInput = document.getElementById('p-pincode');
const pGothramInput = document.getElementById('p-gothram');
const pNotesInput = document.getElementById('p-notes');
const pSaveToRosterCheck = document.getElementById('p-save-to-roster');
const btnSubmitPilgrim = document.getElementById('btn-submit-pilgrim');
const btnFillAll = document.getElementById('btn-fill-all');
const btnNext = document.getElementById('btn-next');
const btnContinue = document.getElementById('btn-continue');
const btnClear = document.getElementById('btn-clear');
const btnClearBookingList = document.getElementById('btn-clear-booking-list');

// Tab 2 Elements (Srivari)
const btnFillSrivari = document.getElementById('btn-fill-srivari');
const btnSaveSrivari = document.getElementById('btn-save-srivari');
const srivariValidationBox = document.getElementById('srivari-validation-box');
const srivariMissingList = document.getElementById('srivari-missing-list');
const svPhotoFile = document.getElementById('sv-photo-file');
const svPhotoStatus = document.getElementById('sv-photo-status');
const svIdFile = document.getElementById('sv-id-file');
const svIdStatus = document.getElementById('sv-id-status');

// Tab 3 Elements (Seva Group)
const sgCountEl = document.getElementById('sg-count');
const btnSgAdd = document.getElementById('btn-sg-add');
const sgQuickNum = document.getElementById('sg-quick-num');
const btnSgFillSingle = document.getElementById('btn-sg-fill-single');
const sgMemberListEl = document.getElementById('sg-member-list');
const btnSgFillAll = document.getElementById('btn-sg-fill-all');
const sgCurrentTitle = document.getElementById('sg-current-title');
const sgCopyAddress = document.getElementById('sg-copy-address');
const btnSgSaveMember = document.getElementById('btn-sg-save-member');
let currentSgMemberIndex = 0;

// Tab 4 Elements (Srivani)
const btnFillSrivani = document.getElementById('btn-fill-srivani');
const srivaniCountEl = document.getElementById('srivani-count');
const srivaniPeopleList = document.getElementById('srivani-people-list');
const formSrivaniPerson = document.getElementById('form-srivani-person');
const btnSrivaniCopy = document.getElementById('btn-srivani-copy-from-pilgrim');

// Tab 5 Elements (Senior Citizen)
const btnFillSenior = document.getElementById('btn-fill-senior');
const btnFillSeniorContinue = document.getElementById('btn-fill-senior-continue');
const seniorBookedDisplay = document.getElementById('senior-booked-display');
const seniorProofFile = document.getElementById('senior-proof-file');
const seniorFileDisplay = document.getElementById('senior-file-display');

// ============================================================================
// Initialization & Storage Load
// ============================================================================
document.addEventListener('DOMContentLoaded', async () => {
  await loadState();
  initTabs();
  initPilgrimTab();
  initSrivariTab();
  initSevaGroupTab();
  initSrivaniTab();
  initSeniorTab();
  renderAll();
});

async function loadState() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['ttdState'], (result) => {
      if (result && result.ttdState) {
        appState = Object.assign(appState, result.ttdState);
        // Ensure defaults
        if (!appState.groups || Object.keys(appState.groups).length === 0) {
          appState.groups = {
            'default': { id: 'default', name: 'Default Group', pilgrims: [] }
          };
          appState.currentGroupId = 'default';
        }
        if (!appState.groups[appState.currentGroupId]) {
          appState.currentGroupId = Object.keys(appState.groups)[0];
        }
      }
      resolve();
    });
  });
}

function saveState() {
  chrome.storage.local.set({ ttdState: appState });
}

function showToast(msg, type = 'info') {
  toastEl.textContent = msg;
  toastEl.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
  setTimeout(() => {
    toastEl.className = 'toast hidden';
  }, 2600);
}

// ============================================================================
// Tab Navigation
// ============================================================================
function initTabs() {
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  if (appState.activeTab) {
    switchTab(appState.activeTab);
  }
}

function switchTab(tabId) {
  tabButtons.forEach(b => {
    if (b.getAttribute('data-tab') === tabId) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });

  tabPanes.forEach(pane => {
    if (pane.id === tabId) {
      pane.classList.add('active');
    } else {
      pane.classList.remove('active');
    }
  });

  appState.activeTab = tabId;
  saveState();

  if (tabId === 'senior') {
    renderSeniorTab();
  }
}

// ============================================================================
// TAB 1: PILGRIM BOOKING
// ============================================================================
function initPilgrimTab() {
  // Group Selector change
  groupSelect.addEventListener('change', (e) => {
    appState.currentGroupId = e.target.value;
    saveState();
    renderPilgrimTab();
  });

  // Create New Group
  btnNewGroup.addEventListener('click', () => {
    const groupName = prompt('Enter name for the new booking group:', `Group ${Object.keys(appState.groups).length + 1}`);
    if (groupName && groupName.trim()) {
      const newId = 'grp_' + Date.now();
      appState.groups[newId] = {
        id: newId,
        name: groupName.trim(),
        pilgrims: []
      };
      appState.currentGroupId = newId;
      saveState();
      renderPilgrimTab();
      showToast(`Group "${groupName}" created!`, 'success');
    }
  });

  // Delete Group
  btnDeleteGroup.addEventListener('click', () => {
    const keys = Object.keys(appState.groups);
    if (keys.length <= 1) {
      alert('You must keep at least one booking group.');
      return;
    }
    const currentName = appState.groups[appState.currentGroupId].name;
    if (confirm(`Are you sure you want to delete "${currentName}"?`)) {
      delete appState.groups[appState.currentGroupId];
      appState.currentGroupId = Object.keys(appState.groups)[0];
      saveState();
      renderPilgrimTab();
      showToast(`Group deleted.`, 'info');
    }
  });

  // Toggle Saved Accordion
  btnToggleSaved.addEventListener('click', () => {
    const isHidden = savedPilgrimsBody.classList.toggle('hidden');
    btnToggleSaved.querySelector('.acc-arrow').textContent = isHidden ? '▼' : '▲';
  });

  // Toggle Contact Accordion
  btnToggleContact.addEventListener('click', () => {
    const isHidden = contactDetailsBody.classList.toggle('hidden');
    btnToggleContact.querySelector('.sub-acc-arrow').textContent = isHidden ? '▸' : '▾';
  });

  // Pre-load saved contact details if present
  if (appState.commonContact) {
    if (!pEmailInput.value) pEmailInput.value = appState.commonContact.email || '';
    if (!pCityInput.value) pCityInput.value = appState.commonContact.city || '';
    if (!pStateInput.value) pStateInput.value = appState.commonContact.state || '';
    if (!pCountryInput.value) pCountryInput.value = appState.commonContact.country || 'India';
    if (!pPincodeInput.value) pPincodeInput.value = appState.commonContact.pincode || '';
    if (!pGothramInput.value) pGothramInput.value = appState.commonContact.gothram || '';
  }

  // Live Aadhaar Checksum Validation
  pIdNumberInput.addEventListener('input', () => {
    validatePilgrimAadhaarInput();
  });

  pIdTypeInput.addEventListener('change', () => {
    validatePilgrimAadhaarInput();
  });

  // Add / Edit Pilgrim Form Submit
  formPilgrim.addEventListener('submit', (e) => {
    e.preventDefault();
    handlePilgrimFormSubmit();
  });

  btnCancelEdit.addEventListener('click', () => {
    resetPilgrimForm();
  });

  btnClearBookingList.addEventListener('click', () => {
    const currentGroup = getCurrentGroup();
    if (currentGroup.pilgrims.length === 0) return;
    if (confirm(`Remove all pilgrims from "${currentGroup.name}"?`)) {
      currentGroup.pilgrims = [];
      saveState();
      renderPilgrimTab();
      showToast('Booking list cleared', 'info');
    }
  });

  // Fill All Button
  btnFillAll.addEventListener('click', () => {
    executeFillAll();
  });

  // Next Button
  btnNext.addEventListener('click', () => {
    sendTabMessage({ action: 'clickNext' });
    showToast('Clicking Next on TTD form...');
  });

  // Continue Button
  btnContinue.addEventListener('click', () => {
    sendTabMessage({ action: 'clickContinue' });
    showToast('Clicking Continue on TTD form...');
  });

  // Clear Form Button
  btnClear.addEventListener('click', () => {
    sendTabMessage({ action: 'clearForm' });
    showToast('Cleared on-page form');
  });
}

function validatePilgrimAadhaarInput() {
  const idType = pIdTypeInput.value;
  const num = pIdNumberInput.value.trim().replace(/\s+/g, '');
  if (idType === 'Aadhaar Card' && num.length > 0) {
    if (num.length === 12) {
      if (validateAadhaar(num)) {
        aadhaarFeedback.textContent = '✓ Valid Aadhaar number';
        aadhaarFeedback.className = 'feedback-text success';
      } else {
        aadhaarFeedback.textContent = '⛔ Aadhaar checksum failed — check for a typo';
        aadhaarFeedback.className = 'feedback-text error';
      }
    } else {
      aadhaarFeedback.textContent = `Aadhaar must be 12 digits (${num.length}/12)`;
      aadhaarFeedback.className = 'feedback-text error';
    }
  } else {
    aadhaarFeedback.className = 'feedback-text hidden';
  }
}

function getCurrentGroup() {
  if (!appState.groups[appState.currentGroupId]) {
    appState.currentGroupId = Object.keys(appState.groups)[0];
  }
  return appState.groups[appState.currentGroupId];
}

function handlePilgrimFormSubmit() {
  const currentGroup = getCurrentGroup();
  const editId = editPilgrimIdInput.value;

  if (!editId && currentGroup.pilgrims.length >= 6) {
    alert('Maximum 6 pilgrims allowed per booking group in TTD.');
    return;
  }

  const pilgrimData = {
    id: editId || 'p_' + Date.now(),
    name: pNameInput.value.trim(),
    relation: pRelationInput.value.trim(),
    age: parseInt(pAgeInput.value, 10),
    gender: pGenderInput.value,
    idType: pIdTypeInput.value,
    idNumber: pIdNumberInput.value.trim().replace(/\s+/g, ''),
    email: pEmailInput.value.trim(),
    city: pCityInput.value.trim(),
    state: pStateInput.value.trim(),
    country: pCountryInput.value.trim() || 'India',
    pincode: pPincodeInput.value.trim(),
    gothram: pGothramInput.value.trim(),
    notes: pNotesInput.value.trim(),
    isPrimary: false
  };

  if (!pilgrimData.name || !pilgrimData.age || !pilgrimData.gender || !pilgrimData.idNumber) {
    alert('Please fill all required fields marked with *');
    return;
  }

  if (editId) {
    const idx = currentGroup.pilgrims.findIndex(p => p.id === editId);
    if (idx !== -1) {
      pilgrimData.isPrimary = currentGroup.pilgrims[idx].isPrimary;
      currentGroup.pilgrims[idx] = pilgrimData;
      showToast('Pilgrim updated!', 'success');
    }
  } else {
    // If first member, make primary
    if (currentGroup.pilgrims.length === 0) {
      pilgrimData.isPrimary = true;
    }
    currentGroup.pilgrims.push(pilgrimData);
    showToast('Pilgrim added to booking!', 'success');
  }

  // Also save to master roster if checked
  if (pSaveToRosterCheck.checked) {
    saveToMasterRoster(pilgrimData);
  }

  // Preserve common contact details for the group
  if (pilgrimData.email || pilgrimData.city || pilgrimData.pincode || pilgrimData.state) {
    appState.commonContact = {
      email: pilgrimData.email || appState.commonContact?.email || '',
      city: pilgrimData.city || appState.commonContact?.city || '',
      state: pilgrimData.state || appState.commonContact?.state || '',
      country: pilgrimData.country || appState.commonContact?.country || 'India',
      pincode: pilgrimData.pincode || appState.commonContact?.pincode || '',
      gothram: pilgrimData.gothram || appState.commonContact?.gothram || ''
    };
  }

  saveState();
  resetPilgrimForm();
  renderPilgrimTab();
}

function saveToMasterRoster(pilgrim) {
  const existingIdx = appState.savedPilgrims.findIndex(
    sp => sp.idNumber.toLowerCase() === pilgrim.idNumber.toLowerCase()
  );
  const copy = Object.assign({}, pilgrim, { id: 'roster_' + Date.now() });
  if (existingIdx !== -1) {
    appState.savedPilgrims[existingIdx] = copy;
  } else {
    appState.savedPilgrims.push(copy);
  }
}

function resetPilgrimForm() {
  formPilgrim.reset();
  editPilgrimIdInput.value = '';
  formCardTitle.textContent = 'Add Pilgrim';
  btnSubmitPilgrim.textContent = 'Add Pilgrim';
  btnCancelEdit.classList.add('hidden');
  aadhaarFeedback.className = 'feedback-text hidden';
  pCountryInput.value = 'India';
  pSaveToRosterCheck.checked = true;

  // Auto-fill common contact details so user only enters them once!
  if (appState.commonContact) {
    pEmailInput.value = appState.commonContact.email || '';
    pCityInput.value = appState.commonContact.city || '';
    pStateInput.value = appState.commonContact.state || '';
    pCountryInput.value = appState.commonContact.country || 'India';
    pPincodeInput.value = appState.commonContact.pincode || '';
    pGothramInput.value = appState.commonContact.gothram || '';
  }
}

function renderPilgrimTab() {
  const currentGroup = getCurrentGroup();

  // Populate Group Dropdown
  groupSelect.innerHTML = '';
  Object.values(appState.groups).forEach(grp => {
    const opt = document.createElement('option');
    opt.value = grp.id;
    opt.textContent = grp.name;
    if (grp.id === appState.currentGroupId) opt.selected = true;
    groupSelect.appendChild(opt);
  });

  // Counts
  const count = currentGroup.pilgrims.length;
  pilgrimCountEl.textContent = count;
  pilgrimCountRatioEl.textContent = `${count}/6`;

  // Render Pilgrims Cards
  pilgrimsListEl.innerHTML = '';
  if (count === 0) {
    pilgrimsListEl.innerHTML = `
      <div style="text-align: center; padding: 14px; color: var(--text-muted); font-size: 11px;">
        No pilgrims added yet. Fill the form below or pick from Saved Pilgrims.
      </div>`;
  } else {
    currentGroup.pilgrims.forEach((pilgrim, idx) => {
      const isComplete = pilgrim.name && pilgrim.age && pilgrim.gender && pilgrim.idNumber;
      const card = document.createElement('div');
      card.className = `pilgrim-card ${pilgrim.isPrimary ? 'is-primary' : ''}`;

      const maskedId = pilgrim.idNumber.length > 4
        ? '•••• ' + pilgrim.idNumber.slice(-4)
        : pilgrim.idNumber;

      card.innerHTML = `
        <div class="pilgrim-card-info">
          <div class="pilgrim-title-row">
            <span class="pilgrim-name">${idx + 1}. ${escapeHtml(pilgrim.name)}</span>
            <span class="${isComplete ? 'badge-ready' : 'badge-incomplete'}">${isComplete ? 'READY' : 'INCOMPLETE'}</span>
          </div>
          <div class="pilgrim-desc">
            ${pilgrim.age} yrs • ${pilgrim.gender} • ${pilgrim.idType} (${maskedId})
            ${pilgrim.relation ? `• <em>${escapeHtml(pilgrim.relation)}</em>` : ''}
          </div>
        </div>
        <div class="pilgrim-card-actions">
          <button class="btn-icon btn-fill-single" title="Fill just this member" data-idx="${idx}">⚡</button>
          <button class="btn-icon ${pilgrim.isPrimary ? 'active' : ''}" title="${pilgrim.isPrimary ? 'Primary booking contact' : 'Set as primary contact'}" data-star-idx="${idx}">⭐</button>
          <button class="btn-icon" title="Edit details" data-edit-idx="${idx}">✏️</button>
          <button class="btn-icon btn-icon-danger" title="Delete" data-del-idx="${idx}">🗑️</button>
        </div>
      `;
      pilgrimsListEl.appendChild(card);
    });

    // Attach card event listeners
    pilgrimsListEl.querySelectorAll('[data-del-idx]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-del-idx'), 10);
        currentGroup.pilgrims.splice(idx, 1);
        if (currentGroup.pilgrims.length > 0 && !currentGroup.pilgrims.some(p => p.isPrimary)) {
          currentGroup.pilgrims[0].isPrimary = true;
        }
        saveState();
        renderPilgrimTab();
      });
    });

    pilgrimsListEl.querySelectorAll('[data-star-idx]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-star-idx'), 10);
        currentGroup.pilgrims.forEach((p, i) => { p.isPrimary = (i === idx); });
        saveState();
        renderPilgrimTab();
        showToast('Primary contact updated', 'info');
      });
    });

    pilgrimsListEl.querySelectorAll('[data-edit-idx]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-edit-idx'), 10);
        loadPilgrimIntoEditForm(currentGroup.pilgrims[idx]);
      });
    });

    pilgrimsListEl.querySelectorAll('.btn-fill-single').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
        fillSinglePilgrimOnPage(currentGroup.pilgrims[idx], idx);
      });
    });
  }

  // Render Saved Master Roster
  renderSavedRoster();
}

function loadPilgrimIntoEditForm(pilgrim) {
  editPilgrimIdInput.value = pilgrim.id;
  pNameInput.value = pilgrim.name;
  pRelationInput.value = pilgrim.relation || '';
  pAgeInput.value = pilgrim.age;
  pGenderInput.value = pilgrim.gender;
  pIdTypeInput.value = pilgrim.idType;
  pIdNumberInput.value = pilgrim.idNumber;
  pEmailInput.value = pilgrim.email || '';
  pCityInput.value = pilgrim.city || '';
  pStateInput.value = pilgrim.state || '';
  pCountryInput.value = pilgrim.country || 'India';
  pPincodeInput.value = pilgrim.pincode || '';
  pGothramInput.value = pilgrim.gothram || '';
  pNotesInput.value = pilgrim.notes || '';

  formCardTitle.textContent = 'Edit Pilgrim Details';
  btnSubmitPilgrim.textContent = 'Update Pilgrim';
  btnCancelEdit.classList.remove('hidden');

  if (pilgrim.email || pilgrim.city || pilgrim.pincode) {
    contactDetailsBody.classList.remove('hidden');
    btnToggleContact.querySelector('.sub-acc-arrow').textContent = '▾';
  }

  validatePilgrimAadhaarInput();
  formPilgrim.scrollIntoView({ behavior: 'smooth' });
}

function renderSavedRoster() {
  savedPilgrimsCountEl.textContent = appState.savedPilgrims.length;
  savedPilgrimsListEl.innerHTML = '';

  if (appState.savedPilgrims.length === 0) {
    savedPilgrimsListEl.innerHTML = '<div style="color: var(--text-muted); font-size: 11px;">No saved pilgrims in master list.</div>';
    return;
  }

  const currentGroup = getCurrentGroup();
  appState.savedPilgrims.forEach((sp, idx) => {
    const isAlreadyInGroup = currentGroup.pilgrims.some(p => p.idNumber === sp.idNumber);
    const row = document.createElement('div');
    row.className = 'saved-roster-item';
    row.innerHTML = `
      <div class="saved-roster-info">
        <strong>${escapeHtml(sp.name)}</strong> (${sp.age} yrs • ${sp.gender})
        <div style="color: var(--text-muted);">${sp.idType}: ${sp.idNumber}</div>
      </div>
      <div>
        <button class="btn-sm ${isAlreadyInGroup ? 'btn-ghost' : 'btn-action-primary'}" data-roster-add="${idx}" ${isAlreadyInGroup || currentGroup.pilgrims.length >= 6 ? 'disabled' : ''}>
          ${isAlreadyInGroup ? 'Added' : '+ Add'}
        </button>
        <button class="btn-icon btn-icon-danger" data-roster-del="${idx}" title="Remove from saved master">🗑️</button>
      </div>
    `;
    savedPilgrimsListEl.appendChild(row);
  });

  savedPilgrimsListEl.querySelectorAll('[data-roster-add]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-roster-add'), 10);
      const sp = appState.savedPilgrims[idx];
      const newPilgrim = Object.assign({}, sp, { id: 'p_' + Date.now() });
      currentGroup.pilgrims.push(newPilgrim);
      if (currentGroup.pilgrims.length === 1) newPilgrim.isPrimary = true;
      saveState();
      renderPilgrimTab();
      showToast(`Added ${sp.name} to booking!`, 'success');
    });
  });

  savedPilgrimsListEl.querySelectorAll('[data-roster-del]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-roster-del'), 10);
      appState.savedPilgrims.splice(idx, 1);
      saveState();
      renderSavedRoster();
    });
  });
}

function executeFillAll() {
  const currentGroup = getCurrentGroup();
  if (currentGroup.pilgrims.length === 0) {
    alert('Please add at least one pilgrim before clicking Fill All.');
    return;
  }

  // Determine primary contact
  const primaryPilgrim = currentGroup.pilgrims.find(p => p.isPrimary) ||
                         currentGroup.pilgrims.find(p => p.email || p.city) ||
                         currentGroup.pilgrims[0];

  const contact = {
    email: primaryPilgrim.email || appState.commonContact?.email || pEmailInput.value.trim() || '',
    city: primaryPilgrim.city || appState.commonContact?.city || pCityInput.value.trim() || '',
    state: primaryPilgrim.state || appState.commonContact?.state || pStateInput.value.trim() || '',
    country: primaryPilgrim.country || appState.commonContact?.country || pCountryInput.value.trim() || 'India',
    pincode: primaryPilgrim.pincode || appState.commonContact?.pincode || pPincodeInput.value.trim() || '',
    gothram: primaryPilgrim.gothram || appState.commonContact?.gothram || pGothramInput.value.trim() || ''
  };

  const payload = {
    action: 'fillPilgrimAll',
    pilgrims: currentGroup.pilgrims,
    contact: contact
  };

  sendTabMessage(payload, (resp) => {
    if (resp && resp.success) {
      showToast(`⚡ Filled ${resp.count || currentGroup.pilgrims.length} pilgrims & General Details!`, 'success');
    } else {
      showToast(resp?.message || 'Form fields populated on page!', 'info');
    }
  });
}

function fillSinglePilgrimOnPage(pilgrim, index) {
  sendTabMessage({
    action: 'fillPilgrimSingle',
    pilgrim: pilgrim,
    index: index
  }, (resp) => {
    showToast(`⚡ Filled ${pilgrim.name}!`, 'success');
  });
}

// ============================================================================
// TAB 2: SRIVARI SEVA
// ============================================================================
function initSrivariTab() {
  btnFillSrivari.addEventListener('click', () => {
    validateAndFillSrivari();
  });

  btnSaveSrivari.addEventListener('click', () => {
    saveSrivariFormData();
    showToast('Srivari Seva profile saved!', 'success');
  });

  // Handle file uploads for photo & id proof
  svPhotoFile.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('Photo must be less than 1 MB.');
        svPhotoFile.value = '';
        return;
      }
      svPhotoStatus.textContent = file.name;
      appState.srivariProfile.photoData = await readFileAsBase64(file);
      appState.srivariProfile.photoName = file.name;
      saveState();
    }
  });

  svIdFile.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('ID Proof must be less than 1 MB.');
        svIdFile.value = '';
        return;
      }
      svIdStatus.textContent = file.name;
      appState.srivariProfile.idFileData = await readFileAsBase64(file);
      appState.srivariProfile.idFileName = file.name;
      saveState();
    }
  });
}

function saveSrivariFormData() {
  const profile = appState.srivariProfile || {};
  profile.name = document.getElementById('sv-name').value.trim();
  profile.surname = document.getElementById('sv-surname').value.trim();
  profile.father = document.getElementById('sv-father').value.trim();
  profile.marital = document.getElementById('sv-marital').value;
  profile.dob = document.getElementById('sv-dob').value.trim();
  profile.age = document.getElementById('sv-age').value.trim();
  profile.mobile = document.getElementById('sv-mobile').value.trim();
  profile.altMobile = document.getElementById('sv-alt-mobile').value.trim();
  profile.email = document.getElementById('sv-email').value.trim();
  profile.blood = document.getElementById('sv-blood').value;

  const genderRadio = document.querySelector('input[name="sv-gender"]:checked');
  profile.gender = genderRadio ? genderRadio.value : 'Male';
  profile.fitMental = document.getElementById('sv-fit-mental').checked;
  profile.fitPhysical = document.getElementById('sv-fit-physical').checked;

  profile.door = document.getElementById('sv-door').value.trim();
  profile.street = document.getElementById('sv-street').value.trim();
  profile.pincode = document.getElementById('sv-pincode').value.trim();
  profile.country = document.getElementById('sv-country').value.trim();
  profile.state = document.getElementById('sv-state').value.trim();
  profile.district = document.getElementById('sv-district').value.trim();
  profile.city = document.getElementById('sv-city').value.trim();
  profile.temple = document.getElementById('sv-temple').value.trim();

  profile.qualification = document.getElementById('sv-qualification').value.trim();
  profile.profession = document.getElementById('sv-profession').value.trim();
  profile.empid = document.getElementById('sv-empid').value.trim();
  profile.designation = document.getElementById('sv-designation').value.trim();

  const prevVol = document.querySelector('input[name="sv-prev-vol"]:checked');
  profile.prevVol = prevVol ? prevVol.value : 'No';

  const langs = [];
  document.querySelectorAll('.sv-lang:checked').forEach(cb => langs.push(cb.value));
  profile.languages = langs;

  profile.ref1 = {
    name: document.getElementById('sv-ref1-name').value.trim(),
    rel: document.getElementById('sv-ref1-rel').value.trim(),
    mobile: document.getElementById('sv-ref1-mobile').value.trim()
  };
  profile.ref2 = {
    name: document.getElementById('sv-ref2-name').value.trim(),
    rel: document.getElementById('sv-ref2-rel').value.trim(),
    mobile: document.getElementById('sv-ref2-mobile').value.trim()
  };

  appState.srivariProfile = profile;
  saveState();
}

function loadSrivariForm() {
  const p = appState.srivariProfile || {};
  if (p.name) document.getElementById('sv-name').value = p.name;
  if (p.surname) document.getElementById('sv-surname').value = p.surname;
  if (p.father) document.getElementById('sv-father').value = p.father;
  if (p.marital) document.getElementById('sv-marital').value = p.marital;
  if (p.dob) document.getElementById('sv-dob').value = p.dob;
  if (p.age) document.getElementById('sv-age').value = p.age;
  if (p.mobile) document.getElementById('sv-mobile').value = p.mobile;
  if (p.altMobile) document.getElementById('sv-alt-mobile').value = p.altMobile;
  if (p.email) document.getElementById('sv-email').value = p.email;
  if (p.blood) document.getElementById('sv-blood').value = p.blood;

  if (p.gender) {
    const r = document.querySelector(`input[name="sv-gender"][value="${p.gender}"]`);
    if (r) r.checked = true;
  }
  if (typeof p.fitMental === 'boolean') document.getElementById('sv-fit-mental').checked = p.fitMental;
  if (typeof p.fitPhysical === 'boolean') document.getElementById('sv-fit-physical').checked = p.fitPhysical;

  if (p.door) document.getElementById('sv-door').value = p.door;
  if (p.street) document.getElementById('sv-street').value = p.street;
  if (p.pincode) document.getElementById('sv-pincode').value = p.pincode;
  if (p.country) document.getElementById('sv-country').value = p.country;
  if (p.state) document.getElementById('sv-state').value = p.state;
  if (p.district) document.getElementById('sv-district').value = p.district;
  if (p.city) document.getElementById('sv-city').value = p.city;
  if (p.temple) document.getElementById('sv-temple').value = p.temple;

  if (p.qualification) document.getElementById('sv-qualification').value = p.qualification;
  if (p.profession) document.getElementById('sv-profession').value = p.profession;
  if (p.empid) document.getElementById('sv-empid').value = p.empid;
  if (p.designation) document.getElementById('sv-designation').value = p.designation;

  if (p.photoName) svPhotoStatus.textContent = p.photoName;
  if (p.idFileName) svIdStatus.textContent = p.idFileName;

  if (p.ref1) {
    document.getElementById('sv-ref1-name').value = p.ref1.name || '';
    document.getElementById('sv-ref1-rel').value = p.ref1.rel || '';
    document.getElementById('sv-ref1-mobile').value = p.ref1.mobile || '';
  }
  if (p.ref2) {
    document.getElementById('sv-ref2-name').value = p.ref2.name || '';
    document.getElementById('sv-ref2-rel').value = p.ref2.rel || '';
    document.getElementById('sv-ref2-mobile').value = p.ref2.mobile || '';
  }
}

function validateAndFillSrivari() {
  saveSrivariFormData();
  const p = appState.srivariProfile;
  const missing = [];

  if (!p.name) missing.push('Name is required');
  if (!p.dob) missing.push('Date of birth is required');
  if (!p.age) missing.push('Age is required');
  if (!p.mobile) missing.push('Mobile number is required');
  if (!p.email) missing.push('Email is required');
  if (!p.pincode) missing.push('PIN code is required');

  if (missing.length > 0) {
    srivariMissingList.innerHTML = missing.map(m => `<li>${m}</li>`).join('');
    srivariValidationBox.classList.remove('hidden');
    showToast('Please fix required fields first', 'error');
  } else {
    srivariValidationBox.classList.add('hidden');
    sendTabMessage({
      action: 'fillSrivariSeva',
      profile: p
    }, (resp) => {
      showToast('⚡ Srivari Seva details applied to form!', 'success');
    });
  }
}

// ============================================================================
// TAB 3: SEVA (GROUP)
// ============================================================================
function initSevaGroupTab() {
  btnSgAdd.addEventListener('click', () => {
    if (appState.sevaGroupMembers.length >= 15) {
      alert('Maximum 15 members in Seva Group.');
      return;
    }
    const num = appState.sevaGroupMembers.length + 1;
    const newMember = {
      id: 'sg-' + Date.now(),
      role: `Team Member ${num}`,
      idType: 'Aadhaar Card',
      idNumber: '',
      name: '',
      surname: '',
      father: '',
      dob: '',
      age: '',
      mobile: '',
      email: '',
      blood: '',
      gender: 'Male',
      fitMental: true,
      fitPhysical: true,
      address: sgCopyAddress.checked ? (appState.sevaGroupMembers[0]?.address || '') : '',
      photoData: null
    };
    appState.sevaGroupMembers.push(newMember);
    currentSgMemberIndex = appState.sevaGroupMembers.length - 1;
    saveState();
    renderSevaGroupTab();
  });

  btnSgSaveMember.addEventListener('click', () => {
    saveCurrentSgMember();
    showToast('Member saved!', 'success');
  });

  btnSgFillAll.addEventListener('click', () => {
    saveCurrentSgMember();
    sendTabMessage({
      action: 'fillSevaGroupAll',
      members: appState.sevaGroupMembers
    }, (resp) => {
      showToast('⚡ Filled all group members on TTD form!', 'success');
    });
  });

  btnSgFillSingle.addEventListener('click', () => {
    saveCurrentSgMember();
    const num = parseInt(sgQuickNum.value, 10);
    const member = appState.sevaGroupMembers[num - 1];
    if (member) {
      sendTabMessage({
        action: 'fillSevaGroupSingle',
        member: member,
        memberIndex: num - 1
      }, (resp) => {
        showToast(`⚡ Filled Member #${num}!`, 'success');
      });
    } else {
      alert(`Member #${num} does not exist in group list.`);
    }
  });
}

function saveCurrentSgMember() {
  const member = appState.sevaGroupMembers[currentSgMemberIndex];
  if (!member) return;

  member.idType = document.getElementById('sg-id-type').value;
  member.idNumber = document.getElementById('sg-id-number').value.trim();
  member.name = document.getElementById('sg-name').value.trim();
  member.surname = document.getElementById('sg-surname').value.trim();
  member.father = document.getElementById('sg-father').value.trim();
  member.dob = document.getElementById('sg-dob').value.trim();
  member.age = document.getElementById('sg-age').value.trim();
  member.mobile = document.getElementById('sg-mobile').value.trim();
  member.email = document.getElementById('sg-email').value.trim();
  member.blood = document.getElementById('sg-blood').value;

  const gRadio = document.querySelector('input[name="sg-gender"]:checked');
  member.gender = gRadio ? gRadio.value : 'Male';
  member.fitMental = document.getElementById('sg-fit-mental').checked;
  member.fitPhysical = document.getElementById('sg-fit-physical').checked;
  member.address = document.getElementById('sg-address').value.trim();

  // If copy address checked, copy to all
  if (sgCopyAddress.checked && member.address) {
    appState.sevaGroupMembers.forEach(m => { m.address = member.address; });
  }

  saveState();
  renderSevaGroupTab();
}

function renderSevaGroupTab() {
  sgCountEl.textContent = appState.sevaGroupMembers.length;
  sgMemberListEl.innerHTML = '';

  appState.sevaGroupMembers.forEach((member, i) => {
    const li = document.createElement('li');
    li.className = `seva-member-item ${i === currentSgMemberIndex ? 'active' : ''}`;
    const roleLabel = i === 0 ? '#1 Team Leader' : `#${i + 1} Member`;
    li.innerHTML = `
      <span>${roleLabel} ${member.name ? `(${escapeHtml(member.name)})` : ''}</span>
      ${i > 0 ? `<button class="btn-icon btn-icon-danger" data-sg-del="${i}" style="width: 18px; height: 18px; font-size: 10px;">×</button>` : ''}
    `;
    li.addEventListener('click', (e) => {
      if (e.target.closest('[data-sg-del]')) return;
      saveCurrentSgMember();
      currentSgMemberIndex = i;
      renderSevaGroupTab();
    });
    sgMemberListEl.appendChild(li);
  });

  sgMemberListEl.querySelectorAll('[data-sg-del]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(e.currentTarget.getAttribute('data-sg-del'), 10);
      appState.sevaGroupMembers.splice(idx, 1);
      if (currentSgMemberIndex >= appState.sevaGroupMembers.length) {
        currentSgMemberIndex = appState.sevaGroupMembers.length - 1;
      }
      saveState();
      renderSevaGroupTab();
    });
  });

  // Load active member details into form
  const cur = appState.sevaGroupMembers[currentSgMemberIndex] || appState.sevaGroupMembers[0];
  if (cur) {
    sgCurrentTitle.textContent = currentSgMemberIndex === 0
      ? '#1 Team Leader Details'
      : `#${currentSgMemberIndex + 1} Member Details`;

    document.getElementById('sg-id-type').value = cur.idType || 'Aadhaar Card';
    document.getElementById('sg-id-number').value = cur.idNumber || '';
    document.getElementById('sg-name').value = cur.name || '';
    document.getElementById('sg-surname').value = cur.surname || '';
    document.getElementById('sg-father').value = cur.father || '';
    document.getElementById('sg-dob').value = cur.dob || '';
    document.getElementById('sg-age').value = cur.age || '';
    document.getElementById('sg-mobile').value = cur.mobile || '';
    document.getElementById('sg-email').value = cur.email || '';
    document.getElementById('sg-blood').value = cur.blood || '';

    const gr = document.querySelector(`input[name="sg-gender"][value="${cur.gender || 'Male'}"]`);
    if (gr) gr.checked = true;

    document.getElementById('sg-fit-mental').checked = cur.fitMental !== false;
    document.getElementById('sg-fit-physical').checked = cur.fitPhysical !== false;
    document.getElementById('sg-address').value = cur.address || '';
  }
}

// ============================================================================
// TAB 4: SRIVANI
// ============================================================================
function initSrivaniTab() {
  btnFillSrivani.addEventListener('click', () => {
    if (appState.srivaniPeople.length === 0) {
      alert('Please add at least one person for Srivani darshan.');
      return;
    }
    sendTabMessage({
      action: 'fillSrivani',
      people: appState.srivaniPeople
    }, (resp) => {
      showToast('⚡ Srivani details filled on TTD form!', 'success');
    });
  });

  btnSrivaniCopy.addEventListener('click', () => {
    const currentGroup = getCurrentGroup();
    if (currentGroup.pilgrims.length === 0) {
      alert('No pilgrims in Pilgrim tab to copy.');
      return;
    }
    appState.srivaniPeople = currentGroup.pilgrims.map(p => ({
      id: 'svani_' + Date.now() + Math.random(),
      name: p.name,
      age: p.age,
      gender: p.gender,
      idType: p.idType,
      idNumber: p.idNumber
    }));
    saveState();
    renderSrivaniTab();
    showToast(`Copied ${appState.srivaniPeople.length} people from Pilgrim tab!`, 'success');
  });

  formSrivaniPerson.addEventListener('submit', (e) => {
    e.preventDefault();
    if (appState.srivaniPeople.length >= 9) {
      alert('Maximum 9 persons allowed in Srivani booking.');
      return;
    }

    const person = {
      id: 'svani_' + Date.now(),
      name: document.getElementById('svani-name').value.trim(),
      age: parseInt(document.getElementById('svani-age').value, 10),
      gender: document.getElementById('svani-gender').value,
      idType: document.getElementById('svani-id-type').value,
      idNumber: document.getElementById('svani-id-number').value.trim()
    };

    appState.srivaniPeople.push(person);
    saveState();
    formSrivaniPerson.reset();
    renderSrivaniTab();
    showToast(`Added ${person.name}!`, 'success');
  });
}

function renderSrivaniTab() {
  srivaniCountEl.textContent = appState.srivaniPeople.length;
  srivaniPeopleList.innerHTML = '';

  if (appState.srivaniPeople.length === 0) {
    srivaniPeopleList.innerHTML = `
      <div style="text-align: center; padding: 12px; color: var(--text-muted); font-size: 11px;">
        No people added yet. Add people below or click "Copy from Pilgrim Tab".
      </div>`;
  } else {
    appState.srivaniPeople.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = 'pilgrim-card';
      card.innerHTML = `
        <div class="pilgrim-card-info">
          <div class="pilgrim-title-row">
            <span class="pilgrim-name">${idx + 1}. ${escapeHtml(p.name)}</span>
            <span class="badge-ready">READY</span>
          </div>
          <div class="pilgrim-desc">${p.age} yrs • ${p.gender} • ${p.idType} (${p.idNumber})</div>
        </div>
        <div class="pilgrim-card-actions">
          <button class="btn-icon btn-icon-danger" data-svani-del="${idx}">🗑️</button>
        </div>
      `;
      srivaniPeopleList.appendChild(card);
    });

    srivaniPeopleList.querySelectorAll('[data-svani-del]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-svani-del'), 10);
        appState.srivaniPeople.splice(idx, 1);
        saveState();
        renderSrivaniTab();
      });
    });
  }
}

// ============================================================================
// TAB 5: SENIOR CITIZEN
// ============================================================================
function initSeniorTab() {
  seniorProofFile.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('Age proof file must be at most 1 MB.');
        seniorProofFile.value = '';
        return;
      }
      appState.seniorAgeProof = {
        name: file.name,
        type: file.type,
        data: await readFileAsBase64(file)
      };
      saveState();
      renderSeniorTab();
      showToast('Age proof file saved locally!', 'success');
    }
  });

  btnFillSenior.addEventListener('click', () => {
    executeSeniorFill(false);
  });

  btnFillSeniorContinue.addEventListener('click', () => {
    executeSeniorFill(true);
  });
}

function executeSeniorFill(andContinue = false) {
  const currentGroup = getCurrentGroup();
  const seniorPilgrim = currentGroup.pilgrims.find(p => p.age >= 60) || currentGroup.pilgrims[0];
  const spousePilgrim = currentGroup.pilgrims.find(p => p !== seniorPilgrim);

  if (!seniorPilgrim) {
    alert('Please add a pilgrim with age 65+ in the Pilgrim tab first.');
    return;
  }

  sendTabMessage({
    action: 'fillSeniorCitizen',
    senior: seniorPilgrim,
    spouse: spousePilgrim || null,
    ageProof: appState.seniorAgeProof,
    andContinue: andContinue
  }, (resp) => {
    showToast(andContinue ? '⚡ Filled, attached & Continuing...' : '⚡ Senior Citizen details filled!', 'success');
  });
}

function renderSeniorTab() {
  const currentGroup = getCurrentGroup();
  // Find senior citizen (age >= 60/65)
  const senior = currentGroup.pilgrims.find(p => p.age >= 60) || currentGroup.pilgrims[0];
  const spouse = currentGroup.pilgrims.find(p => p !== senior);

  seniorBookedDisplay.innerHTML = '';
  if (!senior) {
    seniorBookedDisplay.innerHTML = `
      <div style="color: var(--text-muted); font-size: 11px;">
        No pilgrims found in the Pilgrim Booking tab. Please add the senior citizen in the 🛕 Pilgrim tab.
      </div>`;
  } else {
    seniorBookedDisplay.innerHTML = `
      <div class="senior-person-row">
        <strong style="color: var(--primary);">${escapeHtml(senior.name)} • senior citizen (${senior.age >= 65 ? '65+' : senior.age + ' yrs'})</strong>
        <div style="font-size: 11px; color: var(--text-muted);">${senior.age} yrs • ${senior.gender} • ${senior.idType} (${senior.idNumber})</div>
      </div>
      ${spouse ? `
        <div class="senior-person-row mt-sm" style="border-top: 1px dashed var(--border-subtle); padding-top: 6px;">
          <strong>${escapeHtml(spouse.name)} (Spouse)</strong>
          <div style="font-size: 11px; color: var(--text-muted);">${spouse.age} yrs • ${spouse.gender} • ${spouse.idType} (${spouse.idNumber})</div>
        </div>
      ` : ''}
    `;
  }

  if (appState.seniorAgeProof) {
    seniorFileDisplay.innerHTML = `✓ Saved: <strong style="color: var(--success);">${escapeHtml(appState.seniorAgeProof.name)}</strong>`;
  } else {
    seniorFileDisplay.textContent = 'No file saved.';
  }
}

// ============================================================================
// Communication with Tab (Content Script)
// ============================================================================
function sendTabMessage(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || tabs.length === 0) {
      showToast('No active tab found', 'error');
      return;
    }
    const tabId = tabs[0].id;
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        // Content script might not be injected yet, attempt manual script execution
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
        }, () => {
          chrome.tabs.sendMessage(tabId, message, (retryResponse) => {
            if (callback) callback(retryResponse);
          });
        });
      } else {
        if (callback) callback(response);
      }
    });
  });
}

// ============================================================================
// Helpers
// ============================================================================
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderAll() {
  renderPilgrimTab();
  loadSrivariForm();
  renderSevaGroupTab();
  renderSrivaniTab();
  renderSeniorTab();
}
