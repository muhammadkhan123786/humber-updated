import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { labourDoc, Labour } from "../../models/master-data-models/labour.models";
import { labourValidation } from "../../schemas/master-data/labour.cost.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";

const labourRateRouter = Router();

const labourRateServices = new GenericService<labourDoc>(Labour);

const jobTitleController = new AdvancedGenericController({
    service: jobTitleServices,
    populate: ["userId"],
    validationSchema: labourValidation,
    searchFields: ["jobTitleName"]
});

labourRateRouter.get("/", jobTitleController.getAll);
labourRateRouter.get("/:id", jobTitleController.getById);
labourRateRouter.post("/", jobTitleController.create);
labourRateRouter.put("/:id", jobTitleController.update);
labourRateRouter.delete("/:id", jobTitleController.delete);

export default labourRateRouter;

