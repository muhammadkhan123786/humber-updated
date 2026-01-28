import { Router } from "express";
import { DocumentNumberController } from "../controllers/documentNumber.controller";

const router = Router();

router.get("/next", DocumentNumberController.getNext);

export default router;
