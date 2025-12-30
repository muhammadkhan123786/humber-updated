import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { serviceRequestTypeDoc, serviceRequestTypeModel } from "../models/service.request.type.models";
import { serviceRequestTypeCreateSchema } from "../schemas/service.request.types.schema";
import { AdvancedGenericController } from "../controllers/GenericController";

const serviceRequestTypeRouter = Router();

const ServiceRequestTypeServices = new GenericService<serviceRequestTypeDoc>(serviceRequestTypeModel);

const serviceRequestTypeController = new AdvancedGenericController({
    service: ServiceRequestTypeServices,
    populate: ["userId"],
    validationSchema: serviceRequestTypeCreateSchema,
});

serviceRequestTypeRouter.get("/", serviceRequestTypeController.getAll);
serviceRequestTypeRouter.get("/:id", serviceRequestTypeController.getById);
serviceRequestTypeRouter.post("/", serviceRequestTypeController.create);
serviceRequestTypeRouter.put("/:id", serviceRequestTypeController.update);
serviceRequestTypeRouter.delete("/:id", serviceRequestTypeController.delete);

export default serviceRequestTypeRouter;
