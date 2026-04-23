import express from "express";
import {
  getPurchaseOrderReport,
  getGRNReport,
  getPurchaseSummaryReport
} from "../../controllers/reports/purchaseReport.controller";

const router = express.Router();

// 🔹 Purchase Reports Routes
router.get("/purchase-orders",  getPurchaseOrderReport);
router.get("/goods-received",  getGRNReport);
router.get("/summary", getPurchaseSummaryReport);

export default router;