import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { proposedActionDbDoc, ProposedActions } from "../models/proposed.actions.models"
import { proposedActionSchemaValidation } from "../schemas/proposed.actions.schema";
import { AdvancedGenericController } from "../controllers/GenericController";

const proposedActionsRouter = Router();

const propsedActionsServices = new GenericService<proposedActionDbDoc>(ProposedActions);

const proposedActionsController = new AdvancedGenericController({
    service: propsedActionsServices,
    populate: ["userId"],
    validationSchema: proposedActionSchemaValidation,
    searchFields: ["proposedActionName"]
});

proposedActionsRouter.get("/", proposedActionsController.getAll);
proposedActionsRouter.get("/:id", proposedActionsController.getById);
proposedActionsRouter.post("/", proposedActionsController.create);
proposedActionsRouter.put("/:id", proposedActionsController.update);
proposedActionsRouter.delete("/:id", proposedActionsController.delete);

export default proposedActionsRouter;

