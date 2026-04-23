import { Router } from "express";
import {
  getStockSummaryReport,
  getLowStockReport,
  getInventoryValuationReport,
  getStockMovementReport
} from "../../controllers/reports/inventoryReports.controller";

const router = Router();

router.get("/stock-summary", getStockSummaryReport);
router.get("/low-stock", getLowStockReport);
router.get("/valuation", getInventoryValuationReport);
router.get("/movement", getStockMovementReport);

export default router;