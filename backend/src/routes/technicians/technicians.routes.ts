import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { Request, Response, NextFunction } from "express";
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
import { getTechniciansWithActiveJobsController } from "../../controllers/technician-job-statistics/technician.jobs.statistics.controller";
import { generateEmployeeCode } from "../../utils/generate.AutoCode.Counter";
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
  searchFields: [
    "personId.firstName",
    "personId.middleName",
    "personId.lastName",
    "employeeId",
    "contactId.emailId",
    "contactId.mobileNumber",
  ],
  validationSchema: TECHNICIAN_SCHEMA_Validation,
});

const technicianProfileMiddleware = genericProfileIdsMiddleware<technicianDoc>({
  targetModel: Technicians,
});

techniciansRouter.get("/summary", getTechnicianDashboardSummary);
techniciansRouter.get("/", getTechniciansWithActiveJobsController);
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
  async (req: Request, res: Response, next: NextFunction) => {
    const employeeCode = await generateEmployeeCode();
    req.body.employeeId = employeeCode;
    next();
  },
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
