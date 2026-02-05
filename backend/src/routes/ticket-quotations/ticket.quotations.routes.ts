import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { ticketQuatationDoc, TicketQuations } from "../../models/ticket-quation-models/ticket.quotation.models";
import { ticketQuotationValidation } from "../../schemas/ticket-quation-schemas/ticket.quotation.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";
import { technicianMasterProtector, technicianProtecter } from "../../middleware/auth.middleware";
import { technicianTicketsQuotationsController } from "../../controllers/technician-dashboard-controllers/technician.quotations.controller";

const ticketQuotationRouter = Router();

const ticketQuotationServices = new GenericService<ticketQuatationDoc>(TicketQuations);

const ticketQuotationController = new AdvancedGenericController({
    service: ticketQuotationServices,
    populate: ["userId"],
    validationSchema: ticketQuotationValidation,
    searchFields: ["quotationAutoId"]
});


ticketQuotationRouter.get("/", technicianProtecter, technicianTicketsQuotationsController);
ticketQuotationRouter.get("/:id", ticketQuotationController.getById);
ticketQuotationRouter.post("/", technicianMasterProtector, ticketQuotationController.create);
ticketQuotationRouter.put("/:id", technicianMasterProtector, ticketQuotationController.update);
ticketQuotationRouter.delete("/:id", ticketQuotationController.delete);

export default ticketQuotationRouter;

