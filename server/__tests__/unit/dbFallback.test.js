const {
  demoWarehouses,
  demoStockItems,
  generateDemoStock,
  demoOperations,
  demoWorkOrders,
} = require('../../src/middleware/dbFallback');

describe('dbFallback demo data', () => {
  describe('demoWarehouses', () => {
    it('should have 4 warehouses', () => {
      expect(demoWarehouses).toHaveLength(4);
    });

    it('each warehouse should have required fields', () => {
      for (const wh of demoWarehouses) {
        expect(wh).toHaveProperty('warehouseId');
        expect(wh).toHaveProperty('warehouseName');
        expect(wh).toHaveProperty('address');
        expect(typeof wh.warehouseId).toBe('number');
      }
    });

    it('should have unique warehouse IDs', () => {
      const ids = demoWarehouses.map(w => w.warehouseId);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('demoStockItems', () => {
    it('should have 10 stock items', () => {
      expect(demoStockItems).toHaveLength(10);
    });

    it('each item should have required fields', () => {
      for (const item of demoStockItems) {
        expect(item).toHaveProperty('stockCode');
        expect(item).toHaveProperty('stockName');
        expect(item).toHaveProperty('unit');
        expect(item).toHaveProperty('mainGroup');
        expect(item).toHaveProperty('subGroup');
      }
    });

    it('should have unique stock codes', () => {
      const codes = demoStockItems.map(s => s.stockCode);
      expect(new Set(codes).size).toBe(codes.length);
    });
  });

  describe('generateDemoStock', () => {
    it('should generate stock for every item × warehouse combination', () => {
      const stock = generateDemoStock();
      expect(stock).toHaveLength(demoStockItems.length * demoWarehouses.length);
    });

    it('each generated record should include warehouse and stock info', () => {
      const stock = generateDemoStock();
      for (const entry of stock) {
        expect(entry).toHaveProperty('stockCode');
        expect(entry).toHaveProperty('stockName');
        expect(entry).toHaveProperty('warehouseId');
        expect(entry).toHaveProperty('warehouseName');
        expect(entry).toHaveProperty('currentStock');
        expect(entry.currentStock).toBeGreaterThanOrEqual(10);
        expect(entry.currentStock).toBeLessThan(510);
      }
    });

    it('should return different random values on each call', () => {
      const first = generateDemoStock();
      const second = generateDemoStock();
      const firstStocks = first.map(s => s.currentStock);
      const secondStocks = second.map(s => s.currentStock);
      expect(firstStocks).not.toEqual(secondStocks);
    });
  });

  describe('demoOperations', () => {
    it('should have 8 operations', () => {
      expect(demoOperations).toHaveLength(8);
    });

    it('each operation should have required fields', () => {
      for (const op of demoOperations) {
        expect(op).toHaveProperty('operationId');
        expect(op).toHaveProperty('operationName');
        expect(op).toHaveProperty('productCode');
        expect(op).toHaveProperty('plannedQty');
        expect(op).toHaveProperty('completedQty');
        expect(op).toHaveProperty('status');
        expect(['Devam Ediyor', 'Planlandı', 'Tamamlandı']).toContain(op.status);
      }
    });

    it('completedQty should not exceed plannedQty', () => {
      for (const op of demoOperations) {
        expect(op.completedQty).toBeLessThanOrEqual(op.plannedQty);
      }
    });
  });

  describe('demoWorkOrders', () => {
    it('should have 4 work orders', () => {
      expect(demoWorkOrders).toHaveLength(4);
    });

    it('each work order should have required fields', () => {
      for (const wo of demoWorkOrders) {
        expect(wo).toHaveProperty('workOrderId');
        expect(wo).toHaveProperty('workOrderNo');
        expect(wo).toHaveProperty('productCode');
        expect(wo).toHaveProperty('plannedQty');
        expect(wo).toHaveProperty('status');
      }
    });
  });
});
