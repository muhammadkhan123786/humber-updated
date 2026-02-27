import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { technicianActivityMasterDoc, TechniciansActivitiesMaster } from "../../models/technician-activities-master-models/technician.activities.master.models";
import { technicianActivitiesValidation } from "../../schemas/technician-activities-records/technician.activities.records.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";


const technicianActivityMasterRouter = Router();

const technicianActivityMasterServices = new GenericService<technicianActivityMasterDoc>(TechniciansActivitiesMaster);

const techncianActivitymasterController = new AdvancedGenericController({
    service: technicianActivityMasterServices,
    populate: ["userId", "JobAssignedId","quotationId","activityType","technicianId"],
    validationSchema: technicianActivitiesValidation,
});

technicianActivityMasterRouter.post("/", techncianActivitymasterController.create);
technicianActivityMasterRouter.get("/", techncianActivitymasterController.getAll);
technicianActivityMasterRouter.get("/:id", techncianActivitymasterController.getById);
technicianActivityMasterRouter.put("/:id", techncianActivitymasterController.update);
technicianActivityMasterRouter.delete("/:id", techncianActivitymasterController.delete);

export default technicianActivityMasterRouter;

