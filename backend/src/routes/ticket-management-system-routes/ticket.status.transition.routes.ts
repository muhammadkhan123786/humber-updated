import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { ticketStatusTransitionDoc, TicketStatusTransition } from "../../models/ticket-management-system-models/ticket.status.transition.models";
import { ticketStatusTransitionSchemaValidation } from "../../schemas/ticket-management-system-schemas/ticket.status.transition.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";

const ticketStatusTransitionRouter = Router();

const ticketStatusTransitionServices = new GenericService<ticketStatusTransitionDoc>(TicketStatusTransition);

const ticketStatusTransitionController = new AdvancedGenericController({
    service: ticketStatusTransitionServices,
    populate: ["userId", "from_status_id", "to_status_id", "action_id", "ticket_type_id"],
    validationSchema: ticketStatusTransitionSchemaValidation,
});

ticketStatusTransitionRouter.get("/", ticketStatusTransitionController.getAll);
ticketStatusTransitionRouter.get("/:id", ticketStatusTransitionController.getById);
ticketStatusTransitionRouter.post("/", ticketStatusTransitionController.create);
ticketStatusTransitionRouter.put("/:id", ticketStatusTransitionController.update);
ticketStatusTransitionRouter.delete("/:id", ticketStatusTransitionController.delete);

export default ticketStatusTransitionRouter;

