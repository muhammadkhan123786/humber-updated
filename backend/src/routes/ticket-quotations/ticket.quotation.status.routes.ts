import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { ticketQuatationStatusDoc, TicketQuationStatus } from "../../models/ticket-quation-models/ticket.quation.status.models";
import { ticketQuationStatusValidation } from "../../schemas/ticket-quation-schemas/ticket.quation.status.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";

const ticketQuotationStatusRouter = Router();

const ticketQuotationServices = new GenericService<ticketQuatationStatusDoc>(TicketQuationStatus);

const ticketQuotationController = new AdvancedGenericController({
    service: ticketQuotationServices,
    populate: ["userId"],
    validationSchema: ticketQuationStatusValidation,
    searchFields: ["ticketQuationStatus"]
});

ticketQuotationStatusRouter.get("/", ticketQuotationController.getAll);
ticketQuotationStatusRouter.get("/:id", ticketQuotationController.getById);
ticketQuotationStatusRouter.post("/", ticketQuotationController.create);
ticketQuotationStatusRouter.put("/:id", ticketQuotationController.update);
ticketQuotationStatusRouter.delete("/:id", ticketQuotationController.delete);

export default ticketQuotationStatusRouter;

