import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import {
  CustomerVehicleDoc,
  CustomerVehicleModel,
} from "../models/customer.vehicle.models";
import { customerVehicleSchemaValidation } from "../schemas/customer.vehicles.schema";
import { AdvancedGenericController } from "../controllers/GenericController";
import { createUploader } from "../config/multer";
import { mapUploadedFilesToBody } from "../middleware/mapUploadedFiles";
import {
  getCompanyOwnedVehiclesByCustomer,
  getCustomerOwnedVehiclesByCustomer,
} from "../controllers/customer-vehicles-controller/customer.vehicle.controller";

const vehicleUpload = createUploader([
  {
    name: "vehiclePhotoFile",
    maxCount: 1,
    mimeTypes: ["image/jpeg", "image/png"],
  },
]);

const customerVehicleRouter = Router();

const customerVehicleServices = new GenericService<CustomerVehicleDoc>(
  CustomerVehicleModel,
);

const customerVehicleController = new AdvancedGenericController({
  service: customerVehicleServices,
  populate: [
    "userId",
    "vehicleBrandId",
    "vehicleModelId",
    "customerId",
    "colorId",
  ],
  validationSchema: customerVehicleSchemaValidation,
  searchFields: ["serialNumber"],
});

customerVehicleRouter.get("/", customerVehicleController.getAll);
customerVehicleRouter.get("/:id", customerVehicleController.getById);
customerVehicleRouter.post(
  "/",
  vehicleUpload,
  mapUploadedFilesToBody("/uploads", { vehiclePhotoFile: "vehiclePhoto" }, [
    "vehiclePhoto",
  ]),
  customerVehicleController.create,
);

customerVehicleRouter.put(
  "/:id",
  vehicleUpload,
  mapUploadedFilesToBody("/uploads", { vehiclePhotoFile: "vehiclePhoto" }, [
    "vehiclePhoto",
  ]),
  customerVehicleController.update,
);

customerVehicleRouter.delete("/:id", customerVehicleController.delete);
//customer owned vehicles

customerVehicleRouter.get(
  "/customer-owned-vehicles/:customerId",
  getCustomerOwnedVehiclesByCustomer,
);

//company owned vehicles
customerVehicleRouter.get(
  "/company-owned-vehicles/:customerId",
  getCompanyOwnedVehiclesByCustomer,
);

export default customerVehicleRouter;
