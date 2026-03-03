import { Router } from "express";
import { GenericService } from "../../../services/generic.crud.services";
import { customerSourceDoc, CustomerSourceModel } from "../../../models/customer.source.models";
import { AdvancedGenericController } from "../../../controllers/GenericController";
import { customerSourceModelCreateSchema } from "../../../schemas/customer.source.schema";


const mobilecustomerSourceRouter = Router();

const customerSourceServices = new GenericService<customerSourceDoc>(CustomerSourceModel);

const customerSourceController = new AdvancedGenericController({
    service: customerSourceServices,
    populate: ["userId"],
    validationSchema: customerSourceModelCreateSchema,
    searchFields: ["customerSource"]
});

mobilecustomerSourceRouter.get("/", customerSourceController.getAll);

// mobilecustomerSourceRouter.get("/:id", customerSourceController.getById);
// mobilecustomerSourceRouter.post("/", customerSourceController.create);
// mobilecustomerSourceRouter.put("/:id", customerSourceController.update);
// mobilecustomerSourceRouter.delete("/:id", customerSourceController.delete);

export default mobilecustomerSourceRouter;
