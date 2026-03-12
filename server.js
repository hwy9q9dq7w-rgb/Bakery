const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const ORDERS_FILE = path.join(__dirname, 'orders.json');
const BAKERIES_FILE = path.join(__dirname, 'bakeries.json');
const INVOICES_FILE = path.join(__dirname, 'invoices.json');
const MENU_FILE = path.join(__dirname, 'menu.json');
const SETTINGS_FILE = path.join(__dirname, 'settings.json');

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const DEFAULT_SETTINGS = {
  shopName: 'Bakkerij',
  tagline: '',
  logo: null,
  primaryColor: '#8b4513',
  secondaryColor: '#faf7f2',
  accentColor: '#d4a039',
  language: 'nl',
};

function readSettings() {
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
    return { ...DEFAULT_SETTINGS };
  }
  return { ...DEFAULT_SETTINGS, ...JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8')) };
}

function writeSettings(settings) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

const DEFAULT_MENU = [
  { id: 1, name: 'Kaas', description: 'Vers broodje met belegen kaas', price: 2.50 },
  { id: 2, name: 'Ham', description: 'Broodje met gekookte ham', price: 2.75 },
  { id: 3, name: 'Gezond', description: 'Broodje met komkommer, tomaat en sla', price: 3.00 },
  { id: 4, name: 'Kroket', description: 'Broodje met warme rundvleeskroket', price: 3.50 },
  { id: 5, name: 'Tuna', description: 'Broodje met tonijnsalade', price: 3.25 },
  { id: 6, name: 'Ei salade', description: 'Broodje met huisgemaakte eiersalade', price: 3.00 },
  { id: 7, name: 'Rosbief', description: 'Broodje met rosbief en mierikswortel', price: 4.00 },
  { id: 8, name: 'BLT', description: 'Bacon, sla en tomaat', price: 3.75 },
];

function readOrders() {
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, '[]');
  }
  return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
}

function writeOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

function readMenu() {
  if (!fs.existsSync(MENU_FILE)) {
    fs.writeFileSync(MENU_FILE, JSON.stringify(DEFAULT_MENU, null, 2));
  }
  const data = JSON.parse(fs.readFileSync(MENU_FILE, 'utf8'));
  if (!data || data.length === 0) {
    fs.writeFileSync(MENU_FILE, JSON.stringify(DEFAULT_MENU, null, 2));
    return DEFAULT_MENU;
  }
  return data;
}

function writeMenu(menu) {
  fs.writeFileSync(MENU_FILE, JSON.stringify(menu, null, 2));
}

function readBakeries() {
  if (!fs.existsSync(BAKERIES_FILE)) {
    fs.writeFileSync(BAKERIES_FILE, '[]');
  }
  return JSON.parse(fs.readFileSync(BAKERIES_FILE, 'utf8'));
}

function writeBakeries(bakeries) {
  fs.writeFileSync(BAKERIES_FILE, JSON.stringify(bakeries, null, 2));
}

function readInvoices() {
  if (!fs.existsSync(INVOICES_FILE)) {
    fs.writeFileSync(INVOICES_FILE, '[]');
  }
  return JSON.parse(fs.readFileSync(INVOICES_FILE, 'utf8'));
}

function writeInvoices(invoices) {
  fs.writeFileSync(INVOICES_FILE, JSON.stringify(invoices, null, 2));
}

// ── Menu endpoints ──────────────────────────────────────────────────────────

app.get('/api/menu', (req, res) => {
  res.json(readMenu());
});

app.post('/api/menu', (req, res) => {
  const { name, description, price, image } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Naam en prijs zijn verplicht.' });
  }
  const menu = readMenu();
  const newItem = {
    id: Date.now(),
    name,
    description: description || '',
    price: Math.round(Number(price) * 100) / 100,
    image: image || null,
  };
  menu.push(newItem);
  writeMenu(menu);
  res.status(201).json(newItem);
});

app.put('/api/menu/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, description, price, image } = req.body;
  const menu = readMenu();
  const item = menu.find(m => m.id === id);
  if (!item) return res.status(404).json({ error: 'Menu-item niet gevonden.' });
  if (name !== undefined) item.name = name;
  if (description !== undefined) item.description = description;
  if (price !== undefined) item.price = Math.round(Number(price) * 100) / 100;
  if (image !== undefined) item.image = image;
  writeMenu(menu);
  res.json(item);
});

app.delete('/api/menu/:id', (req, res) => {
  const id = Number(req.params.id);
  const menu = readMenu();
  const index = menu.findIndex(m => m.id === id);
  if (index === -1) return res.status(404).json({ error: 'Menu-item niet gevonden.' });
  menu.splice(index, 1);
  writeMenu(menu);
  res.json({ message: 'Menu-item verwijderd.' });
});

// ── Order endpoints ──────────────────────────────────────────────────────────

app.post('/api/orders', (req, res) => {
  const { name, phone, address, deliveryTime, items, bakeryId } = req.body;

  if (!name || !phone || !address || !items || items.length === 0) {
    return res.status(400).json({ error: 'Vul alle verplichte velden in.' });
  }

  const orders = readOrders();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = {
    id: Date.now().toString(),
    bakeryId: bakeryId || 'default',
    name,
    phone,
    address,
    deliveryTime: deliveryTime || 'Zo snel mogelijk',
    items,
    total: Math.round(total * 100) / 100,
    status: 'Nieuw',
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  writeOrders(orders);

  res.status(201).json({ message: 'Bestelling geplaatst!', orderId: order.id });
});

app.get('/api/orders', (req, res) => {
  const orders = readOrders();
  res.json(orders.reverse());
});

app.put('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Nieuw', 'In behandeling', 'Bezorgd'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Ongeldige status.' });
  }

  const orders = readOrders();
  const order = orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Bestelling niet gevonden.' });
  }

  order.status = status;
  writeOrders(orders);

  res.json({ message: 'Status bijgewerkt.', order });
});

// ── Bakkerij statistieken ────────────────────────────────────────────────────

app.get('/api/stats', (req, res) => {
  const orders = readOrders();
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());

  const vandaag = orders.filter(o => new Date(o.createdAt) >= startOfToday);
  const dezeWeek = orders.filter(o => new Date(o.createdAt) >= startOfWeek);

  const perStatus = { Nieuw: 0, 'In behandeling': 0, Bezorgd: 0 };
  orders.forEach(o => {
    if (perStatus[o.status] !== undefined) perStatus[o.status]++;
  });

  res.json({
    vandaag: {
      aantalBestellingen: vandaag.length,
      omzet: Math.round(vandaag.reduce((s, o) => s + o.total, 0) * 100) / 100,
    },
    dezeWeek: {
      aantalBestellingen: dezeWeek.length,
      omzet: Math.round(dezeWeek.reduce((s, o) => s + o.total, 0) * 100) / 100,
    },
    perStatus,
  });
});

// ── Bakkerij CRUD ────────────────────────────────────────────────────────────

app.get('/api/bakeries', (req, res) => {
  res.json(readBakeries());
});

app.post('/api/bakeries', (req, res) => {
  const { name, contactName, email, phone, address, billing } = req.body;
  if (!name) return res.status(400).json({ error: 'Naam is verplicht.' });

  const bakeries = readBakeries();
  const bakery = {
    id: Date.now().toString(),
    name,
    contactName: contactName || '',
    email: email || '',
    phone: phone || '',
    address: address || '',
    active: true,
    billing: {
      plan: billing?.plan || 'maandelijks',
      monthlyFee: Math.round(Number(billing?.monthlyFee || 29.95) * 100) / 100,
      perOrderFee: Math.round(Number(billing?.perOrderFee || 0.10) * 100) / 100,
      startDate: billing?.startDate || new Date().toISOString().slice(0, 10),
    },
    createdAt: new Date().toISOString(),
  };
  bakeries.push(bakery);
  writeBakeries(bakeries);
  res.status(201).json(bakery);
});

app.put('/api/bakeries/:id', (req, res) => {
  const { id } = req.params;
  const bakeries = readBakeries();
  const bakery = bakeries.find(b => b.id === id);
  if (!bakery) return res.status(404).json({ error: 'Bakkerij niet gevonden.' });

  const { name, contactName, email, phone, address, active, billing } = req.body;
  if (name !== undefined) bakery.name = name;
  if (contactName !== undefined) bakery.contactName = contactName;
  if (email !== undefined) bakery.email = email;
  if (phone !== undefined) bakery.phone = phone;
  if (address !== undefined) bakery.address = address;
  if (active !== undefined) bakery.active = active;
  if (billing) {
    if (billing.plan !== undefined) bakery.billing.plan = billing.plan;
    if (billing.monthlyFee !== undefined) bakery.billing.monthlyFee = Math.round(Number(billing.monthlyFee) * 100) / 100;
    if (billing.perOrderFee !== undefined) bakery.billing.perOrderFee = Math.round(Number(billing.perOrderFee) * 100) / 100;
    if (billing.startDate !== undefined) bakery.billing.startDate = billing.startDate;
  }
  writeBakeries(bakeries);
  res.json(bakery);
});

app.delete('/api/bakeries/:id', (req, res) => {
  const { id } = req.params;
  const bakeries = readBakeries();
  const index = bakeries.findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ error: 'Bakkerij niet gevonden.' });
  bakeries.splice(index, 1);
  writeBakeries(bakeries);
  res.json({ message: 'Bakkerij verwijderd.' });
});

// ── Platform statistieken ────────────────────────────────────────────────────

app.get('/api/platform/stats', (req, res) => {
  const bakeries = readBakeries();
  const orders = readOrders();
  const invoices = readInvoices();

  const perBakkerij = bakeries.map(b => {
    const bOrders = orders.filter(o => (o.bakeryId || 'default') === b.id);
    const bInvoices = invoices.filter(i => i.bakeryId === b.id);
    return {
      id: b.id,
      naam: b.name,
      actief: b.active,
      aantalBestellingen: bOrders.length,
      omzet: Math.round(bOrders.reduce((s, o) => s + o.total, 0) * 100) / 100,
      factuurOmzet: Math.round(
        bInvoices.filter(i => i.status === 'Betaald').reduce((s, i) => s + i.total, 0) * 100
      ) / 100,
    };
  });

  res.json({
    totaleBakkerijen: bakeries.length,
    actieveBakkerijen: bakeries.filter(b => b.active).length,
    totaleBestellingen: orders.length,
    platformOmzet: Math.round(
      invoices.filter(i => i.status === 'Betaald').reduce((s, i) => s + i.total, 0) * 100
    ) / 100,
    perBakkerij,
  });
});

// ── Facturen ─────────────────────────────────────────────────────────────────

app.get('/api/invoices', (req, res) => {
  const invoices = readInvoices();
  const { bakeryId } = req.query;
  if (bakeryId) {
    return res.json(invoices.filter(i => i.bakeryId === bakeryId).reverse());
  }
  res.json([...invoices].reverse());
});

app.post('/api/invoices/generate', (req, res) => {
  const { bakeryId, periodFrom, periodTo } = req.body;
  if (!bakeryId || !periodFrom || !periodTo) {
    return res.status(400).json({ error: 'bakeryId, periodFrom en periodTo zijn verplicht.' });
  }

  const bakeries = readBakeries();
  const bakery = bakeries.find(b => b.id === bakeryId);
  if (!bakery) return res.status(404).json({ error: 'Bakkerij niet gevonden.' });

  const orders = readOrders();
  const from = new Date(periodFrom);
  const to = new Date(periodTo);
  to.setHours(23, 59, 59, 999);

  const periodOrders = orders.filter(o => {
    const created = new Date(o.createdAt);
    return (o.bakeryId || 'default') === bakeryId && created >= from && created <= to && o.status === 'Bezorgd';
  });

  const { monthlyFee, perOrderFee } = bakery.billing;
  const lines = [];

  const fromDate = new Date(periodFrom);
  const monthName = fromDate.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });
  lines.push({ description: `Maandabonnement ${monthName}`, amount: monthlyFee });

  if (perOrderFee > 0 && periodOrders.length > 0) {
    lines.push({
      description: `${periodOrders.length} bestellingen × €${perOrderFee.toFixed(2).replace('.', ',')}`,
      amount: Math.round(periodOrders.length * perOrderFee * 100) / 100,
    });
  }

  const subtotal = Math.round(lines.reduce((s, l) => s + l.amount, 0) * 100) / 100;
  const btw = Math.round(subtotal * 0.21 * 100) / 100;
  const total = Math.round((subtotal + btw) * 100) / 100;

  const invoice = {
    id: 'INV-' + Date.now(),
    bakeryId,
    bakeryName: bakery.name,
    period: { from: periodFrom, to: periodTo },
    lines,
    subtotal,
    btw,
    total,
    status: 'Concept',
    createdAt: new Date().toISOString(),
    paidAt: null,
  };

  const invoices = readInvoices();
  invoices.push(invoice);
  writeInvoices(invoices);

  res.status(201).json(invoice);
});

app.put('/api/invoices/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Concept', 'Verstuurd', 'Betaald'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Ongeldige facturstatus.' });
  }

  const invoices = readInvoices();
  const invoice = invoices.find(i => i.id === id);
  if (!invoice) return res.status(404).json({ error: 'Factuur niet gevonden.' });

  invoice.status = status;
  if (status === 'Betaald') invoice.paidAt = new Date().toISOString();
  writeInvoices(invoices);

  res.json({ message: 'Facturstatus bijgewerkt.', invoice });
});

// ── Instellingen ─────────────────────────────────────────────────────────────

app.get('/api/settings', (req, res) => {
  res.json(readSettings());
});

app.put('/api/settings', (req, res) => {
  const current = readSettings();
  const { shopName, tagline, logo, primaryColor, secondaryColor, accentColor, language } = req.body;
  if (shopName !== undefined) current.shopName = shopName;
  if (tagline !== undefined) current.tagline = tagline;
  if (logo !== undefined) current.logo = logo;
  if (primaryColor !== undefined) current.primaryColor = primaryColor;
  if (secondaryColor !== undefined) current.secondaryColor = secondaryColor;
  if (accentColor !== undefined) current.accentColor = accentColor;
  if (language !== undefined) current.language = language;
  writeSettings(current);
  res.json(current);
});

app.listen(PORT, () => {
  console.log(`Bakkerij server draait op http://localhost:${PORT}`);
  console.log(`Admin paneel: http://localhost:${PORT}/admin.html`);
  console.log(`Platform beheer: http://localhost:${PORT}/platform.html`);
});
