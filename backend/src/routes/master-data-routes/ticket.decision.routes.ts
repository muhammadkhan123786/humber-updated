import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { decisionDoc, TicketDecision } from "../../models/master-data-models/decision.models";
import { ticketDecisionSchemaValidation } from "../../schemas/master-data/ticket.decision.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";

const ticketDecisionRouter = Router();

const ticketDecisionServices = new GenericService<decisionDoc>(TicketDecision);

const ticketDecisionController = new AdvancedGenericController({
    service: ticketDecisionServices,
    populate: ["userId"],
    validationSchema: ticketDecisionSchemaValidation,
    searchFields: ["decision"]
});

ticketDecisionRouter.get("/", ticketDecisionController.getAll);
ticketDecisionRouter.get("/:id", ticketDecisionController.getById);
ticketDecisionRouter.post("/", ticketDecisionController.create);
ticketDecisionRouter.put("/:id", ticketDecisionController.update);
ticketDecisionRouter.delete("/:id", ticketDecisionController.delete);

export default ticketDecisionRouter;

