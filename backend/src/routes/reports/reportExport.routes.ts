import { Router } from "express";
import { exportReportController } from "../../controllers/reports/reportExport.controller";

const router = Router();

router.get("/export", exportReportController);

export default router;