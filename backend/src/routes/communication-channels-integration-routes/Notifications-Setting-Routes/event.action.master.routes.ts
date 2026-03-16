import { Router } from "express";
import { GenericService } from "../../../services/generic.crud.services";
import { eventActionDoc, EventActions } from "../../../models/communication-channel-models/Notifications-models/event.actions.models";
import { eventActionValidation } from "../../../schemas/communication-channels-integration-schema/Notifications-Schemas/event.schema";
import { AdvancedGenericController } from "../../../controllers/GenericController";

const eventActionRouter = Router();

const eventActionServices = new GenericService<eventActionDoc>(EventActions);

const eventActionController = new AdvancedGenericController({
    service: eventActionServices,
    populate: ["userId"],
    validationSchema: eventActionValidation,
    searchFields: ["eventKey","name","description"]
});

eventActionRouter.get("/", eventActionController.getAll);
eventActionRouter.get("/:id", eventActionController.getById);
eventActionRouter.post("/", eventActionController.create);
eventActionRouter.put("/:id", eventActionController.update);
eventActionRouter.delete("/:id", eventActionController.delete);

export default eventActionRouter;

