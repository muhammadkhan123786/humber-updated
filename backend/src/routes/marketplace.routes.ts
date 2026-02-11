// routes/marketplace.routes.ts
import { Router } from "express";
import { MarketplaceController } from "../controllers/marketplaceConnection.controller";

const router = Router();
const controller = new MarketplaceController();

router.post("/", controller.create);
router.get("/", controller.getAll);

// router.get("/:id", controller.getById);
// router.post("/:id/connect", controller.connect);

export default router;