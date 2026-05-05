// Add to your existing report routes

import {
  getDeliverySummaryReport,
  getCallLogSummaryReport,
  getCustomerOverviewReport,
  getTechnicianSummaryReport,
  getServiceRequestsSummaryReport,
  getSalesSummaryReport,
} from "../../controllers/reports/mockReports.controller";

import express from "express";

const router = express.Router();

router.get("/delivery/delivery-summary", getDeliverySummaryReport);
router.get("/call-log/call-log-summary", getCallLogSummaryReport);
router.get("/customer/customer-overview", getCustomerOverviewReport);
router.get("/technician/technician-summary", getTechnicianSummaryReport);
router.get("/service/service-requests-summary", getServiceRequestsSummaryReport);
router.get("/sales/sales-summary", getSalesSummaryReport);

export default router;