const cart = [];

// ── Branding & instellingen ───────────────────────────────────────────────────

async function loadSettings() {
  try {
    const res = await fetch('/api/settings');
    if (!res.ok) return;
    const settings = await res.json();
    applyBranding(settings);
    // Sync language with settings if no local override
    if (!localStorage.getItem('bakery_lang') && settings.language) {
      setLanguage(settings.language);
      applyTranslations();
    }
  } catch {
    // Geen instellingen beschikbaar — doorgaan met standaard
  }
}

function applyBranding(settings) {
  const root = document.documentElement;
  if (settings.primaryColor) {
    root.style.setProperty('--color-primary', settings.primaryColor);
    root.style.setProperty('--color-primary-hover', lightenHex(settings.primaryColor, 20));
    root.style.setProperty('--color-primary-dark', darkenHex(settings.primaryColor, 15));
  }
  if (settings.secondaryColor) {
    root.style.setProperty('--color-bg', settings.secondaryColor);
  }
  if (settings.accentColor) {
    root.style.setProperty('--color-accent', settings.accentColor);
  }

  const titleEl = document.getElementById('headerTitle');
  if (titleEl && settings.shopName) {
    titleEl.textContent = settings.shopName;
    document.title = settings.shopName + ' — ' + t('ourMenu');
  }

  const taglineEl = document.getElementById('headerTagline');
  if (taglineEl) {
    if (settings.tagline) {
      taglineEl.textContent = settings.tagline;
      taglineEl.style.display = 'block';
    } else {
      taglineEl.style.display = 'none';
    }
  }

  const logoEl = document.getElementById('headerLogo');
  if (logoEl) {
    if (settings.logo) {
      logoEl.src = settings.logo;
      logoEl.style.display = 'block';
    } else {
      logoEl.style.display = 'none';
    }
  }
}

// Eenvoudige hex kleur hulpfuncties
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
  try {
    const [r, g, b] = hexToRgb(hex);
    return rgbToHex(r + amount, g + amount, b + amount);
  } catch { return hex; }
}

function darkenHex(hex, amount) {
  try {
    const [r, g, b] = hexToRgb(hex);
    return rgbToHex(r - amount, g - amount, b - amount);
  } catch { return hex; }
}

// ── Menu ─────────────────────────────────────────────────────────────────────

async function loadMenu() {
  const grid = document.getElementById('menuGrid');
  try {
    const res = await fetch('/api/menu');
    const items = await res.json();
    renderMenu(items);
  } catch {
    grid.innerHTML = `<p>${t('menuError')}</p>`;
  }
}

function renderMenu(items) {
  const grid = document.getElementById('menuGrid');
  grid.innerHTML = '';
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'menu-card';

    const photoHtml = item.image
      ? `<div class="menu-card-img"><img src="${item.image}" alt="${escHtml(item.name)}" loading="lazy"></div>`
      : '';

    card.innerHTML = `
      ${photoHtml}
      <div class="menu-card-body">
        <h3>${escHtml(item.name)}</h3>
        <p>${escHtml(item.description)}</p>
        <div class="menu-card-footer">
          <span class="menu-price">€${item.price.toFixed(2).replace('.', ',')}</span>
          <button class="add-btn" data-id="${item.id}" data-name="${escAttr(item.name)}" data-price="${item.price}">
            ${t('addToCart')}
          </button>
        </div>
      </div>
    `;

    card.querySelector('.add-btn').addEventListener('click', () => {
      addToCart(item.id, item.name, item.price);
    });

    grid.appendChild(card);
  });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escAttr(str) {
  return String(str).replace(/'/g, '&#39;').replace(/"/g, '&quot;');
}

// ── Winkelwagen ───────────────────────────────────────────────────────────────

function addToCart(id, name, price) {
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  renderCart();
  openCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    cart.splice(cart.indexOf(item), 1);
  }
  renderCart();
}

function renderCart() {
  const itemsEl = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const formEl = document.getElementById('orderForm');
  const countEl = document.getElementById('cartCount');
  const priceEl = document.getElementById('totalPrice');

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  countEl.textContent = totalItems;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<p class="empty-cart">${t('cartEmpty')}</p>`;
    totalEl.style.display = 'none';
    formEl.style.display = 'none';
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span class="cart-item-name">${escHtml(item.name)}</span>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
        <span class="qty-display">${item.quantity}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
      <span class="cart-item-price">€${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
    </div>
  `).join('');

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  priceEl.textContent = `€${total.toFixed(2).replace('.', ',')}`;
  totalEl.style.display = 'block';
  formEl.style.display = 'block';
}

function openCart() {
  document.getElementById('cartPanel').classList.add('open');
  document.getElementById('overlay').classList.add('active');
}

function closeCart() {
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('overlay').classList.remove('active');
}

// ── Bestelling plaatsen ───────────────────────────────────────────────────────

async function placeOrder() {
  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const address = document.getElementById('customerAddress').value.trim();
  const deliveryTime = document.getElementById('deliveryTime').value.trim();

  if (!name || !phone || !address) {
    alert(t('fillRequired'));
    return;
  }

  if (cart.length === 0) {
    alert(t('cartEmptyError'));
    return;
  }

  const asap = t('asap');
  const body = {
    name,
    phone,
    address,
    deliveryTime: deliveryTime || asap,
    items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
  };

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || t('orderError'));
      return;
    }

    closeCart();
    const conf = document.getElementById('confirmation');
    document.getElementById('confirmationText').textContent =
      t('confirmationText', { name, address, time: body.deliveryTime });
    conf.style.display = 'flex';
  } catch {
    alert(t('connectionError'));
  }
}

// ── Events ────────────────────────────────────────────────────────────────────

document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
document.getElementById('overlay').addEventListener('click', closeCart);
document.getElementById('placeOrderBtn').addEventListener('click', placeOrder);

// Herlaad menu bij taalwisseling (knoppen vertalen)
document.addEventListener('rerenderAll', () => {
  loadMenu();
  applyTranslations();
});

// ── Init ──────────────────────────────────────────────────────────────────────

loadSettings().then(() => {
  loadMenu();
});
