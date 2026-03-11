let allOrders = [];
let activeFilter = 'all';

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

// Auto-refresh elke 30 seconden
setInterval(loadOrders, 30000);

loadOrders();
