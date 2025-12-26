import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { customerSourceDoc, CustomerSourceModel } from "../models/customer.source.models";
import { customerSourceModelCreateSchema } from "../schemas/customer.source.schema";
import { AdvancedGenericController } from "../controllers/GenericController";

const customerSourceRouter = Router();

const customerSourceServices = new GenericService<customerSourceDoc>(CustomerSourceModel);

const customerSourceController = new AdvancedGenericController({
    service: customerSourceServices,
    populate: "userId",
    validationSchema: customerSourceModelCreateSchema,
});

customerSourceRouter.get("/", customerSourceController.getAll);
customerSourceRouter.get("/:id", customerSourceController.getById);
customerSourceRouter.post("/", customerSourceController.create);
customerSourceRouter.put("/:id", customerSourceController.update);
customerSourceRouter.delete("/:id", customerSourceController.delete);

export default customerSourceRouter;
