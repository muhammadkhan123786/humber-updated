import { NextFunction, Response, Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import {
  technicianActivityMasterDoc,
  TechniciansActivitiesMaster,
} from "../../models/technician-activities-master-models/technician.activities.master.models";
import { technicianActivitiesValidation } from "../../schemas/technician-activities-records/technician.activities.records.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";
import { TechnicianAuthRequest } from "../../middleware/auth.middleware";

const technicianActivityMasterRouter = Router();

const technicianActivityMasterServices =
  new GenericService<technicianActivityMasterDoc>(TechniciansActivitiesMaster);

const techncianActivitymasterController = new AdvancedGenericController({
  service: technicianActivityMasterServices,
  populate: [
    { path: "JobAssignedId", select: "jobId" },
    {
      path: "quotationId",
      select: "quotationAutoId",
      populate: [
        {
          path: "technicianId",
          select: "personId",
          populate: [{ path: "personId", select: "firstName lastName" }],
        },
        {
          path: "partsList",
          select: "installedBy installedQuantity",
          populate: [
            {
              path: "installedBy",
              select: "personId",
              populate: { path: "personId", select: "firstName lastName" },
            },
          ],
        },
      ],
    },
    {
      path: "activityType",
      select: "technicianServiceType",
    },
    {
      path: "technicianId",
      select: "personId",
      populate: [{ path: "personId", select: "firstName lastName" }],
    },
    {
      path: "timeLogs.partsUsed.partId",
      select: "partName",
    },
  ],
  validationSchema: technicianActivitiesValidation,
});

technicianActivityMasterRouter.post(
  "/", // ✅ MUST be here
  async (req: TechnicianAuthRequest, res: Response, next: NextFunction) => {
    req.body.technicianId = req.technicianId;
    req.body.userId = req.user.userId; // Assuming the technician is also the user creating the record
    next();
  },
  techncianActivitymasterController.create,
);
technicianActivityMasterRouter.get(
  "/",
  techncianActivitymasterController.getAll,
);
technicianActivityMasterRouter.get(
  "/:id",
  techncianActivitymasterController.getById,
);
technicianActivityMasterRouter.put(
  "/:id",
  async (req: TechnicianAuthRequest, res: Response, next: NextFunction) => {
    req.body.technicianId = req.technicianId;
    req.body.userId = req.user.userId;
    next();
  },
  techncianActivitymasterController.update,
);
technicianActivityMasterRouter.delete(
  "/:id",
  techncianActivitymasterController.delete,
);

export default technicianActivityMasterRouter;
