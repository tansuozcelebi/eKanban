const request = require('supertest');
const app = require('../../src/app');

// These routes hit DB-dependent endpoints. Since no Mikro ERP SQL Server
// is available in the test environment, they exercise the fallback paths
// that return demo data when the DB connection fails.

describe('Stock Routes (DB fallback)', () => {
  describe('GET /api/stock', () => {
    it('should return stock data (demo fallback)', async () => {
      const res = await request(app).get('/api/stock');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('each stock entry should have stockCode and currentStock', async () => {
      const res = await request(app).get('/api/stock');
      for (const item of res.body) {
        expect(item).toHaveProperty('stockCode');
        expect(item).toHaveProperty('currentStock');
        expect(typeof item.currentStock).toBe('number');
      }
    });
  });

  describe('GET /api/stock/summary', () => {
    it('should return stock summary data', async () => {
      const res = await request(app).get('/api/stock/summary');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/stock/warehouse/:id', () => {
    it('should return stock for a specific warehouse', async () => {
      const res = await request(app).get('/api/stock/warehouse/1');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      for (const item of res.body) {
        expect(item.warehouseId).toBe(1);
      }
    });

    it('should return empty array for non-existent warehouse', async () => {
      const res = await request(app).get('/api/stock/warehouse/999');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });

  describe('GET /api/stock/search', () => {
    it('should search stock by keyword', async () => {
      const res = await request(app).get('/api/stock/search?q=Sac');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].stockName.toLowerCase()).toContain('sac');
    });

    it('should return empty array for unmatched search', async () => {
      const res = await request(app).get('/api/stock/search?q=nonexistent12345');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });

    it('should handle empty query', async () => {
      const res = await request(app).get('/api/stock/search?q=');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});

describe('Warehouse Routes (DB fallback)', () => {
  describe('GET /api/warehouses', () => {
    it('should return warehouses', async () => {
      const res = await request(app).get('/api/warehouses');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(4);
    });

    it('each warehouse should have id and name', async () => {
      const res = await request(app).get('/api/warehouses');
      for (const wh of res.body) {
        expect(wh).toHaveProperty('warehouseId');
        expect(wh).toHaveProperty('warehouseName');
      }
    });
  });
});

describe('Operations Routes (DB fallback)', () => {
  describe('GET /api/operations', () => {
    it('should return operations', async () => {
      const res = await request(app).get('/api/operations');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(8);
    });

    it('each operation should have required fields', async () => {
      const res = await request(app).get('/api/operations');
      for (const op of res.body) {
        expect(op).toHaveProperty('operationId');
        expect(op).toHaveProperty('operationName');
        expect(op).toHaveProperty('status');
      }
    });
  });

  describe('GET /api/operations/work-orders', () => {
    it('should return work orders', async () => {
      const res = await request(app).get('/api/operations/work-orders');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(4);
    });
  });
});
