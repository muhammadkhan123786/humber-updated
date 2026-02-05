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
import { normalizeArrays } from "../../middleware/normalizeArrays";

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
    name: "jobNotesImagesFile",
    maxCount: 1000,
    mimeTypes: ["image/jpeg", "image/png"],
  },
  // Optionally add video upload if needed
  {
    name: "jobNotesVideosFile",
    maxCount: 10,
    mimeTypes: ["video/mp4", "video/mpeg", "video/quicktime"],
  },
]);

technicianJobsRouter.get("/", technicianJobsController.getAll);
technicianJobsRouter.get("/:id", technicianJobsController.getById);

technicianJobsRouter.post(
  "/",
  technicianUploads,

  (req, res, next) => {
    if (req.body.jobNotes && typeof req.body.jobNotes === "string") {
      try {
        req.body.jobNotes = JSON.parse(req.body.jobNotes);
        console.log("Fixed: Parsed jobNotes string to object");
      } catch (err) {
        console.error("Failed to parse jobNotes:", err);
        req.body.jobNotes = {};
      }
    }
    next();
  },
  mapUploadedFilesToBody("/uploads", {
    jobNotesImagesFile: "jobNotes.images",
    jobNotesVideosFile: "jobNotes.videos",
  }),
  parseFormDataArrays,
  normalizeArrays(["jobNotes.images", "jobNotes.videos"]),
  technicianJobsController.create,
);

technicianJobsRouter.put(
  "/:id",
  technicianUploads,
  parseFormDataArrays,
  mapUploadedFilesToBody("/uploads", {
    jobNotesImagesFile: "jobNotes.images",
    jobNotesVideosFile: "jobNotes.videos",
  }),
  normalizeArrays(["jobNotes.images", "jobNotes.videos"]),
  technicianJobsController.update,
);
technicianJobsRouter.delete("/:id", technicianJobsController.delete);

export default technicianJobsRouter;
