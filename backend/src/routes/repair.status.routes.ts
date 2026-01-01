import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { RepairStatus, RepairStatusDoc } from "../models/repairStatus.model";
import { repairStatusCreateSchema } from "../schemas/repairStatus.schema";
import { AdvancedGenericController } from "../controllers/GenericController";

const repairStatusRouter = Router();

const repairStatusServices = new GenericService<RepairStatusDoc>(RepairStatus);

const repairStatusController = new AdvancedGenericController({
    service: repairStatusServices,
    populate: ["userId"],
    validationSchema: repairStatusCreateSchema,
});

repairStatusRouter.get("/", repairStatusController.getAll);
repairStatusRouter.get("/:id", repairStatusController.getById);
repairStatusRouter.post("/", repairStatusController.create);
repairStatusRouter.put("/:id", repairStatusController.update);
repairStatusRouter.delete("/:id", repairStatusController.delete);

export default repairStatusRouter;
