import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { CustomerVehicleDoc, CustomerVehicleModel } from "../models/customer.vehicle.models";
import { customerVehicleSchemaValidation } from "../schemas/customer.vehicles.schema";
import { AdvancedGenericController } from "../controllers/GenericController";
import { createUploader } from "../config/multer";
import { mapUploadedFilesToBody } from "../middleware/mapUploadedFiles";

const vehicleUpload = createUploader([
    { name: 'vehiclePhoto', maxCount: 1, mimeTypes: ['image/jpeg', 'image/png'] },

]);
const customerVehicleRouter = Router();

const customerVehicleServices = new GenericService<CustomerVehicleDoc>(CustomerVehicleModel);

const customerVehicleController = new AdvancedGenericController({
    service: customerVehicleServices,
    populate: ["userId", "customerId", "vehicleBrandId", "vehicleModelId"],
    validationSchema: customerVehicleSchemaValidation,
    searchFields: ["serialNumber"]
});

customerVehicleRouter.get("/", customerVehicleController.getAll);
customerVehicleRouter.get("/:id", customerVehicleController.getById);
customerVehicleRouter.post("/", vehicleUpload, mapUploadedFilesToBody(), customerVehicleController.create);
customerVehicleRouter.put("/:id", vehicleUpload, mapUploadedFilesToBody(), customerVehicleController.update);
customerVehicleRouter.delete("/:id", customerVehicleController.delete);

export default customerVehicleRouter;
