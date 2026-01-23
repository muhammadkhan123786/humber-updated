import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { technicianJobStatusTypeDoc, TechnicianJobStatus } from "../../models/master-data-models/technician.job.status.models";
import { technicianJobStatusSchemaValidation } from "../../schemas/master-data/technician.jobs.status";
import { AdvancedGenericController } from "../../controllers/GenericController";

const technicianJobStatusRouter = Router();

const technicianJobStatusServices = new GenericService<technicianJobStatusTypeDoc>(TechnicianJobStatus);

const technicianJobStatusController = new AdvancedGenericController({
    service: technicianJobStatusServices,
    populate: ["userId"],
    validationSchema: technicianJobStatusSchemaValidation,
    searchFields: ["technicianJobStatus"]
});

technicianJobStatusRouter.get("/", technicianJobStatusController.getAll);
technicianJobStatusRouter.get("/:id", technicianJobStatusController.getById);
technicianJobStatusRouter.post("/", technicianJobStatusController.create);
technicianJobStatusRouter.put("/:id", technicianJobStatusController.update);
technicianJobStatusRouter.delete("/:id", technicianJobStatusController.delete);

export default technicianJobStatusRouter;

