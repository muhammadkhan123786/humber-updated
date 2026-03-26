import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { moduleActionsDoc, ModulesActions } from "../../models/communication-channel-models/module.actions.models";
import { moduleActionValidation } from "../../schemas/communication-channels-integration-schema/module.actions.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";

const moduleActionsRouter = Router();

const moduleActionsServices = new GenericService<moduleActionsDoc>(ModulesActions);

const moduleActionsController = new AdvancedGenericController({
    service: moduleActionsServices,
    validationSchema: moduleActionValidation
});

moduleActionsRouter.get("/", moduleActionsController.getAll);
moduleActionsRouter.get("/:id", moduleActionsController.getById);
moduleActionsRouter.post("/", moduleActionsController.create);
moduleActionsRouter.put("/:id", moduleActionsController.update);
moduleActionsRouter.delete("/:id", moduleActionsController.delete);

export default moduleActionsRouter;

