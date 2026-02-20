import { NextFunction, Request, Router, Response } from "express";
import { GenericService } from "../services/generic.crud.services";
import { AdvancedGenericController } from "../controllers/GenericController";
import { PurchaseDoc, PurchaseOrder } from "../models/purchaseOrder.model";
import { purchaseOrderZodSchema } from "../schemas/purchaseOrder.schema";
import { purchaseOrderCustomController } from "../controllers/purchaseOrder.controller";
import { generatePurchaseOrderCode } from "../utils/generate.AutoCode.Counter";

const purchaseOrderRoutes = Router();

// Generic CRUD service and controller
const purchaseOrderBaseService = new GenericService<PurchaseDoc>(PurchaseOrder);

const purchaseOrderController = new AdvancedGenericController({
  service: purchaseOrderBaseService,
  populate: [
    "userId",
    {
      path: "supplier",
      select: "contactInformation",
    },
    {
      path: "items.productId",
      select: "productName sku",
    },
  ],
  searchFields: ["orderNumber", "supplier", "supplierContact", "notes"],
  validationSchema: purchaseOrderZodSchema,
});

// ==========================================
// IMPORTANT: Specific routes MUST come BEFORE parameterized routes
// Otherwise /:id will catch routes like /next-order-number
// ==========================================

// Custom business logic routes (specific paths)
purchaseOrderRoutes.get(
  "/next-order-number",
  purchaseOrderCustomController.generateNextOrderNumber,
);
purchaseOrderRoutes.get(
  "/stats/dashboard",
  purchaseOrderCustomController.getStats,
);
purchaseOrderRoutes.get("/export", purchaseOrderCustomController.exportToPDF);
purchaseOrderRoutes.patch(
  "/bulk-update",
  purchaseOrderCustomController.bulkUpdate,
);
purchaseOrderRoutes.get("/", purchaseOrderCustomController.getAllWithSearch);

// Standard CRUD operations (generic controller)
// purchaseOrderRoutes.get("/", purchaseOrderController.getAll);
purchaseOrderRoutes.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const purchaseCode = await generatePurchaseOrderCode();
    req.body.orderNumber = purchaseCode;

    next();
  },
  purchaseOrderController.create,
);
purchaseOrderRoutes.get("/:id", purchaseOrderController.getById);
purchaseOrderRoutes.put("/:id", purchaseOrderController.update);
purchaseOrderRoutes.delete("/:id", purchaseOrderController.delete);

// Custom update operation (specific path with parameter)
purchaseOrderRoutes.patch(
  "/:id/status",
  purchaseOrderCustomController.updateStatus,
);

export default purchaseOrderRoutes;
