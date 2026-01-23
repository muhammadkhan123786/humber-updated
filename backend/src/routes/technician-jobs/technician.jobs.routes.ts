import { Request, Response, NextFunction, Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import {
    technicianJobsDoc, TechniciansJobs
} from "../../models/technician-jobs-models/technician.jobs.models";
import { technicianJobSchemaValidation } from "../../schemas/technician-jobs-schemas/technician.jobs.schema.validations";
import { AdvancedGenericController } from "../../controllers/GenericController";
//import { createUploader } from "../../config/multer";
//import { mapUploadedFilesToBody } from "../../middleware/mapUploadedFiles";
//import { generateTicketCode } from "../../utils/generateTicketCode";
//import { normalizeArrays } from "../../middleware/normalizeArrays";

/*
const repairVehicleUpload = createUploader([
    {
        name: "vehicleRepairImagesFile",
        maxCount: 1000,
        mimeTypes: ["image/jpeg", "image/png"],
    },
    {
        name: "vehicleRepairVideo",
        maxCount: 1,
        mimeTypes: [
            "video/mp4",
            "video/mpeg",
            "video/quicktime",
            "video/x-msvideo",
            "video/x-matroska",
        ],
    },
]);
*/

const technicianJobsRouter = Router();

const technicianJobServices = new GenericService<technicianJobsDoc>(
    TechniciansJobs,
);

const technicianJobsController = new AdvancedGenericController({
    service: technicianJobServices,
    populate: [
        "userId",
        "ticketId",
        "technicianId",
        "jobStatusId"],
    validationSchema: technicianJobSchemaValidation,
    searchFields: ["jobId"],
});

technicianJobsRouter.get("/", technicianJobsController.getAll);
technicianJobsRouter.get("/:id", technicianJobsController.getById);
technicianJobsRouter.post("/", technicianJobsController.create);
technicianJobsRouter.put("/:id", technicianJobsController.update);
technicianJobsRouter.delete("/:id", technicianJobsController.delete);

export default technicianJobsRouter;
