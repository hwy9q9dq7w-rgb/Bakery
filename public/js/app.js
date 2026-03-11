const cart = [];

async function loadMenu() {
  const grid = document.getElementById('menuGrid');
  try {
    const res = await fetch('/api/menu');
    const items = await res.json();
    grid.innerHTML = '';
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'menu-card';
      card.innerHTML = `
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="menu-card-footer">
          <span class="menu-price">€${item.price.toFixed(2).replace('.', ',')}</span>
          <button class="add-btn" onclick="addToCart(${item.id}, '${item.name}', ${item.price})">+ Toevoegen</button>
        </div>
      `;
      grid.appendChild(card);
    });
  } catch {
    grid.innerHTML = '<p>Kon het menu niet laden. Controleer of de server actief is.</p>';
  }
}

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
    const idx = cart.indexOf(item);
    cart.splice(idx, 1);
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
    itemsEl.innerHTML = '<p class="empty-cart">Je winkelwagen is leeg.</p>';
    totalEl.style.display = 'none';
    formEl.style.display = 'none';
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span class="cart-item-name">${item.name}</span>
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

async function placeOrder() {
  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const address = document.getElementById('customerAddress').value.trim();
  const deliveryTime = document.getElementById('deliveryTime').value.trim();

  if (!name || !phone || !address) {
    alert('Vul je naam, telefoonnummer en bezorgadres in.');
    return;
  }

  if (cart.length === 0) {
    alert('Je winkelwagen is leeg.');
    return;
  }

  const body = {
    name,
    phone,
    address,
    deliveryTime: deliveryTime || 'Zo snel mogelijk',
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
      alert(err.error || 'Er ging iets mis. Probeer opnieuw.');
      return;
    }

    closeCart();
    const conf = document.getElementById('confirmation');
    document.getElementById('confirmationText').textContent =
      `Hoi ${name}, je bestelling wordt bezorgd op ${address}. Bezorgtijd: ${body.deliveryTime}.`;
    conf.style.display = 'flex';
  } catch {
    alert('Kon de bestelling niet plaatsen. Controleer je verbinding.');
  }
}

document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
document.getElementById('overlay').addEventListener('click', closeCart);
document.getElementById('placeOrderBtn').addEventListener('click', placeOrder);

loadMenu();
