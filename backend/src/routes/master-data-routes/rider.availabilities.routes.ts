import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { riderAvailabilitiesDoc, riderAvailabilities } from "../../models/master-data-models/rider.availabilities.models";
import { technicianJobStatusSchemaValidation } from "../../schemas/master-data/technician.jobs.status";
import { AdvancedGenericController } from "../../controllers/GenericController";

const riderAvailabilitiesRouter = Router();

const riderAvailabilitiesServices = new GenericService<riderAvailabilitiesDoc>(riderAvailabilities);

const riderAvailabilitiesController = new AdvancedGenericController({
    service: riderAvailabilitiesServices,
    populate: ["userId"],
    validationSchema: technicianJobStatusSchemaValidation,
    searchFields: ["technicianJobStatus"]
});

riderAvailabilitiesRouter.get("/", riderAvailabilitiesController.getAll);
riderAvailabilitiesRouter.get("/:id", riderAvailabilitiesController.getById);
riderAvailabilitiesRouter.post("/", riderAvailabilitiesController.create);
riderAvailabilitiesRouter.put("/:id", riderAvailabilitiesController.update);
riderAvailabilitiesRouter.delete("/:id", riderAvailabilitiesController.delete);

export default riderAvailabilitiesRouter;

