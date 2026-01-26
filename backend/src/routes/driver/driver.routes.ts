import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import {
    driverSchemaDoc,
    DriverModel,
} from "../../models/driver/driver.models";
import { createDriverSchema } from "../../schemas/driver/driver.schema.validation";
import { AdvancedGenericController } from "../../controllers/GenericController";
import { createUploader } from "../../config/multer";
import { mapUploadedFilesToBody } from "../../middleware/mapUploadedFiles";
import { createDriver, updateDriver } from "../../controllers/driver/driver.controller";
import { validateData } from "../../middleware/zod.validation.middleware";
import { createOrUpdateAccount } from "../../middleware/create.account.middleware";

const driverUploadsUpload = createUploader([
    {
        name: "driverLicense",
        maxCount: 100,
        mimeTypes: ["image/jpeg", "image/png", "application/pdf"],
    },
    {
        name: "governmentId",
        maxCount: 100,
        mimeTypes: ["image/jpeg", "image/png", "application/pdf"],
    },
    {
        name: "vehicleRegister",
        maxCount: 100,
        mimeTypes: ["image/jpeg", "image/png", "application/pdf"],
    },
    {
        name: "insuranceCertificates",
        maxCount: 100,
        mimeTypes: ["image/jpeg", "image/png", "application/pdf"],
    },
    {
        name: "backgroundChecks",
        maxCount: 100,
        mimeTypes: ["image/jpeg", "image/png", "application/pdf"],
    },
    {
        name: "otherDocuments",
        maxCount: 100,
        mimeTypes: ["image/jpeg", "image/png", "application/pdf"],
    },
]);

const driverRouter = Router();

const customerVehicleServices = new GenericService<driverSchemaDoc>(
    DriverModel,
);

const driverController = new AdvancedGenericController({
    service: customerVehicleServices,
    populate: ["accountId"],
    validationSchema: createDriverSchema,
    searchFields: ["firstName", "phoneNumber"],
});

driverRouter.get("/", driverController.getAll);
driverRouter.get("/:id", driverController.getById);
driverRouter.post(
    "/",
    driverUploadsUpload,
    mapUploadedFilesToBody("/uploads", { driverLicense: "driverLicense", governmentId: "governmentId", vehicleRegister: "vehicleRegister", backgroundChecks: "backgroundChecks", otherDocuments: "otherDocuments" }, [
        "driverLicense", "governmentId", "vehicleRegister", "backgroundChecks", "otherDocuments"
    ]),
    validateData(createDriverSchema),
    createOrUpdateAccount,
    createDriver,
);

driverRouter.put(
    "/:id",
    driverUploadsUpload,
    mapUploadedFilesToBody("/uploads", { driverLicense: "driverLicense", governmentId: "governmentId", vehicleRegister: "vehicleRegister", backgroundChecks: "backgroundChecks", otherDocuments: "otherDocuments" }, [
        "driverLicense", "governmentId", "vehicleRegister", "backgroundChecks", "otherDocuments"
    ]),
    validateData(createDriverSchema),
    createOrUpdateAccount,
    updateDriver
);
driverRouter.delete("/:id", driverController.delete);

export default driverRouter;
