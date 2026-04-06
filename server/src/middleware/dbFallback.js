// Middleware to handle DB connection failures gracefully.
// When Mikro ERP DB is unavailable, returns demo data so the UI is still usable.

const demoWarehouses = [
  { warehouseId: 1, warehouseName: 'Ana Depo', address: 'Merkez' },
  { warehouseId: 2, warehouseName: 'Hammadde Deposu', address: 'Üretim Alanı' },
  { warehouseId: 3, warehouseName: 'Mamul Deposu', address: 'Sevkiyat Alanı' },
  { warehouseId: 4, warehouseName: 'Yarı Mamul Deposu', address: 'Üretim Hattı' },
];

const demoStockItems = [
  { stockCode: 'HM-001', stockName: 'Çelik Sac 2mm', unit: 'KG', mainGroup: 'HAMMADDE', subGroup: 'METAL' },
  { stockCode: 'HM-002', stockName: 'Alüminyum Profil', unit: 'MT', mainGroup: 'HAMMADDE', subGroup: 'METAL' },
  { stockCode: 'HM-003', stockName: 'Boya - RAL 7035', unit: 'LT', mainGroup: 'HAMMADDE', subGroup: 'BOYA' },
  { stockCode: 'HM-004', stockName: 'Vida M6x20', unit: 'AD', mainGroup: 'HAMMADDE', subGroup: 'BAGLANTI' },
  { stockCode: 'HM-005', stockName: 'Conta 50mm', unit: 'AD', mainGroup: 'HAMMADDE', subGroup: 'KAUCUK' },
  { stockCode: 'YM-001', stockName: 'Şase Alt Parça', unit: 'AD', mainGroup: 'YARI_MAMUL', subGroup: 'SASE' },
  { stockCode: 'YM-002', stockName: 'Kapak Montaj Seti', unit: 'AD', mainGroup: 'YARI_MAMUL', subGroup: 'MONTAJ' },
  { stockCode: 'MM-001', stockName: 'Kontrol Panosu Tip A', unit: 'AD', mainGroup: 'MAMUL', subGroup: 'PANO' },
  { stockCode: 'MM-002', stockName: 'Kontrol Panosu Tip B', unit: 'AD', mainGroup: 'MAMUL', subGroup: 'PANO' },
  { stockCode: 'MM-003', stockName: 'Dağıtım Kutusu 24M', unit: 'AD', mainGroup: 'MAMUL', subGroup: 'KUTU' },
];

function generateDemoStock() {
  const result = [];
  for (const item of demoStockItems) {
    for (const wh of demoWarehouses) {
      const currentStock = Math.floor(Math.random() * 500) + 10;
      result.push({
        ...item,
        warehouseId: wh.warehouseId,
        warehouseName: wh.warehouseName,
        currentStock,
      });
    }
  }
  return result;
}

const demoOperations = [
  { operationId: 'OP-2024-001', operationName: 'Sac Kesim', productCode: 'YM-001', productName: 'Şase Alt Parça', plannedQty: 200, completedQty: 150, startDate: '2024-03-01', endDate: '2024-03-15', status: 'Devam Ediyor', workCenter: 'CNC-01' },
  { operationId: 'OP-2024-002', operationName: 'Bükme', productCode: 'YM-001', productName: 'Şase Alt Parça', plannedQty: 200, completedQty: 120, startDate: '2024-03-05', endDate: '2024-03-20', status: 'Devam Ediyor', workCenter: 'PRESS-01' },
  { operationId: 'OP-2024-003', operationName: 'Kaynak', productCode: 'YM-001', productName: 'Şase Alt Parça', plannedQty: 200, completedQty: 80, startDate: '2024-03-10', endDate: '2024-03-25', status: 'Devam Ediyor', workCenter: 'KAYNAK-01' },
  { operationId: 'OP-2024-004', operationName: 'Boyama', productCode: 'YM-001', productName: 'Şase Alt Parça', plannedQty: 200, completedQty: 50, startDate: '2024-03-15', endDate: '2024-03-30', status: 'Planlandı', workCenter: 'BOYA-01' },
  { operationId: 'OP-2024-005', operationName: 'Montaj', productCode: 'MM-001', productName: 'Kontrol Panosu Tip A', plannedQty: 100, completedQty: 100, startDate: '2024-02-20', endDate: '2024-03-10', status: 'Tamamlandı', workCenter: 'MONTAJ-01' },
  { operationId: 'OP-2024-006', operationName: 'Test', productCode: 'MM-001', productName: 'Kontrol Panosu Tip A', plannedQty: 100, completedQty: 95, startDate: '2024-03-01', endDate: '2024-03-12', status: 'Devam Ediyor', workCenter: 'TEST-01' },
  { operationId: 'OP-2024-007', operationName: 'Sac Kesim', productCode: 'MM-002', productName: 'Kontrol Panosu Tip B', plannedQty: 50, completedQty: 0, startDate: '2024-03-20', endDate: '2024-04-05', status: 'Planlandı', workCenter: 'CNC-01' },
  { operationId: 'OP-2024-008', operationName: 'Paketleme', productCode: 'MM-003', productName: 'Dağıtım Kutusu 24M', plannedQty: 300, completedQty: 300, startDate: '2024-02-15', endDate: '2024-03-01', status: 'Tamamlandı', workCenter: 'PAKET-01' },
];

const demoWorkOrders = [
  { workOrderId: 1, workOrderNo: 'IE-2024-001', productCode: 'MM-001', productName: 'Kontrol Panosu Tip A', plannedQty: 100, completedQty: 95, startDate: '2024-02-20', dueDate: '2024-03-15', status: 'Devam Ediyor' },
  { workOrderId: 2, workOrderNo: 'IE-2024-002', productCode: 'MM-002', productName: 'Kontrol Panosu Tip B', plannedQty: 50, completedQty: 0, startDate: '2024-03-20', dueDate: '2024-04-10', status: 'Planlandı' },
  { workOrderId: 3, workOrderNo: 'IE-2024-003', productCode: 'MM-003', productName: 'Dağıtım Kutusu 24M', plannedQty: 300, completedQty: 300, startDate: '2024-02-15', dueDate: '2024-03-05', status: 'Tamamlandı' },
  { workOrderId: 4, workOrderNo: 'IE-2024-004', productCode: 'YM-001', productName: 'Şase Alt Parça', plannedQty: 200, completedQty: 50, startDate: '2024-03-01', dueDate: '2024-03-30', status: 'Devam Ediyor' },
];

module.exports = {
  demoWarehouses,
  demoStockItems,
  generateDemoStock,
  demoOperations,
  demoWorkOrders,
};
