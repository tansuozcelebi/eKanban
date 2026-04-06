const express = require('express');
const router = express.Router();

// In-memory kanban card storage (in production, use a persistent store)
let kanbanCards = [
  { id: 1, stockCode: 'HM-001', stockName: 'Çelik Sac 2mm', warehouseId: 2, warehouseName: 'Hammadde Deposu', minLevel: 100, maxLevel: 500, reorderPoint: 150, currentStock: 120, unit: 'KG', status: 'warning', lastUpdated: new Date().toISOString() },
  { id: 2, stockCode: 'HM-002', stockName: 'Alüminyum Profil', warehouseId: 2, warehouseName: 'Hammadde Deposu', minLevel: 50, maxLevel: 200, reorderPoint: 75, currentStock: 30, unit: 'MT', status: 'critical', lastUpdated: new Date().toISOString() },
  { id: 3, stockCode: 'HM-003', stockName: 'Boya - RAL 7035', warehouseId: 2, warehouseName: 'Hammadde Deposu', minLevel: 20, maxLevel: 100, reorderPoint: 30, currentStock: 85, unit: 'LT', status: 'ok', lastUpdated: new Date().toISOString() },
  { id: 4, stockCode: 'HM-004', stockName: 'Vida M6x20', warehouseId: 1, warehouseName: 'Ana Depo', minLevel: 1000, maxLevel: 5000, reorderPoint: 1500, currentStock: 4200, unit: 'AD', status: 'ok', lastUpdated: new Date().toISOString() },
  { id: 5, stockCode: 'YM-001', stockName: 'Şase Alt Parça', warehouseId: 4, warehouseName: 'Yarı Mamul Deposu', minLevel: 20, maxLevel: 100, reorderPoint: 30, currentStock: 15, unit: 'AD', status: 'critical', lastUpdated: new Date().toISOString() },
  { id: 6, stockCode: 'MM-001', stockName: 'Kontrol Panosu Tip A', warehouseId: 3, warehouseName: 'Mamul Deposu', minLevel: 10, maxLevel: 50, reorderPoint: 15, currentStock: 42, unit: 'AD', status: 'ok', lastUpdated: new Date().toISOString() },
  { id: 7, stockCode: 'HM-005', stockName: 'Conta 50mm', warehouseId: 1, warehouseName: 'Ana Depo', minLevel: 200, maxLevel: 1000, reorderPoint: 300, currentStock: 250, unit: 'AD', status: 'warning', lastUpdated: new Date().toISOString() },
  { id: 8, stockCode: 'MM-002', stockName: 'Kontrol Panosu Tip B', warehouseId: 3, warehouseName: 'Mamul Deposu', minLevel: 5, maxLevel: 30, reorderPoint: 10, currentStock: 8, unit: 'AD', status: 'warning', lastUpdated: new Date().toISOString() },
];

function calculateStatus(currentStock, minLevel, reorderPoint) {
  if (currentStock <= minLevel) return 'critical';
  if (currentStock <= reorderPoint) return 'warning';
  return 'ok';
}

// GET /api/kanban - Get all kanban cards
router.get('/', (req, res) => {
  res.json(kanbanCards);
});

// GET /api/kanban/alerts - Get cards that need attention
router.get('/alerts', (req, res) => {
  const alerts = kanbanCards.filter((c) => c.status !== 'ok');
  res.json(alerts);
});

// GET /api/kanban/stats - Dashboard statistics
router.get('/stats', (req, res) => {
  const total = kanbanCards.length;
  const critical = kanbanCards.filter((c) => c.status === 'critical').length;
  const warning = kanbanCards.filter((c) => c.status === 'warning').length;
  const ok = kanbanCards.filter((c) => c.status === 'ok').length;
  res.json({ total, critical, warning, ok });
});

// POST /api/kanban - Create a new kanban card
router.post('/', (req, res) => {
  const { stockCode, stockName, warehouseId, warehouseName, minLevel, maxLevel, reorderPoint, currentStock, unit } = req.body;
  const id = kanbanCards.length > 0 ? Math.max(...kanbanCards.map((c) => c.id)) + 1 : 1;
  const status = calculateStatus(currentStock, minLevel, reorderPoint);
  const card = {
    id, stockCode, stockName, warehouseId, warehouseName,
    minLevel, maxLevel, reorderPoint, currentStock, unit,
    status, lastUpdated: new Date().toISOString(),
  };
  kanbanCards.push(card);
  res.status(201).json(card);
});

// PUT /api/kanban/:id - Update a kanban card
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = kanbanCards.findIndex((c) => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Kanban card not found' });

  const updated = { ...kanbanCards[index], ...req.body, lastUpdated: new Date().toISOString() };
  updated.status = calculateStatus(updated.currentStock, updated.minLevel, updated.reorderPoint);
  kanbanCards[index] = updated;
  res.json(updated);
});

// DELETE /api/kanban/:id - Delete a kanban card
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = kanbanCards.findIndex((c) => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Kanban card not found' });
  kanbanCards.splice(index, 1);
  res.json({ message: 'Deleted' });
});

module.exports = router;
