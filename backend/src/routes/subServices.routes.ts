import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { SubServices, SubServicesDoc } from "../models/subServices.models";
import { subServiceCreateSchema } from "../schemas/subservices.schema";
import { AdvancedGenericController } from "../controllers/GenericController";

const subServiceRouter = Router();

const subServicesServices = new GenericService<SubServicesDoc>(SubServices);

const subServicesController = new AdvancedGenericController({
    service: subServicesServices,
    populate: ["userId", "masterServiceId"],
    validationSchema: subServiceCreateSchema,
});

subServiceRouter.get("/", subServicesController.getAll);
subServiceRouter.get("/:id", subServicesController.getById);
subServiceRouter.post("/", subServicesController.create);
subServiceRouter.put("/:id", subServicesController.update);
subServiceRouter.delete("/:id", subServicesController.delete);

export default subServiceRouter;
