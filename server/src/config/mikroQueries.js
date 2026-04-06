// Mikro ERP SQL queries for stock, warehouse, and operation data.
// These queries target the standard Mikro ERP V16 table structure.

const queries = {
  // Get all warehouses defined in Mikro ERP
  warehouses: `
    SELECT
      dep_no AS warehouseId,
      dep_adi AS warehouseName,
      dep_adr1 AS address
    FROM DEPOLAR
    ORDER BY dep_no
  `,

  // Get current stock levels across all warehouses
  stockLevels: `
    SELECT
      s.sto_kod AS stockCode,
      s.sto_isim AS stockName,
      s.sto_birim1_ad AS unit,
      s.sto_anagrup_kod AS mainGroup,
      s.sto_altgrup_kod AS subGroup,
      ISNULL(sh.girenMiktar, 0) - ISNULL(sh.cikanMiktar, 0) AS currentStock,
      sh.depoNo AS warehouseId
    FROM STOKLAR s
    LEFT JOIN (
      SELECT
        sth_stok_kod,
        sth_cikis_depo_no AS depoNo,
        SUM(CASE WHEN sth_tip = 0 THEN sth_miktar ELSE 0 END) AS girenMiktar,
        SUM(CASE WHEN sth_tip = 1 THEN sth_miktar ELSE 0 END) AS cikanMiktar
      FROM STOK_HAREKETLERI
      GROUP BY sth_stok_kod, sth_cikis_depo_no
    ) sh ON s.sto_kod = sh.sth_stok_kod
    ORDER BY s.sto_kod
  `,

  // Get stock levels for a specific warehouse
  stockByWarehouse: `
    SELECT
      s.sto_kod AS stockCode,
      s.sto_isim AS stockName,
      s.sto_birim1_ad AS unit,
      ISNULL(sh.girenMiktar, 0) - ISNULL(sh.cikanMiktar, 0) AS currentStock
    FROM STOKLAR s
    LEFT JOIN (
      SELECT
        sth_stok_kod,
        SUM(CASE WHEN sth_tip = 0 THEN sth_miktar ELSE 0 END) AS girenMiktar,
        SUM(CASE WHEN sth_tip = 1 THEN sth_miktar ELSE 0 END) AS cikanMiktar
      FROM STOK_HAREKETLERI
      WHERE sth_cikis_depo_no = @warehouseId
      GROUP BY sth_stok_kod
    ) sh ON s.sto_kod = sh.sth_stok_kod
    ORDER BY s.sto_kod
  `,

  // Get operation lists (iş emirleri / üretim operasyonları)
  operationLists: `
    SELECT
      op.msg_S_0088 AS operationId,
      op.msg_S_0089 AS operationName,
      op.msg_S_0090 AS productCode,
      s.sto_isim AS productName,
      op.msg_S_0091 AS plannedQty,
      op.msg_S_0092 AS completedQty,
      op.msg_S_0093 AS startDate,
      op.msg_S_0094 AS endDate,
      op.msg_S_0095 AS status,
      op.msg_S_0096 AS workCenter
    FROM URETIM_OPERASYONLARI op
    LEFT JOIN STOKLAR s ON op.msg_S_0090 = s.sto_kod
    ORDER BY op.msg_S_0093 DESC
  `,

  // Get work orders
  workOrders: `
    SELECT
      ie.msg_S_0001 AS workOrderId,
      ie.msg_S_0002 AS workOrderNo,
      ie.msg_S_0003 AS productCode,
      s.sto_isim AS productName,
      ie.msg_S_0004 AS plannedQty,
      ie.msg_S_0005 AS completedQty,
      ie.msg_S_0006 AS startDate,
      ie.msg_S_0007 AS dueDate,
      ie.msg_S_0008 AS status
    FROM URETIM_IS_EMIRLERI ie
    LEFT JOIN STOKLAR s ON ie.msg_S_0003 = s.sto_kod
    ORDER BY ie.msg_S_0006 DESC
  `,

  // Stock summary across all warehouses (for kanban overview)
  stockSummary: `
    SELECT
      s.sto_kod AS stockCode,
      s.sto_isim AS stockName,
      s.sto_birim1_ad AS unit,
      d.dep_no AS warehouseId,
      d.dep_adi AS warehouseName,
      ISNULL(sh.girenMiktar, 0) - ISNULL(sh.cikanMiktar, 0) AS currentStock
    FROM STOKLAR s
    CROSS JOIN DEPOLAR d
    LEFT JOIN (
      SELECT
        sth_stok_kod,
        sth_cikis_depo_no,
        SUM(CASE WHEN sth_tip = 0 THEN sth_miktar ELSE 0 END) AS girenMiktar,
        SUM(CASE WHEN sth_tip = 1 THEN sth_miktar ELSE 0 END) AS cikanMiktar
      FROM STOK_HAREKETLERI
      GROUP BY sth_stok_kod, sth_cikis_depo_no
    ) sh ON s.sto_kod = sh.sth_stok_kod AND d.dep_no = sh.sth_cikis_depo_no
    ORDER BY s.sto_kod, d.dep_no
  `,
};

module.exports = queries;
