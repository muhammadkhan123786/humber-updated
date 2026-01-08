import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { ticketReferenceTypeDoc, TicketReferenceTypes } from "../../models/ticket-management-system-models/ticket.reference.types.models";
import { ticketReferenceTypeSchemaValidation } from "../../schemas/ticket-management-system-schemas/ticket.reference.types.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";

const ticketReferenceTypesRouter = Router();

const ticketReferenceTypesServices = new GenericService<ticketReferenceTypeDoc>(TicketReferenceTypes);

const ticketReferenceTypesController = new AdvancedGenericController({
    service: ticketReferenceTypesServices,
    populate: ["userId"],
    validationSchema: ticketReferenceTypeSchemaValidation,
});

ticketReferenceTypesRouter.get("/", ticketReferenceTypesController.getAll);
ticketReferenceTypesRouter.get("/:id", ticketReferenceTypesController.getById);
ticketReferenceTypesRouter.post("/", ticketReferenceTypesController.create);
ticketReferenceTypesRouter.put("/:id", ticketReferenceTypesController.update);
ticketReferenceTypesRouter.delete("/:id", ticketReferenceTypesController.delete);

export default ticketReferenceTypesRouter;

