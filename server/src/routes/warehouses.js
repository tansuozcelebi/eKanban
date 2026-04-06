const express = require('express');
const router = express.Router();
const { getPool } = require('../config/database');
const queries = require('../config/mikroQueries');
const { demoWarehouses } = require('../middleware/dbFallback');

// GET /api/warehouses - Get all warehouses
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(queries.warehouses);
    res.json(result.recordset);
  } catch (err) {
    console.warn('DB unavailable, returning demo data:', err.message);
    res.json(demoWarehouses);
  }
});

module.exports = router;
