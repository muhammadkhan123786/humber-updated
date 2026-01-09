import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import {
  ticketTypeDoc,
  TicketTypes,
} from "../../models/ticket-management-system-models/ticket.type.models";
import { ticketTypeSchemaValidation } from "../../schemas/ticket-management-system-schemas/ticket.types.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";

const ticketTypesRouter = Router();

const ticketTypesServices = new GenericService<ticketTypeDoc>(TicketTypes);

const ticketTypesController = new AdvancedGenericController({
  service: ticketTypesServices,
  populate: ["userId", "departmentId"],
  validationSchema: ticketTypeSchemaValidation,
  searchFields: ["code", "label"],
});

ticketTypesRouter.get("/", ticketTypesController.getAll);
ticketTypesRouter.get("/:id", ticketTypesController.getById);
ticketTypesRouter.post("/", ticketTypesController.create);
ticketTypesRouter.put("/:id", ticketTypesController.update);
ticketTypesRouter.delete("/:id", ticketTypesController.delete);

export default ticketTypesRouter;
