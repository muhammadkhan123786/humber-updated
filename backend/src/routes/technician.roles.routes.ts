import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { technicianRoleDoc, TechnicianRoleModel } from "../models/technician.roles.models";
import { technicianRoleCreateSchema } from "../schemas/technician.roles.schema";
import { AdvancedGenericController } from "../controllers/GenericController";

const TechnicianRoleRouter = Router();

const TechnicianRoleRouterServices = new GenericService<technicianRoleDoc>(TechnicianRoleModel);

const technicianRoleController = new AdvancedGenericController({
    service: TechnicianRoleRouterServices,
    populate: ["userId"],
    validationSchema: technicianRoleCreateSchema,
    searchFields: [""]
});

TechnicianRoleRouter.get("/", technicianRoleController.getAll);
TechnicianRoleRouter.get("/:id", technicianRoleController.getById);
TechnicianRoleRouter.post("/", technicianRoleController.create);
TechnicianRoleRouter.put("/:id", technicianRoleController.update);
TechnicianRoleRouter.delete("/:id", technicianRoleController.delete);

export default TechnicianRoleRouter;

