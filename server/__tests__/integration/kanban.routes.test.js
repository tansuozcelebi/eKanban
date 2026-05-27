const request = require('supertest');
const app = require('../../src/app');

describe('Kanban Routes', () => {
  describe('GET /api/kanban', () => {
    it('should return all kanban cards', async () => {
      const res = await request(app).get('/api/kanban');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('each card should have required fields', async () => {
      const res = await request(app).get('/api/kanban');
      for (const card of res.body) {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('stockCode');
        expect(card).toHaveProperty('stockName');
        expect(card).toHaveProperty('warehouseId');
        expect(card).toHaveProperty('minLevel');
        expect(card).toHaveProperty('maxLevel');
        expect(card).toHaveProperty('reorderPoint');
        expect(card).toHaveProperty('currentStock');
        expect(card).toHaveProperty('status');
        expect(['critical', 'warning', 'ok']).toContain(card.status);
      }
    });
  });

  describe('GET /api/kanban/alerts', () => {
    it('should return only non-ok cards', async () => {
      const res = await request(app).get('/api/kanban/alerts');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      for (const card of res.body) {
        expect(card.status).not.toBe('ok');
      }
    });
  });

  describe('GET /api/kanban/stats', () => {
    it('should return count statistics', async () => {
      const res = await request(app).get('/api/kanban/stats');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('critical');
      expect(res.body).toHaveProperty('warning');
      expect(res.body).toHaveProperty('ok');
      expect(res.body.total).toBe(res.body.critical + res.body.warning + res.body.ok);
    });
  });

  describe('POST /api/kanban', () => {
    it('should create a new kanban card', async () => {
      const newCard = {
        stockCode: 'TEST-001',
        stockName: 'Test Item',
        warehouseId: 1,
        warehouseName: 'Ana Depo',
        minLevel: 10,
        maxLevel: 100,
        reorderPoint: 20,
        currentStock: 5,
        unit: 'AD',
      };
      const res = await request(app).post('/api/kanban').send(newCard);
      expect(res.status).toBe(201);
      expect(res.body.stockCode).toBe('TEST-001');
      expect(res.body.status).toBe('critical');
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('lastUpdated');
    });

    it('should auto-calculate status based on stock levels', async () => {
      const okCard = {
        stockCode: 'TEST-OK',
        stockName: 'OK Item',
        warehouseId: 1,
        warehouseName: 'Ana Depo',
        minLevel: 10,
        maxLevel: 100,
        reorderPoint: 20,
        currentStock: 50,
        unit: 'AD',
      };
      const res = await request(app).post('/api/kanban').send(okCard);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('PUT /api/kanban/:id', () => {
    it('should update an existing card', async () => {
      const res = await request(app)
        .put('/api/kanban/1')
        .send({ currentStock: 50 });
      expect(res.status).toBe(200);
      expect(res.body.currentStock).toBe(50);
      expect(res.body).toHaveProperty('lastUpdated');
    });

    it('should recalculate status after update', async () => {
      const res = await request(app)
        .put('/api/kanban/1')
        .send({ currentStock: 500 });
      expect(res.body.status).toBe('ok');
    });

    it('should return 404 for non-existent card', async () => {
      const res = await request(app)
        .put('/api/kanban/99999')
        .send({ currentStock: 50 });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/kanban/:id', () => {
    it('should delete a card', async () => {
      // First create a card to delete
      const created = await request(app).post('/api/kanban').send({
        stockCode: 'DEL-001',
        stockName: 'To Delete',
        warehouseId: 1,
        warehouseName: 'Ana Depo',
        minLevel: 10,
        maxLevel: 100,
        reorderPoint: 20,
        currentStock: 50,
        unit: 'AD',
      });
      const id = created.body.id;

      const res = await request(app).delete(`/api/kanban/${id}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Deleted');

      // Verify it's gone
      const all = await request(app).get('/api/kanban');
      expect(all.body.find(c => c.id === id)).toBeUndefined();
    });

    it('should return 404 for non-existent card', async () => {
      const res = await request(app).delete('/api/kanban/99999');
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body).toHaveProperty('timestamp');
    });
  });
});
