import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { VechicleModel, VehicleModelDoc } from "../models/vehicleModel.models";
import { vehicleModelCreateSchema } from "../schemas/vehicleModel.schema";
import { AdvancedGenericController } from "../controllers/GenericController";

const modelRouter = Router();

const vehicleModelServices = new GenericService<VehicleModelDoc>(VechicleModel);

const vehicleModelController = new AdvancedGenericController({
    service: vehicleModelServices,
    populate: ["userId", "brandId"],
    validationSchema: vehicleModelCreateSchema,
});

modelRouter.get("/", vehicleModelController.getAll);
modelRouter.get("/:id", vehicleModelController.getById);
modelRouter.post("/", vehicleModelController.create);
modelRouter.put("/:id", vehicleModelController.update);
modelRouter.delete("/:id", vehicleModelController.delete);

export default modelRouter;
