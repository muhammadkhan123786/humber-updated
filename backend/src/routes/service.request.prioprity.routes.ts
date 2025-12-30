import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { ServiceRequestPrioprityDoc, ServiceRequestPrioprityModel } from "../models/service.request.prioprity.models";
import { serviceRequestPrioprityCreateSchema } from "../schemas/service.request.prioprity.schema";
import { AdvancedGenericController } from "../controllers/GenericController";

const ServiceRequestPrioprityRouter = Router();

const ServiceRequestPrioprityRouterServices = new GenericService<ServiceRequestPrioprityDoc>(ServiceRequestPrioprityModel);

const serviceRequestPrioprityController = new AdvancedGenericController({
    service: ServiceRequestPrioprityRouterServices,
    populate: ["userId"],
    validationSchema: serviceRequestPrioprityCreateSchema,
});

ServiceRequestPrioprityRouter.get("/", serviceRequestPrioprityController.getAll);
ServiceRequestPrioprityRouter.get("/:id", serviceRequestPrioprityController.getById);
ServiceRequestPrioprityRouter.post("/", serviceRequestPrioprityController.create);
ServiceRequestPrioprityRouter.put("/:id", serviceRequestPrioprityController.update);
ServiceRequestPrioprityRouter.delete("/:id", serviceRequestPrioprityController.delete);

export default ServiceRequestPrioprityRouter;
