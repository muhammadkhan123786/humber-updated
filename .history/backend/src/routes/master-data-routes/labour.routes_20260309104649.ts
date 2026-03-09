import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { labourDoc, Labour } from "../../models/master-data-models/labour.models";
import { labourValidation } from "../../schemas/master-data/labour.cost.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";

const labourRateRouter = Router();

const jobTitleServices = new GenericService<labourDoc>(Labour);

const jobTitleController = new AdvancedGenericController({
    service: jobTitleServices,
    populate: ["userId"],
    validationSchema: labourValidation,
    searchFields: ["jobTitleName"]
});

jobTitleRouter.get("/", jobTitleController.getAll);
jobTitleRouter.get("/:id", jobTitleController.getById);
jobTitleRouter.post("/", jobTitleController.create);
jobTitleRouter.put("/:id", jobTitleController.update);
jobTitleRouter.delete("/:id", jobTitleController.delete);

export default jobTitleRouter;

