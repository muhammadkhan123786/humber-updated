import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { labourDoc, Labour } from "../../models/master-data-models/labour.models";
import { labourValidation } from "../../schemas/master-data/labour.cost.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";

const labourRateRouter = Router();

const labourRateServices = new GenericService<labourDoc>(Labour);

const labourRateController = new AdvancedGenericController({
    service: labourRateServices,
    populate: ["userId"],
    validationSchema: labourValidation,
    searchFields: ["name"]
});

labourRateRouter.get("/", labourRateController.getAll);
labourRateRouter.get("/:id", labourRateController.getById);
labourRateRouter.post("/", labourRateController.create);
labourRateRouter.put("/:id", labourRateController.update);
labourRateRouter.delete("/:id", labourRateController.delete);

export default labourRateRouter;

