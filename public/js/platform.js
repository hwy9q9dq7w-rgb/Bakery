let allBakeries = [];

// ── Tab switching ─────────────────────────────────────────────────────────────

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    document.querySelectorAll('main > section').forEach(s => s.style.display = 'none');
    document.getElementById('tab-' + tab).style.display = 'block';
    if (tab === 'statistieken') loadPlatformStats();
    if (tab === 'facturatie') loadInvoices();
  });
});

// ── Button event listeners ────────────────────────────────────────────────────

document.getElementById('addBakeryBtn').addEventListener('click', () => openBakeryModal());
document.getElementById('cancelBakeryBtn').addEventListener('click', closeBakeryModal);
document.getElementById('saveBakeryBtn').addEventListener('click', saveBakery);
document.getElementById('createInvoiceBtn').addEventListener('click', openInvoiceModal);
document.getElementById('cancelInvoiceBtn').addEventListener('click', closeInvoiceModal);
document.getElementById('generateInvoiceBtn').addEventListener('click', generateInvoice);

// ── Bakkerijen ────────────────────────────────────────────────────────────────

async function loadBakeries() {
  const list = document.getElementById('bakeriesList');
  list.innerHTML = `<p class="loading">${t('loading')}</p>`;
  try {
    const res = await fetch('/api/bakeries');
    allBakeries = await res.json();
    renderBakeries(allBakeries);
  } catch {
    list.innerHTML = `<p class="loading">${t('noBakeries')}</p>`;
  }
}

function renderBakeries(bakeries) {
  const list = document.getElementById('bakeriesList');
  if (bakeries.length === 0) {
    list.innerHTML = `<p class="no-orders">${t('noBakeries')}</p>`;
    return;
  }
  list.innerHTML = bakeries.map(b => {
    const statusClass = b.active ? 'Bezorgd' : 'Concept';
    const statusLabel = b.active ? t('active') : t('inactive');
    const planLabel = b.billing.plan === 'maandelijks' ? t('monthly') : t('yearly');
    return `
      <div class="bakery-card${b.active ? '' : ' inactive'}">
        <div class="bakery-card-info">
          <h3>${escHtml(b.name)}</h3>
          <p>${b.contactName ? escHtml(b.contactName) + ' &bull; ' : ''}${escHtml(b.email || '')}${b.phone ? ' &bull; ' + escHtml(b.phone) : ''}</p>
          ${b.address ? `<p>${escHtml(b.address)}</p>` : ''}
        </div>
        <div class="bakery-card-billing">
          <strong>${t('billing_label')}</strong>
          ${planLabel}<br>
          €${b.billing.monthlyFee.toFixed(2).replace('.', ',')} ${t('perMonth')}<br>
          €${b.billing.perOrderFee.toFixed(2).replace('.', ',')} ${t('perOrder')}
        </div>
        <div class="bakery-card-actions">
          <span class="status-badge ${statusClass}">${statusLabel}</span>
          <button class="btn-edit" onclick="openBakeryModal('${b.id}')">${t('editBtn')}</button>
          <button class="btn-edit" onclick="openInvoiceModalForBakery('${b.id}')">${t('invoiceBtn')}</button>
          <button class="btn-delete" onclick="toggleBakeryActive('${b.id}', ${b.active})">${b.active ? t('deactivateBtn') : t('activateBtn')}</button>
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

function openBakeryModal(id = null) {
  document.getElementById('bakeryModalTitle').textContent = id ? t('editBakeryTitle') : t('addBakeryTitle');
  document.getElementById('bakeryId').value = id || '';

  if (id) {
    const b = allBakeries.find(x => x.id === id);
    if (b) {
      document.getElementById('bakeryName').value = b.name;
      document.getElementById('bakeryContact').value = b.contactName || '';
      document.getElementById('bakeryEmail').value = b.email || '';
      document.getElementById('bakeryPhone').value = b.phone || '';
      document.getElementById('bakeryAddress').value = b.address || '';
      document.getElementById('bakeryPlan').value = b.billing.plan;
      document.getElementById('bakeryMonthlyFee').value = b.billing.monthlyFee;
      document.getElementById('bakeryPerOrderFee').value = b.billing.perOrderFee;
      document.getElementById('bakeryStartDate').value = b.billing.startDate || '';
    }
  } else {
    document.getElementById('bakeryName').value = '';
    document.getElementById('bakeryContact').value = '';
    document.getElementById('bakeryEmail').value = '';
    document.getElementById('bakeryPhone').value = '';
    document.getElementById('bakeryAddress').value = '';
    document.getElementById('bakeryPlan').value = 'maandelijks';
    document.getElementById('bakeryMonthlyFee').value = '29.95';
    document.getElementById('bakeryPerOrderFee').value = '0.10';
    document.getElementById('bakeryStartDate').value = new Date().toISOString().slice(0, 10);
  }

  document.getElementById('bakeryModal').style.display = 'flex';
}

function closeBakeryModal() {
  document.getElementById('bakeryModal').style.display = 'none';
}

async function saveBakery() {
  const id = document.getElementById('bakeryId').value;
  const name = document.getElementById('bakeryName').value.trim();
  if (!name) {
    alert(t('nameRequired'));
    return;
  }

  const body = {
    name,
    contactName: document.getElementById('bakeryContact').value.trim(),
    email: document.getElementById('bakeryEmail').value.trim(),
    phone: document.getElementById('bakeryPhone').value.trim(),
    address: document.getElementById('bakeryAddress').value.trim(),
    billing: {
      plan: document.getElementById('bakeryPlan').value,
      monthlyFee: Number(document.getElementById('bakeryMonthlyFee').value),
      perOrderFee: Number(document.getElementById('bakeryPerOrderFee').value),
      startDate: document.getElementById('bakeryStartDate').value,
    },
  };

  try {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/bakeries/${id}` : '/api/bakeries';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      closeBakeryModal();
      loadBakeries();
    } else {
      const err = await res.json();
      alert(err.error || t('saveBakeryError'));
    }
  } catch {
    alert(t('saveBakeryError'));
  }
}

async function toggleBakeryActive(id, currentActive) {
  const action = currentActive ? t('deactivate') : t('activate');
  if (!confirm(t('toggleConfirm', { action }))) return;
  try {
    const res = await fetch(`/api/bakeries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !currentActive }),
    });
    if (res.ok) loadBakeries();
    else alert(t('toggleError'));
  } catch {
    alert(t('toggleError'));
  }
}

// ── Platform statistieken ─────────────────────────────────────────────────────

async function loadPlatformStats() {
  const grid = document.getElementById('platformStatsGrid');
  const tbody = document.getElementById('perBakeryBody');
  grid.innerHTML = `<p class="loading">${t('statsLoading')}</p>`;
  tbody.innerHTML = '';
  try {
    const res = await fetch('/api/platform/stats');
    const data = await res.json();

    grid.innerHTML = `
      <div class="stat-card">
        <div class="stat-card-label">${t('totalBakeries')}</div>
        <div class="stat-card-value">${data.totaleBakkerijen}</div>
        <div class="stat-card-sub">${data.actieveBakkerijen} ${t('activeSub')}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">${t('totalOrders')}</div>
        <div class="stat-card-value">${data.totaleBestellingen}</div>
        <div class="stat-card-sub">${t('platformWide')}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">${t('platformRevenue')}</div>
        <div class="stat-card-value">€${data.platformOmzet.toFixed(2).replace('.', ',')}</div>
        <div class="stat-card-sub">${t('billedPaid')}</div>
      </div>
    `;

    if (data.perBakkerij.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="loading">${t('noBakeriesStats')}</td></tr>`;
      return;
    }

    tbody.innerHTML = data.perBakkerij.map(b => `
      <tr>
        <td><strong>${escHtml(b.naam)}</strong></td>
        <td><span class="status-badge ${b.actief ? 'Bezorgd' : 'Concept'}">${b.actief ? t('active') : t('inactive')}</span></td>
        <td>${b.aantalBestellingen}</td>
        <td>€${b.omzet.toFixed(2).replace('.', ',')}</td>
        <td>€${b.factuurOmzet.toFixed(2).replace('.', ',')}</td>
      </tr>
    `).join('');
  } catch {
    grid.innerHTML = `<p class="loading">${t('statsLoadError')}</p>`;
  }
}

// ── Facturatie ────────────────────────────────────────────────────────────────

async function loadInvoices() {
  const tbody = document.getElementById('invoiceBody');
  tbody.innerHTML = `<tr><td colspan="8" class="loading">${t('invoicesLoading')}</td></tr>`;
  try {
    const res = await fetch('/api/invoices');
    const invoices = await res.json();
    renderInvoices(invoices);
  } catch {
    tbody.innerHTML = `<tr><td colspan="8" class="loading">${t('invoicesError')}</td></tr>`;
  }
}

function renderInvoices(invoices) {
  const tbody = document.getElementById('invoiceBody');
  if (invoices.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="no-orders">${t('noInvoices')}</td></tr>`;
    return;
  }
  const locale = getLang() === 'de' ? 'de-DE' : getLang() === 'en' ? 'en-GB' : 'nl-NL';
  tbody.innerHTML = invoices.map(inv => {
    const from = new Date(inv.period.from).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
    const to = new Date(inv.period.to).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });

    const actionBtns = [];
    if (inv.status === 'Concept') {
      actionBtns.push(`<button class="btn-edit" onclick="updateInvoiceStatus('${inv.id}', 'Verstuurd')">${t('sendInvoice')}</button>`);
    }
    if (inv.status === 'Verstuurd') {
      actionBtns.push(`<button class="btn-edit" onclick="updateInvoiceStatus('${inv.id}', 'Betaald')">${t('markPaid')}</button>`);
    }

    return `
      <tr>
        <td><strong>${escHtml(inv.id)}</strong></td>
        <td>${escHtml(inv.bakeryName)}</td>
        <td>${from} – ${to}</td>
        <td>€${inv.subtotal.toFixed(2).replace('.', ',')}</td>
        <td>€${inv.btw.toFixed(2).replace('.', ',')}</td>
        <td><strong>€${inv.total.toFixed(2).replace('.', ',')}</strong></td>
        <td><span class="status-badge ${inv.status}">${inv.status}</span></td>
        <td style="display:flex;gap:0.4rem;flex-wrap:wrap">${actionBtns.join('')}</td>
      </tr>
    `;
  }).join('');
}

async function updateInvoiceStatus(id, status) {
  try {
    const res = await fetch(`/api/invoices/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      loadInvoices();
    } else {
      alert(t('invoiceStatusError'));
    }
  } catch {
    alert(t('invoiceStatusError'));
  }
}

function openInvoiceModal() {
  populateBakerySelect();
  document.getElementById('invoiceBakeryId').value = '';
  document.getElementById('invoicePeriodFrom').value = '';
  document.getElementById('invoicePeriodTo').value = '';
  document.getElementById('invoicePreview').style.display = 'none';
  document.getElementById('invoiceModal').style.display = 'flex';
}

function openInvoiceModalForBakery(bakeryId) {
  populateBakerySelect();
  document.getElementById('invoiceBakeryId').value = bakeryId;
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const lastOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
  document.getElementById('invoicePeriodFrom').value = firstOfMonth;
  document.getElementById('invoicePeriodTo').value = lastOfMonth;
  document.getElementById('invoiceModal').style.display = 'flex';
  updateInvoicePreview();
}

function populateBakerySelect() {
  const select = document.getElementById('invoiceBakeryId');
  const current = select.value;
  select.innerHTML = `<option value="">${t('selectBakery')}</option>` +
    allBakeries.map(b => `<option value="${b.id}">${escHtml(b.name)}</option>`).join('');
  if (current) select.value = current;
}

function closeInvoiceModal() {
  document.getElementById('invoiceModal').style.display = 'none';
}

function updateInvoicePreview() {
  const bakeryId = document.getElementById('invoiceBakeryId').value;
  const from = document.getElementById('invoicePeriodFrom').value;
  const preview = document.getElementById('invoicePreview');
  const lines = document.getElementById('invoicePreviewLines');

  if (!bakeryId || !from) { preview.style.display = 'none'; return; }
  const bakery = allBakeries.find(b => b.id === bakeryId);
  if (!bakery) { preview.style.display = 'none'; return; }

  const locale = getLang() === 'de' ? 'de-DE' : getLang() === 'en' ? 'en-GB' : 'nl-NL';
  const fromDate = new Date(from);
  const monthName = fromDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  const subtotal = bakery.billing.monthlyFee;
  const btw = Math.round(subtotal * 0.21 * 100) / 100;
  const total = Math.round((subtotal + btw) * 100) / 100;

  lines.innerHTML = `
    <div class="invoice-preview-line">
      <span>${t('monthlySubscription')} ${monthName}</span>
      <span>€${bakery.billing.monthlyFee.toFixed(2).replace('.', ',')}</span>
    </div>
    ${bakery.billing.perOrderFee > 0 ? `
    <div class="invoice-preview-line">
      <span>${t('orderCosts')} (€${bakery.billing.perOrderFee.toFixed(2).replace('.', ',')} × orders)</span>
      <span>${t('variable')}</span>
    </div>` : ''}
    <div class="invoice-preview-line">
      <span>${t('vat')}</span>
      <span>≥ €${btw.toFixed(2).replace('.', ',')}</span>
    </div>
    <div class="invoice-preview-total">
      <span>${t('minTotal')}</span>
      <span>≥ €${total.toFixed(2).replace('.', ',')}</span>
    </div>
  `;
  preview.style.display = 'block';
}

async function generateInvoice() {
  const bakeryId = document.getElementById('invoiceBakeryId').value;
  const periodFrom = document.getElementById('invoicePeriodFrom').value;
  const periodTo = document.getElementById('invoicePeriodTo').value;

  if (!bakeryId || !periodFrom || !periodTo) {
    alert(t('invoiceSelectError'));
    return;
  }

  try {
    const res = await fetch('/api/invoices/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bakeryId, periodFrom, periodTo }),
    });
    if (res.ok) {
      closeInvoiceModal();
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('[data-tab="facturatie"]').classList.add('active');
      document.querySelectorAll('main > section').forEach(s => s.style.display = 'none');
      document.getElementById('tab-facturatie').style.display = 'block';
      loadInvoices();
    } else {
      const err = await res.json();
      alert(err.error || t('invoiceCreateError'));
    }
  } catch {
    alert(t('invoiceConnError'));
  }
}

// ── Herrendering bij taalwisseling ────────────────────────────────────────────

document.addEventListener('rerenderAll', () => {
  applyTranslations();
  const activeTab = document.querySelector('.tab-btn.active')?.dataset?.tab;
  if (activeTab === 'bakkerijen') renderBakeries(allBakeries);
  if (activeTab === 'statistieken') loadPlatformStats();
  if (activeTab === 'facturatie') loadInvoices();
});

// ── Init ──────────────────────────────────────────────────────────────────────

loadBakeries();
