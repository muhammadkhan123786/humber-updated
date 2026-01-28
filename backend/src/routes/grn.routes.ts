import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { GrnDoc, GrnModel } from "../models/grn.models";
import { createGRNValidationsSchema } from "../schemas/grn.schema"; 
import { AdvancedGenericController } from "../controllers/GenericController";


const grnRoutes = Router();

const grnBaseService = new GenericService<GrnDoc>(GrnModel);

const grnController = new AdvancedGenericController({
    service: grnBaseService,
    populate: ["userId", {
    path: "purchaseOrderId",
    select: "orderNumber expectedDelivery supplier",
    populate: {
        path: "supplier",
        select: "contactInformation"
    }
    
  }],
    validationSchema: createGRNValidationsSchema, 
});

grnRoutes.get("/", grnController.getAll);
grnRoutes.get("/:id", grnController.getById);
grnRoutes.post("/", grnController.create);
grnRoutes.put("/:id", grnController.update);
grnRoutes.delete("/:id", grnController.delete);

export default grnRoutes;