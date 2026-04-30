import {
  getDashboardQuickStats,
  getDashboardCharts
} from "../../controllers/reports/reportsDashboard.controller";
import express from "express";

const router = express.Router();

router.get("/quick-stats", getDashboardQuickStats);
router.get("/charts", getDashboardCharts);

export default router;