import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import {
  technicianDoc,
  Technicians,
} from "../../models/technician-models/technician.models";
import { TECHNICIAN_SCHEMA_Validation } from "../../schemas/technicians/technicians.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";
import { genericProfileIdsMiddleware } from "../../middleware/generic.profile.middleware";
import { getTechnicianDashboardSummary } from "../../controllers/technician.statis.controller";
import { createUploader } from "../../config/multer";
import { mapUploadedFilesToBody } from "../../middleware/mapUploadedFiles";
import { normalizeArrays } from "../../middleware/normalizeArrays";
import { parseDutyRosterMiddleware } from "../../middleware/parseDutyRoster";
const technicianUploads = createUploader([
  {
    name: "technicianDocumentsFile",
    maxCount: 1000,
    mimeTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
]);

const techniciansRouter = Router();

const technicianServices = new GenericService<technicianDoc>(Technicians);

const technicianController = new AdvancedGenericController({
  service: technicianServices,
  populate: [
    "userId",
    "personId",
    "addressId",
    "contactId",
    "contractTypeId",
    "accountId",
    "departmentId",
    "specializationIds",
    {
      path: "addressId",
      populate: [{ path: "cityId" }, { path: "countryId" }],
    },
  ],
  searchFields: ["personId.firstName", "personId.middleName"],
  validationSchema: TECHNICIAN_SCHEMA_Validation,
});

const technicianProfileMiddleware = genericProfileIdsMiddleware<technicianDoc>({
  targetModel: Technicians,
});

techniciansRouter.get("/summary", getTechnicianDashboardSummary);
techniciansRouter.get("/", technicianController.getAll);
techniciansRouter.get("/:id", technicianController.getById);

techniciansRouter.post(
  "/",
  technicianUploads,
  mapUploadedFilesToBody("/uploads", {
    technicianDocumentsFile: "technicianDocuments",
  }),
  normalizeArrays(["technicianDocuments"]),
  parseDutyRosterMiddleware,
  technicianProfileMiddleware,
  technicianController.create,
);

// PUT
techniciansRouter.put(
  "/:id",
  technicianUploads,
  mapUploadedFilesToBody("/uploads", {
    technicianDocumentsFile: "technicianDocuments",
  }),
  normalizeArrays(["technicianDocuments"]),
  parseDutyRosterMiddleware,
  technicianProfileMiddleware,
  technicianController.update,
);

// DELETE
techniciansRouter.delete("/:id", technicianController.delete);

export default techniciansRouter;
