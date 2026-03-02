import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { rideVehicleTypeDoc, RiderVehicleTypes } from "../../models/rider/rider.vehicle.types";
import { vehicleTypeValidation } from "../../schemas/rider-schemas/rider.vehicle.type.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";

const vehicleTypesRouter = Router();

const vehicleTypeServices = new GenericService<rideVehicleTypeDoc>(RiderVehicleTypes);

const vehicleTypeController = new AdvancedGenericController({
    service: vehicleTypeServices,
    populate: ["userId"],
    validationSchema: vehicleTypeValidation,
    searchFields: ["vehicleType"]
});

vehicleTypesRouter.get("/", vehicleTypeController.getAll);
vehicleTypesRouter.get("/:id", vehicleTypeController.getById);
vehicleTypesRouter.post("/", vehicleTypeController.create);
vehicleTypesRouter.put("/:id", vehicleTypeController.update);
vehicleTypesRouter.delete("/:id", vehicleTypeController.delete);

export default vehicleTypesRouter;

