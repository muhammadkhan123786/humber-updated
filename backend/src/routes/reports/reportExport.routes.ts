import { Router } from "express";
import { exportReportController } from "../../controllers/reports/reportExport.controller";

const router = Router();

router.post("/export", exportReportController);

export default router;