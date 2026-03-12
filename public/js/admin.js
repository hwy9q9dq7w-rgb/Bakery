let allOrders = [];
let activeFilter = 'all';

// ── Tab switching ────────────────────────────────────────────────────────────

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    document.querySelectorAll('main > section').forEach(s => s.style.display = 'none');
    document.getElementById('tab-' + tab).style.display = 'block';
    if (tab === 'menu') loadMenuItems();
    if (tab === 'statistieken') loadStats();
  });
});

// ── Bestellingen ─────────────────────────────────────────────────────────────

async function loadOrders() {
  const list = document.getElementById('ordersList');
  list.innerHTML = '<p class="loading">Bestellingen laden...</p>';
  try {
    const res = await fetch('/api/orders');
    allOrders = await res.json();
    renderOrders();
  } catch {
    list.innerHTML = '<p class="loading">Kon bestellingen niet laden.</p>';
  }
}

function renderOrders() {
  const list = document.getElementById('ordersList');
  const countEl = document.getElementById('orderCount');

  const filtered = activeFilter === 'all'
    ? allOrders
    : allOrders.filter(o => o.status === activeFilter);

  countEl.textContent = `${filtered.length} bestelling${filtered.length !== 1 ? 'en' : ''}`;

  if (filtered.length === 0) {
    list.innerHTML = '<p class="no-orders">Geen bestellingen gevonden.</p>';
    return;
  }

  list.innerHTML = filtered.map(order => {
    const date = new Date(order.createdAt);
    const dateStr = date.toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

    const statusClass = order.status.replace(' ', '-');
    const cardClass = order.status.replace(' ', '.');

    const itemsHtml = order.items.map(item =>
      `<div class="order-item-line">
        <span>${item.quantity}x ${item.name}</span>
        <span>€${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
      </div>`
    ).join('');

    const statusButtons = ['Nieuw', 'In behandeling', 'Bezorgd']
      .filter(s => s !== order.status)
      .map(s => `<button class="status-select-btn" onclick="updateStatus('${order.id}', '${s}')">${s}</button>`)
      .join('');

    return `
      <div class="order-card status-${cardClass}" id="order-${order.id}">
        <div class="order-card-header">
          <div class="order-customer">
            <strong>${order.name}</strong>
            <p>${order.phone} &bull; ${order.address}</p>
            <p>Bezorgtijd: ${order.deliveryTime}</p>
          </div>
          <div class="order-meta">
            <div>${dateStr} ${timeStr}</div>
            <div>#${order.id.slice(-6)}</div>
          </div>
        </div>
        <div class="order-items">
          ${itemsHtml}
          <div class="order-total-line">
            <span>Totaal</span>
            <span>€${order.total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
        <div class="order-actions">
          <span class="status-badge ${statusClass}">${order.status}</span>
          ${statusButtons}
        </div>
      </div>
    `;
  }).join('');
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
    alert('Kon status niet bijwerken.');
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

async function loadMenuItems() {
  const list = document.getElementById('menuManageList');
  list.innerHTML = '<p class="loading">Menu laden...</p>';
  try {
    const res = await fetch('/api/menu');
    const items = await res.json();
    renderMenuItems(items);
  } catch {
    list.innerHTML = '<p class="loading">Kon menu niet laden.</p>';
  }
}

function renderMenuItems(items) {
  const list = document.getElementById('menuManageList');
  if (items.length === 0) {
    list.innerHTML = '<p class="no-orders">Geen menu-items gevonden.</p>';
    return;
  }
  list.innerHTML = items.map(item => `
    <div class="menu-manage-item" id="menu-item-${item.id}">
      <div class="menu-manage-info">
        <strong>${item.name}</strong>
        <span>${item.description}</span>
      </div>
      <div class="menu-manage-price">€${item.price.toFixed(2).replace('.', ',')}</div>
      <div class="menu-manage-actions">
        <button class="btn-edit" onclick="openMenuModal(${item.id}, '${escapeAttr(item.name)}', '${escapeAttr(item.description)}', ${item.price})">Bewerken</button>
        <button class="btn-delete" onclick="deleteMenuItem(${item.id}, '${escapeAttr(item.name)}')">Verwijderen</button>
      </div>
    </div>
  `).join('');
}

function escapeAttr(str) {
  return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function openMenuModal(id = null, name = '', desc = '', price = '') {
  editingMenuId = id;
  document.getElementById('menuModalTitle').textContent = id ? 'Menu-item bewerken' : 'Menu-item toevoegen';
  document.getElementById('menuItemId').value = id || '';
  document.getElementById('menuItemName').value = name;
  document.getElementById('menuItemDesc').value = desc;
  document.getElementById('menuItemPrice').value = price;
  document.getElementById('menuModal').style.display = 'flex';
}

function closeMenuModal() {
  document.getElementById('menuModal').style.display = 'none';
  editingMenuId = null;
}

async function saveMenuItem() {
  const name = document.getElementById('menuItemName').value.trim();
  const description = document.getElementById('menuItemDesc').value.trim();
  const price = document.getElementById('menuItemPrice').value;

  if (!name || !price) {
    alert('Naam en prijs zijn verplicht.');
    return;
  }

  try {
    const method = editingMenuId ? 'PUT' : 'POST';
    const url = editingMenuId ? `/api/menu/${editingMenuId}` : '/api/menu';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price: Number(price) }),
    });
    if (res.ok) {
      closeMenuModal();
      loadMenuItems();
    } else {
      const err = await res.json();
      alert(err.error || 'Opslaan mislukt.');
    }
  } catch {
    alert('Kon menu-item niet opslaan.');
  }
}

async function deleteMenuItem(id, name) {
  if (!confirm(`Weet je zeker dat je "${name}" wilt verwijderen?`)) return;
  try {
    const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
    if (res.ok) {
      loadMenuItems();
    } else {
      alert('Verwijderen mislukt.');
    }
  } catch {
    alert('Kon menu-item niet verwijderen.');
  }
}

// ── Statistieken ──────────────────────────────────────────────────────────────

async function loadStats() {
  const grid = document.getElementById('statsGrid');
  const breakdown = document.getElementById('statusBreakdown');
  grid.innerHTML = '<p class="loading">Statistieken laden...</p>';
  breakdown.innerHTML = '';
  try {
    const res = await fetch('/api/stats');
    const data = await res.json();

    grid.innerHTML = `
      <div class="stat-card">
        <div class="stat-card-label">Bestellingen vandaag</div>
        <div class="stat-card-value">${data.vandaag.aantalBestellingen}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Omzet vandaag</div>
        <div class="stat-card-value">€${data.vandaag.omzet.toFixed(2).replace('.', ',')}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Bestellingen deze week</div>
        <div class="stat-card-value">${data.dezeWeek.aantalBestellingen}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Omzet deze week</div>
        <div class="stat-card-value">€${data.dezeWeek.omzet.toFixed(2).replace('.', ',')}</div>
      </div>
    `;

    const statusLabels = { Nieuw: 'Nieuw', 'In behandeling': 'In-behandeling', Bezorgd: 'Bezorgd' };
    breakdown.innerHTML = Object.entries(data.perStatus).map(([status, count]) =>
      `<span class="status-badge ${statusLabels[status]}">${status}: ${count}</span>`
    ).join('');
  } catch {
    grid.innerHTML = '<p class="loading">Kon statistieken niet laden.</p>';
  }
}

// ── Auto-refresh en init ──────────────────────────────────────────────────────

setInterval(loadOrders, 30000);
loadOrders();
