import { Router } from "express";

import aiEmailController from '../controllers/aiTemplate.controller';
const router = Router();

router.post('/generate-email', aiEmailController.generateTemplate);

export default router;