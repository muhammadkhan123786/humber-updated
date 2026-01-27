import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { ServiceRequestPrioprityDoc, ServiceRequestPrioprityModel } from "../models/service.request.prioprity.models";
import { serviceRequestPrioprityCreateSchema } from "../schemas/service.request.prioprity.schema";
import { AdvancedGenericController } from "../controllers/GenericController";
import { indexUniqueMiddlewareCheck } from "../middleware/index.unique.middleware";

const ServiceRequestPrioprityRouter = Router();

const ServiceRequestPrioprityRouterServices = new GenericService<ServiceRequestPrioprityDoc>(ServiceRequestPrioprityModel);

const serviceRequestPrioprityController = new AdvancedGenericController({
    service: ServiceRequestPrioprityRouterServices,
    populate: ["userId"],
    validationSchema: serviceRequestPrioprityCreateSchema,
    searchFields: ["serviceRequestPrioprity"]
});

ServiceRequestPrioprityRouter.get("/", serviceRequestPrioprityController.getAll);
ServiceRequestPrioprityRouter.get("/:id", serviceRequestPrioprityController.getById);
ServiceRequestPrioprityRouter.post("/", indexUniqueMiddlewareCheck(ServiceRequestPrioprityModel), serviceRequestPrioprityController.create);
ServiceRequestPrioprityRouter.put("/:id", indexUniqueMiddlewareCheck(ServiceRequestPrioprityModel), serviceRequestPrioprityController.update);
ServiceRequestPrioprityRouter.delete("/:id", serviceRequestPrioprityController.delete);

export default ServiceRequestPrioprityRouter;
