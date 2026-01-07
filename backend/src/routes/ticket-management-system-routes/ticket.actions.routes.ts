import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { ticketActionsDoc, TicketActions } from "../../models/ticket-management-system-models/ticket.actions.models";
import { ticketActionsSchemaValidation } from "../../schemas/ticket-management-system-schemas/ticket.actions.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";

const ticketActionsRouter = Router();

const tickeActionsServices = new GenericService<ticketActionsDoc>(TicketActions);

const ticketActionsController = new AdvancedGenericController({
    service: tickeActionsServices,
    populate: ["userId"],
    validationSchema: ticketActionsSchemaValidation,
});

ticketActionsRouter.get("/", ticketActionsController.getAll);
ticketActionsRouter.get("/:id", ticketActionsController.getById);
ticketActionsRouter.post("/", ticketActionsController.create);
ticketActionsRouter.put("/:id", ticketActionsController.update);
ticketActionsRouter.delete("/:id", ticketActionsController.delete);

export default ticketActionsRouter;

