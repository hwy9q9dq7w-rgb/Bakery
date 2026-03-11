const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const ORDERS_FILE = path.join(__dirname, 'orders.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const menu = [
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

app.get('/api/menu', (req, res) => {
  res.json(menu);
});

app.post('/api/orders', (req, res) => {
  const { name, phone, address, deliveryTime, items } = req.body;

  if (!name || !phone || !address || !items || items.length === 0) {
    return res.status(400).json({ error: 'Vul alle verplichte velden in.' });
  }

  const orders = readOrders();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = {
    id: Date.now().toString(),
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

app.listen(PORT, () => {
  console.log(`Bakkerij server draait op http://localhost:${PORT}`);
  console.log(`Admin paneel: http://localhost:${PORT}/admin.html`);
});
