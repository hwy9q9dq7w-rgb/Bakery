let allOrders = [];
let activeFilter = 'all';

// ── Branding laden ────────────────────────────────────────────────────────────

async function loadBranding() {
  try {
    const res = await fetch('/api/settings');
    if (!res.ok) return;
    const settings = await res.json();
    applyAdminBranding(settings);
    if (!localStorage.getItem('bakery_lang') && settings.language) {
      setLanguage(settings.language);
      applyTranslations();
    }
  } catch { /* doorgaan met standaard */ }
}

function applyAdminBranding(settings) {
  const root = document.documentElement;
  if (settings.primaryColor) {
    root.style.setProperty('--color-primary', settings.primaryColor);
    root.style.setProperty('--color-primary-hover', lightenHex(settings.primaryColor, 20));
    root.style.setProperty('--color-primary-dark', darkenHex(settings.primaryColor, 15));
  }
  if (settings.secondaryColor) root.style.setProperty('--color-bg', settings.secondaryColor);
  if (settings.accentColor) root.style.setProperty('--color-accent', settings.accentColor);

  const titleEl = document.getElementById('headerTitle');
  if (titleEl && settings.shopName) {
    titleEl.textContent = settings.shopName + ' — ' + t('adminTitle').split('—')[1].trim();
  }
  const logoEl = document.getElementById('headerLogo');
  if (logoEl) {
    if (settings.logo) { logoEl.src = settings.logo; logoEl.style.display = 'block'; }
    else logoEl.style.display = 'none';
  }
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
}

function lightenHex(hex, amount) {
  try { const [r, g, b] = hexToRgb(hex); return rgbToHex(r + amount, g + amount, b + amount); }
  catch { return hex; }
}

function darkenHex(hex, amount) {
  try { const [r, g, b] = hexToRgb(hex); return rgbToHex(r - amount, g - amount, b - amount); }
  catch { return hex; }
}

// ── Tab switching ─────────────────────────────────────────────────────────────

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    document.querySelectorAll('main > section').forEach(s => s.style.display = 'none');
    document.getElementById('tab-' + tab).style.display = 'block';
    if (tab === 'menu') loadMenuItems();
    if (tab === 'statistieken') loadStats();
    if (tab === 'instellingen') loadSettingsForm();
  });
});

// ── Bestellingen ──────────────────────────────────────────────────────────────

async function loadOrders() {
  const list = document.getElementById('ordersList');
  list.innerHTML = `<p class="loading">${t('ordersLoading')}</p>`;
  try {
    const res = await fetch('/api/orders');
    allOrders = await res.json();
    renderOrders();
  } catch {
    list.innerHTML = `<p class="loading">${t('ordersError')}</p>`;
  }
}

function renderOrders() {
  const list = document.getElementById('ordersList');
  const countEl = document.getElementById('orderCount');

  const filtered = activeFilter === 'all'
    ? allOrders
    : allOrders.filter(o => o.status === activeFilter);

  const count = filtered.length;
  const key = count === 1 ? 'orderCountSingle' : 'orderCountPlural';
  countEl.textContent = t(key, { count });

  if (filtered.length === 0) {
    list.innerHTML = `<p class="no-orders">${t('noOrders')}</p>`;
    return;
  }

  const locale = getLang() === 'de' ? 'de-DE' : getLang() === 'en' ? 'en-GB' : 'nl-NL';

  list.innerHTML = filtered.map(order => {
    const date = new Date(order.createdAt);
    const dateStr = date.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

    const statusClass = order.status.replace(' ', '-');

    const itemsHtml = order.items.map(item =>
      `<div class="order-item-line">
        <span>${item.quantity}× ${escHtml(item.name)}</span>
        <span>€${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
      </div>`
    ).join('');

    const statusLabels = {
      'Nieuw': t('filterNew'),
      'In behandeling': t('filterProcessing'),
      'Bezorgd': t('filterDelivered'),
    };

    const statusButtons = ['Nieuw', 'In behandeling', 'Bezorgd']
      .filter(s => s !== order.status)
      .map(s => `<button class="status-select-btn" onclick="updateStatus('${order.id}', '${s}')">${statusLabels[s]}</button>`)
      .join('');

    return `
      <div class="order-card status-${statusClass}" id="order-${order.id}">
        <div class="order-card-header">
          <div class="order-customer">
            <strong>${escHtml(order.name)}</strong>
            <p>${escHtml(order.phone)} &bull; ${escHtml(order.address)}</p>
            <p>${t('deliveryTimeLabel')}: ${escHtml(order.deliveryTime)}</p>
          </div>
          <div class="order-meta">
            <div>${dateStr} ${timeStr}</div>
            <div>#${order.id.slice(-6)}</div>
          </div>
        </div>
        <div class="order-items">
          ${itemsHtml}
          <div class="order-total-line">
            <span>${t('total')}</span>
            <span>€${order.total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
        <div class="order-actions">
          <span class="status-badge ${statusClass}">${statusLabels[order.status] || order.status}</span>
          ${statusButtons}
        </div>
      </div>
    `;
  }).join('');
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function updateStatus(id, status) {
  try {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const order = allOrders.find(o => o.id === id);
      if (order) order.status = status;
      renderOrders();
    }
  } catch {
    alert(t('statusUpdateError'));
  }
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderOrders();
  });
});

// ── Menu beheer ───────────────────────────────────────────────────────────────

let editingMenuId = null;
let currentPhotoData = null;  // base64 afbeelding of null

async function loadMenuItems() {
  const list = document.getElementById('menuManageList');
  list.innerHTML = `<p class="loading">${t('menuLoading2')}</p>`;
  try {
    const res = await fetch('/api/menu');
    const items = await res.json();
    renderMenuItems(items);
  } catch {
    list.innerHTML = `<p class="loading">${t('menuError2')}</p>`;
  }
}

function renderMenuItems(items) {
  const list = document.getElementById('menuManageList');
  if (items.length === 0) {
    list.innerHTML = `<p class="no-orders">${t('noMenuItems')}</p>`;
    return;
  }
  list.innerHTML = items.map(item => {
    const thumbHtml = item.image
      ? `<img class="menu-manage-thumb" src="${item.image}" alt="${escAttr(item.name)}">`
      : '';
    return `
      <div class="menu-manage-item" id="menu-item-${item.id}">
        ${thumbHtml}
        <div class="menu-manage-info">
          <strong>${escHtml(item.name)}</strong>
          <span>${escHtml(item.description)}</span>
        </div>
        <div class="menu-manage-price">€${item.price.toFixed(2).replace('.', ',')}</div>
        <div class="menu-manage-actions">
          <button class="btn-edit" onclick="openMenuModal(${item.id}, '${escAttr(item.name)}', '${escAttr(item.description)}', ${item.price}, ${item.image ? `'${item.image}'` : 'null'})">${t('edit')}</button>
          <button class="btn-delete" onclick="deleteMenuItem(${item.id}, '${escAttr(item.name)}')">${t('delete')}</button>
        </div>
      </div>
    `;
  }).join('');
}

function escAttr(str) {
  return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function openMenuModal(id = null, name = '', desc = '', price = '', image = null) {
  editingMenuId = id;
  currentPhotoData = image || null;

  document.getElementById('menuModalTitle').textContent = id ? t('editMenuTitle') : t('addMenuTitle');
  document.getElementById('menuItemId').value = id || '';
  document.getElementById('menuItemName').value = name;
  document.getElementById('menuItemDesc').value = desc;
  document.getElementById('menuItemPrice').value = price;
  document.getElementById('photoFileInput').value = '';

  // Foto preview
  const previewWrap = document.getElementById('photoPreviewWrap');
  const previewImg = document.getElementById('photoPreviewImg');
  if (image) {
    previewImg.src = image;
    previewWrap.style.display = 'inline-block';
  } else {
    previewImg.src = '';
    previewWrap.style.display = 'none';
  }

  document.getElementById('menuModal').style.display = 'flex';
}

function closeMenuModal() {
  document.getElementById('menuModal').style.display = 'none';
  editingMenuId = null;
  currentPhotoData = null;
}

// Foto upload handling
document.getElementById('photoFileInput').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    currentPhotoData = e.target.result;
    const previewImg = document.getElementById('photoPreviewImg');
    previewImg.src = currentPhotoData;
    document.getElementById('photoPreviewWrap').style.display = 'inline-block';
  };
  reader.readAsDataURL(file);
});

document.getElementById('photoRemoveBtn').addEventListener('click', () => {
  currentPhotoData = null;
  document.getElementById('photoFileInput').value = '';
  document.getElementById('photoPreviewImg').src = '';
  document.getElementById('photoPreviewWrap').style.display = 'none';
});

document.getElementById('addItemBtn').addEventListener('click', () => openMenuModal());
document.getElementById('cancelMenuBtn').addEventListener('click', closeMenuModal);
document.getElementById('saveMenuBtn').addEventListener('click', saveMenuItem);

async function saveMenuItem() {
  const name = document.getElementById('menuItemName').value.trim();
  const description = document.getElementById('menuItemDesc').value.trim();
  const price = document.getElementById('menuItemPrice').value;

  if (!name || !price) {
    alert(t('requiredError'));
    return;
  }

  try {
    const method = editingMenuId ? 'PUT' : 'POST';
    const url = editingMenuId ? `/api/menu/${editingMenuId}` : '/api/menu';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price: Number(price), image: currentPhotoData }),
    });
    if (res.ok) {
      closeMenuModal();
      loadMenuItems();
    } else {
      const err = await res.json();
      alert(err.error || t('saveError'));
    }
  } catch {
    alert(t('saveErrorConn'));
  }
}

async function deleteMenuItem(id, name) {
  if (!confirm(t('deleteConfirm', { name }))) return;
  try {
    const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
    if (res.ok) {
      loadMenuItems();
    } else {
      alert(t('deleteError'));
    }
  } catch {
    alert(t('deleteErrorConn'));
  }
}

// ── Statistieken ──────────────────────────────────────────────────────────────

async function loadStats() {
  const grid = document.getElementById('statsGrid');
  const breakdown = document.getElementById('statusBreakdown');
  grid.innerHTML = `<p class="loading">${t('statsLoading')}</p>`;
  breakdown.innerHTML = '';
  try {
    const res = await fetch('/api/stats');
    const data = await res.json();

    grid.innerHTML = `
      <div class="stat-card">
        <div class="stat-card-label">${t('todayOrders')}</div>
        <div class="stat-card-value">${data.vandaag.aantalBestellingen}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">${t('todayRevenue')}</div>
        <div class="stat-card-value">€${data.vandaag.omzet.toFixed(2).replace('.', ',')}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">${t('weekOrders')}</div>
        <div class="stat-card-value">${data.dezeWeek.aantalBestellingen}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">${t('weekRevenue')}</div>
        <div class="stat-card-value">€${data.dezeWeek.omzet.toFixed(2).replace('.', ',')}</div>
      </div>
    `;

    const statusMap = {
      'Nieuw': { label: t('filterNew'), cls: 'Nieuw' },
      'In behandeling': { label: t('filterProcessing'), cls: 'In-behandeling' },
      'Bezorgd': { label: t('filterDelivered'), cls: 'Bezorgd' },
    };
    breakdown.innerHTML = Object.entries(data.perStatus).map(([status, count]) => {
      const m = statusMap[status] || { label: status, cls: status };
      return `<span class="status-badge ${m.cls}">${m.label}: ${count}</span>`;
    }).join('');
  } catch {
    grid.innerHTML = `<p class="loading">${t('statsError')}</p>`;
  }
}

// ── Instellingen ──────────────────────────────────────────────────────────────

let currentSettings = {};
let currentLogoData = null;

async function loadSettingsForm() {
  try {
    const res = await fetch('/api/settings');
    if (!res.ok) return;
    currentSettings = await res.json();
    fillSettingsForm(currentSettings);
  } catch { /* doorgaan */ }
}

function fillSettingsForm(s) {
  document.getElementById('settingsShopName').value = s.shopName || '';
  document.getElementById('settingsTagline').value = s.tagline || '';
  document.getElementById('settingsLanguage').value = s.language || 'nl';

  const p = s.primaryColor || '#8b4513';
  const sec = s.secondaryColor || '#faf7f2';
  const acc = s.accentColor || '#d4a039';

  document.getElementById('colorPrimary').value = p;
  document.getElementById('colorPrimaryHex').value = p;
  document.getElementById('colorSecondary').value = sec;
  document.getElementById('colorSecondaryHex').value = sec;
  document.getElementById('colorAccent').value = acc;
  document.getElementById('colorAccentHex').value = acc;

  // Logo
  currentLogoData = s.logo || null;
  const logoImg = document.getElementById('logoPreviewImg');
  const logoText = document.getElementById('logoUploadText');
  if (s.logo) {
    logoImg.src = s.logo;
    logoImg.style.display = 'block';
    logoText.style.display = 'none';
  } else {
    logoImg.style.display = 'none';
    logoText.style.display = 'block';
  }
  document.getElementById('logoRemoveBtn').style.display = s.logo ? 'inline-flex' : 'none';

  updateColorPreview(p, sec, acc, s.shopName || t('shopName'));
}

function updateColorPreview(primary, secondary, accent, name) {
  const header = document.getElementById('previewHeader');
  const titleEl = document.getElementById('previewTitle');
  const btn = document.getElementById('previewBtn');
  const addBtn = document.getElementById('previewAddBtn');
  const priceEl = document.getElementById('previewPrice');

  if (header) header.style.background = primary;
  if (titleEl) titleEl.textContent = name || t('shopName');
  if (btn) btn.style.color = primary;
  if (addBtn) { addBtn.style.background = primary; }
  if (priceEl) priceEl.style.color = primary;
}

// Kleur pickers synchroniseren
function setupColorSync(colorId, hexId) {
  const colorInput = document.getElementById(colorId);
  const hexInput = document.getElementById(hexId);
  if (!colorInput || !hexInput) return;

  colorInput.addEventListener('input', () => {
    hexInput.value = colorInput.value;
    refreshPreviewFromForm();
    applyLiveColors();
  });

  hexInput.addEventListener('input', () => {
    const val = hexInput.value.trim();
    if (/^#[0-9a-f]{6}$/i.test(val)) {
      colorInput.value = val;
      refreshPreviewFromForm();
      applyLiveColors();
    }
  });
}

function applyLiveColors() {
  const p = document.getElementById('colorPrimary').value;
  const sec = document.getElementById('colorSecondary').value;
  const acc = document.getElementById('colorAccent').value;
  const root = document.documentElement;
  root.style.setProperty('--color-primary', p);
  root.style.setProperty('--color-primary-hover', lightenHex(p, 20));
  root.style.setProperty('--color-primary-dark', darkenHex(p, 15));
  root.style.setProperty('--color-bg', sec);
  root.style.setProperty('--color-accent', acc);
}

function refreshPreviewFromForm() {
  const p = document.getElementById('colorPrimary').value;
  const sec = document.getElementById('colorSecondary').value;
  const acc = document.getElementById('colorAccent').value;
  const name = document.getElementById('settingsShopName').value || t('shopName');
  updateColorPreview(p, sec, acc, name);
}

// Logo upload
document.getElementById('logoFileInput').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    currentLogoData = e.target.result;
    const img = document.getElementById('logoPreviewImg');
    img.src = currentLogoData;
    img.style.display = 'block';
    document.getElementById('logoUploadText').style.display = 'none';
    document.getElementById('logoRemoveBtn').style.display = 'inline-flex';
    // Live update header
    const headerLogo = document.getElementById('headerLogo');
    if (headerLogo) { headerLogo.src = currentLogoData; headerLogo.style.display = 'block'; }
  };
  reader.readAsDataURL(file);
});

document.getElementById('logoRemoveBtn').addEventListener('click', () => {
  currentLogoData = null;
  document.getElementById('logoPreviewImg').style.display = 'none';
  document.getElementById('logoUploadText').style.display = 'block';
  document.getElementById('logoRemoveBtn').style.display = 'none';
  document.getElementById('logoFileInput').value = '';
  const headerLogo = document.getElementById('headerLogo');
  if (headerLogo) headerLogo.style.display = 'none';
});

document.getElementById('resetColorsBtn').addEventListener('click', () => {
  const defaults = { primary: '#8b4513', secondary: '#faf7f2', accent: '#d4a039' };
  document.getElementById('colorPrimary').value = defaults.primary;
  document.getElementById('colorPrimaryHex').value = defaults.primary;
  document.getElementById('colorSecondary').value = defaults.secondary;
  document.getElementById('colorSecondaryHex').value = defaults.secondary;
  document.getElementById('colorAccent').value = defaults.accent;
  document.getElementById('colorAccentHex').value = defaults.accent;
  refreshPreviewFromForm();
  applyLiveColors();
});

document.getElementById('settingsShopName').addEventListener('input', refreshPreviewFromForm);

document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);

async function saveSettings() {
  const shopName = document.getElementById('settingsShopName').value.trim();
  const tagline = document.getElementById('settingsTagline').value.trim();
  const primaryColor = document.getElementById('colorPrimary').value;
  const secondaryColor = document.getElementById('colorSecondary').value;
  const accentColor = document.getElementById('colorAccent').value;
  const language = document.getElementById('settingsLanguage').value;

  const body = {
    shopName: shopName || t('shopName'),
    tagline,
    logo: currentLogoData,
    primaryColor,
    secondaryColor,
    accentColor,
    language,
  };

  try {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      // Taal instellen
      setLanguage(language);
      applyTranslations();
      // Toon bevestiging
      const msg = document.getElementById('settingsSaveMsg');
      msg.textContent = t('settingsSaved');
      msg.classList.add('visible');
      setTimeout(() => msg.classList.remove('visible'), 2500);
    } else {
      alert(t('settingsError'));
    }
  } catch {
    alert(t('settingsError'));
  }
}

// ── Auto-refresh en init ──────────────────────────────────────────────────────

document.addEventListener('rerenderAll', () => {
  applyTranslations();
  // Herrendeer actieve tab
  const activeTab = document.querySelector('.tab-btn.active')?.dataset?.tab;
  if (activeTab === 'bestellingen') renderOrders();
  if (activeTab === 'menu') loadMenuItems();
  if (activeTab === 'statistieken') loadStats();
  if (activeTab === 'instellingen') {
    fillSettingsForm(currentSettings);
  }
});

setInterval(loadOrders, 30000);

// Setup kleur-synchronisatie
document.addEventListener('DOMContentLoaded', () => {
  setupColorSync('colorPrimary', 'colorPrimaryHex');
  setupColorSync('colorSecondary', 'colorSecondaryHex');
  setupColorSync('colorAccent', 'colorAccentHex');
});

loadBranding().then(() => {
  loadOrders();
});
