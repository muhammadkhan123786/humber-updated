import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { contractTypeDoc, ContractType } from "../../models/master-data-models/contract.types.models";
import { contractTypeSchemaValidation } from "../../schemas/master-data/contract.types.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";

const contractTypeRouter = Router();

const contractTypeServices = new GenericService<contractTypeDoc>(ContractType);

const contractTypeController = new AdvancedGenericController({
    service: contractTypeServices,
    populate: ["userId"],
    validationSchema: contractTypeSchemaValidation,
    searchFields: ["contractType"]
});

contractTypeRouter.get("/", contractTypeController.getAll);
contractTypeRouter.get("/:id", contractTypeController.getById);
contractTypeRouter.post("/", contractTypeController.create);
contractTypeRouter.put("/:id", contractTypeController.update);
contractTypeRouter.delete("/:id", contractTypeController.delete);

export default contractTypeRouter;

