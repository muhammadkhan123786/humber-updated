import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { ticketStatusDoc, TicketStatus } from "../../models/ticket-management-system-models/ticket.status.models";
import { ticketStatusSchemaValidation } from "../../schemas/ticket-management-system-schemas/ticket.status.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";

const ticketStatusRouter = Router();

const ticketStatusServices = new GenericService<ticketStatusDoc>(TicketStatus);

const ticketStatusController = new AdvancedGenericController({
    service: ticketStatusServices,
    populate: ["userId"],
    validationSchema: ticketStatusSchemaValidation,
});

ticketStatusRouter.get("/", ticketStatusController.getAll);
ticketStatusRouter.get("/:id", ticketStatusController.getById);
ticketStatusRouter.post("/", ticketStatusController.create);
ticketStatusRouter.put("/:id", ticketStatusController.update);
ticketStatusRouter.delete("/:id", ticketStatusController.delete);

export default ticketStatusRouter;

