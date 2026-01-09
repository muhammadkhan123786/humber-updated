import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { documentTypes, documentTypesDoc } from "../models/document.types.models";
import { documentTypeSchemaValidation } from "../schemas/document.type.schema";
import { AdvancedGenericController } from "../controllers/GenericController";

const documentTypesRouter = Router();

const documentTypesServices = new GenericService<documentTypesDoc>(documentTypes);

const documentTypesController = new AdvancedGenericController({
    service: documentTypesServices,
    populate: ["userId"],
    validationSchema: documentTypeSchemaValidation,
    searchFields: ["documentTypeName"]
});

documentTypesRouter.get("/", documentTypesController.getAll);
documentTypesRouter.get("/:id", documentTypesController.getById);
documentTypesRouter.post("/", documentTypesController.create);
documentTypesRouter.put("/:id", documentTypesController.update);
documentTypesRouter.delete("/:id", documentTypesController.delete);

export default documentTypesRouter;

