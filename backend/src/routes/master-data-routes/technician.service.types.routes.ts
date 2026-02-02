import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { technicianServiceTypeDoc, TechnicianServiceType } from "../../models/master-data-models/technician.service.models";
import { technicianServiceTypeSchemaValidation } from "../../schemas/master-data/technician.service.types";
import { AdvancedGenericController } from "../../controllers/GenericController";

const technicianServiceTypeRouter = Router();

const technicianServiceTypesServices = new GenericService<technicianServiceTypeDoc>(TechnicianServiceType);

const technicianServiceTypeController = new AdvancedGenericController({
    service: technicianServiceTypesServices,
    populate: ["userId"],
    validationSchema: technicianServiceTypeSchemaValidation,
    searchFields: ["technicianServiceType"]
});

technicianServiceTypeRouter.get("/", technicianServiceTypeController.getAll);
technicianServiceTypeRouter.get("/:id", technicianServiceTypeController.getById);
technicianServiceTypeRouter.post("/", technicianServiceTypeController.create);
technicianServiceTypeRouter.put("/:id", technicianServiceTypeController.update);
technicianServiceTypeRouter.delete("/:id", technicianServiceTypeController.delete);

export default technicianServiceTypeRouter;

