import express from "express";
import {
  getSupplierHistoryReport,
  getSupplierPerformanceReport,
  getSupplierPriceHistoryReport
} from "../../controllers/reports/supplierReport.controller";

const router = express.Router();

router.get("/history", getSupplierHistoryReport);
router.get("/performance", getSupplierPerformanceReport);
router.get("/price-history", getSupplierPriceHistoryReport);

export default router;