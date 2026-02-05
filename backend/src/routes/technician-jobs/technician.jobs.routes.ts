import { Request, Response, NextFunction, Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import {
  technicianJobsDoc,
  TechniciansJobs,
} from "../../models/technician-jobs-models/technician.jobs.models";
import { technicianJobSchemaValidation } from "../../schemas/technician-jobs-schemas/technician.jobs.schema.validations";
import { AdvancedGenericController } from "../../controllers/GenericController";
import { createUploader } from "../../config/multer";
import { mapUploadedFilesToBody } from "../../middleware/mapUploadedFiles";
import { parseFormDataArrays } from "../../middleware/parseFormDataArrays";

const technicianJobsRouter = Router();

const technicianJobServices = new GenericService<technicianJobsDoc>(
  TechniciansJobs,
);

const technicianJobsController = new AdvancedGenericController({
  service: technicianJobServices,
  populate: ["userId", "ticketId", "technicianId", "jobStatusId"],
  validationSchema: technicianJobSchemaValidation,
  searchFields: ["jobId"],
});

const technicianUploads = createUploader([
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

technicianJobsRouter.get("/", technicianJobsController.getAll);
technicianJobsRouter.get("/:id", technicianJobsController.getById);

technicianJobsRouter.post(
  "/",
  technicianUploads,
  mapUploadedFilesToBody("/uploads", {
    vehicleRepairImagesFile: "vehicleRepairDocumentation.images",
    vehicleRepairVideo: "vehicleRepairDocumentation.video",
    jobNotesImagesFile: "jobNotes.images",
  }),
  parseFormDataArrays,
  technicianJobsController.create,
);

technicianJobsRouter.put(
  "/:id",
  technicianUploads,
  mapUploadedFilesToBody("/uploads", {
    vehicleRepairImagesFile: "vehicleRepairDocumentation.images",
    vehicleRepairVideo: "vehicleRepairDocumentation.video",
    jobNotesImagesFile: "jobNotes.images",
  }),
  parseFormDataArrays,
  technicianJobsController.update,
);

technicianJobsRouter.delete("/:id", technicianJobsController.delete);

export default technicianJobsRouter;
