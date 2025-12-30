import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { servicesZonesDoc, ServiceZoneModel } from "../models/service.zones.models";
import { serviceZoneCreateSchema } from "../schemas/service.zones.schema";
import { AdvancedGenericController } from "../controllers/GenericController";

const ServiceZoneRouter = Router();

const ServiceZoneRouterServices = new GenericService<servicesZonesDoc>(ServiceZoneModel);

const serviceZoneController = new AdvancedGenericController({
    service: ServiceZoneRouterServices,
    populate: ["userId"],
    validationSchema: serviceZoneCreateSchema,
});

ServiceZoneRouter.get("/", serviceZoneController.getAll);
ServiceZoneRouter.get("/:id", serviceZoneController.getById);
ServiceZoneRouter.post("/", serviceZoneController.create);
ServiceZoneRouter.put("/:id", serviceZoneController.update);
ServiceZoneRouter.delete("/:id", serviceZoneController.delete);

export default ServiceZoneRouter;

