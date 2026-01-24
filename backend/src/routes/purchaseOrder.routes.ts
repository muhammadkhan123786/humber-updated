import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { AdvancedGenericController } from "../controllers/GenericController";
import {
  PurchaseDoc,
  PurchaseOrder,
} from "../models/purchaseOrder.model";


import { purchaseOrderZodSchema } from "../schemas/purchaseOrder.schema";

const purchaseOrderRoutes = Router();

const purchaseOrderBaseService = new GenericService<PurchaseDoc>(PurchaseOrder);

// If your controller expects Zod schema, use purchaseOrderZodSchema
// If it expects Mongoose schema definition, use purchaseOrderSchemaDefinition
const purchaseOrderController = new AdvancedGenericController({
  service: purchaseOrderBaseService,
  populate: ["userId"],
  searchFields: ["orderNumber", "supplierContact"],
  validationSchema: purchaseOrderZodSchema, // Use Zod schema for validation
});

// Add custom routes if needed
purchaseOrderRoutes.get("/status/:status", purchaseOrderController.getAll);
purchaseOrderRoutes.get("/", purchaseOrderController.getAll);
purchaseOrderRoutes.get("/:id", purchaseOrderController.getById);
purchaseOrderRoutes.post("/", purchaseOrderController.create);
purchaseOrderRoutes.put("/:id", purchaseOrderController.update);
purchaseOrderRoutes.delete("/:id", purchaseOrderController.delete);

export default purchaseOrderRoutes;