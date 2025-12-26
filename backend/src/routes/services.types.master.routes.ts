import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { ServiceTypeMaster, ServiceTypeMasterDoc } from "../models/service.master.models";
import { MasterServiceTypeCreateSchema } from "../schemas/service.type.master.schema";
import { AdvancedGenericController } from "../controllers/GenericController";

const serviceTypeMasterRouter = Router();

const serviceTypeMasterServices = new GenericService<ServiceTypeMasterDoc>(ServiceTypeMaster);

const serviceTypeMasterController = new AdvancedGenericController({
    service: serviceTypeMasterServices,
    populate: "userId",
    validationSchema: MasterServiceTypeCreateSchema,
});

serviceTypeMasterRouter.get("/", serviceTypeMasterController.getAll);
serviceTypeMasterRouter.get("/:id", serviceTypeMasterController.getById);
serviceTypeMasterRouter.post("/", serviceTypeMasterController.create);
serviceTypeMasterRouter.put("/:id", serviceTypeMasterController.update);
serviceTypeMasterRouter.delete("/:id", serviceTypeMasterController.delete);

export default serviceTypeMasterRouter;
