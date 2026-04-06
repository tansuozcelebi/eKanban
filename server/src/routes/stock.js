const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../config/database');
const queries = require('../config/mikroQueries');
const { generateDemoStock, demoStockItems } = require('../middleware/dbFallback');

// GET /api/stock - Get all stock levels across warehouses
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(queries.stockLevels);
    res.json(result.recordset);
  } catch (err) {
    console.warn('DB unavailable, returning demo data:', err.message);
    res.json(generateDemoStock());
  }
});

// GET /api/stock/summary - Stock summary for kanban overview
router.get('/summary', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(queries.stockSummary);
    res.json(result.recordset);
  } catch (err) {
    console.warn('DB unavailable, returning demo data:', err.message);
    res.json(generateDemoStock());
  }
});

// GET /api/stock/warehouse/:id - Stock levels for a specific warehouse
router.get('/warehouse/:id', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('warehouseId', sql.Int, parseInt(req.params.id))
      .query(queries.stockByWarehouse);
    res.json(result.recordset);
  } catch (err) {
    console.warn('DB unavailable, returning demo data:', err.message);
    const warehouseId = parseInt(req.params.id);
    const filtered = generateDemoStock().filter((s) => s.warehouseId === warehouseId);
    res.json(filtered);
  }
});

// GET /api/stock/search?q=keyword - Search stock items
router.get('/search', async (req, res) => {
  const q = req.query.q || '';
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('search', sql.NVarChar, `%${q}%`)
      .query(`
        SELECT sto_kod AS stockCode, sto_isim AS stockName, sto_birim1_ad AS unit,
               sto_anagrup_kod AS mainGroup, sto_altgrup_kod AS subGroup
        FROM STOKLAR
        WHERE sto_kod LIKE @search OR sto_isim LIKE @search
        ORDER BY sto_kod
      `);
    res.json(result.recordset);
  } catch (err) {
    console.warn('DB unavailable, returning demo data:', err.message);
    const filtered = demoStockItems.filter(
      (s) =>
        s.stockCode.toLowerCase().includes(q.toLowerCase()) ||
        s.stockName.toLowerCase().includes(q.toLowerCase())
    );
    res.json(filtered);
  }
});

module.exports = router;
