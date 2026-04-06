const express = require('express');
const router = express.Router();
const { getPool } = require('../config/database');
const queries = require('../config/mikroQueries');
const { demoOperations, demoWorkOrders } = require('../middleware/dbFallback');

// GET /api/operations - Get operation lists
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(queries.operationLists);
    res.json(result.recordset);
  } catch (err) {
    console.warn('DB unavailable, returning demo data:', err.message);
    res.json(demoOperations);
  }
});

// GET /api/operations/work-orders - Get work orders
router.get('/work-orders', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(queries.workOrders);
    res.json(result.recordset);
  } catch (err) {
    console.warn('DB unavailable, returning demo data:', err.message);
    res.json(demoWorkOrders);
  }
});

module.exports = router;
