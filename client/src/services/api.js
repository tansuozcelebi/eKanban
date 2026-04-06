const API_BASE = process.env.REACT_APP_API_URL || '/api';

async function fetchJson(url) {
  const res = await fetch(`${API_BASE}${url}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function postJson(url, data) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function putJson(url, data) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function deleteJson(url) {
  const res = await fetch(`${API_BASE}${url}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  // Stock
  getStock: () => fetchJson('/stock'),
  getStockSummary: () => fetchJson('/stock/summary'),
  getStockByWarehouse: (id) => fetchJson(`/stock/warehouse/${id}`),
  searchStock: (q) => fetchJson(`/stock/search?q=${encodeURIComponent(q)}`),

  // Warehouses
  getWarehouses: () => fetchJson('/warehouses'),

  // Operations
  getOperations: () => fetchJson('/operations'),
  getWorkOrders: () => fetchJson('/operations/work-orders'),

  // Kanban
  getKanbanCards: () => fetchJson('/kanban'),
  getKanbanAlerts: () => fetchJson('/kanban/alerts'),
  getKanbanStats: () => fetchJson('/kanban/stats'),
  createKanbanCard: (data) => postJson('/kanban', data),
  updateKanbanCard: (id, data) => putJson(`/kanban/${id}`, data),
  deleteKanbanCard: (id) => deleteJson(`/kanban/${id}`),
};
