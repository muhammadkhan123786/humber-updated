import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { partsDoc, Parts } from "../../models/master-data-models/parts.models";
import { partsSchemaValidation } from "../../schemas/master-data/parts.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";

const partsRouter = Router();

const partsServices = new GenericService<partsDoc>(Parts);

const partsController = new AdvancedGenericController({
    service: partsServices,
    populate: ["userId"],
    validationSchema: partsSchemaValidation,
    searchFields: ["partName", "partNumber"]
});

partsRouter.get("/", partsController.getAll);
partsRouter.get("/:id", partsController.getById);
partsRouter.post("/", partsController.create);
partsRouter.put("/:id", partsController.update);
partsRouter.delete("/:id", partsController.delete);

export default partsRouter;

