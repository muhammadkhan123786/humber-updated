import { NextFunction,Response, Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { technicianActivityMasterDoc, TechniciansActivitiesMaster } from "../../models/technician-activities-master-models/technician.activities.master.models";
import { technicianActivitiesValidation } from "../../schemas/technician-activities-records/technician.activities.records.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";
import { TechnicianAuthRequest } from "../../middleware/auth.middleware";


const technicianActivityMasterRouter = Router();

const technicianActivityMasterServices = new GenericService<technicianActivityMasterDoc>(TechniciansActivitiesMaster);

const techncianActivitymasterController = new AdvancedGenericController({
    service: technicianActivityMasterServices,
    populate: ["userId", "JobAssignedId","quotationId","activityType","technicianId"],
    validationSchema: technicianActivitiesValidation,
});



technicianActivityMasterRouter.post(
  "/",  // ✅ MUST be here
  async (req: TechnicianAuthRequest, res: Response, next: NextFunction) => {
    req.body.technicianId = req.technicianId;

    next();
  },
  techncianActivitymasterController.create
);
technicianActivityMasterRouter.get("/", techncianActivitymasterController.getAll);
technicianActivityMasterRouter.get("/:id", techncianActivitymasterController.getById);
technicianActivityMasterRouter.put("/:id",async (req: TechnicianAuthRequest, res: Response, next: NextFunction) => {
    req.body.technicianId = req.technicianId;

    next();
  }, techncianActivitymasterController.update);
technicianActivityMasterRouter.delete("/:id", techncianActivitymasterController.delete);

export default technicianActivityMasterRouter;

