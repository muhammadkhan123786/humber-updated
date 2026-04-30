import {
  getCostAnalysisReport,
  getProfitLossReport,
  getBudgetVsActualReport
} from "../../controllers/reports/financialReports.controller";
import express from "express";

const router = express.Router();

router.get("/cost-analysis", getCostAnalysisReport);
router.get("/profit-loss", getProfitLossReport);
router.get("/budget-vs-actual", getBudgetVsActualReport);

export default router;
