import { NextFunction, Request, Response, Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import {
  ticketQuatationDoc,
  TicketQuations,
} from "../../models/ticket-quation-models/ticket.quotation.models";
import { ticketQuotationValidation } from "../../schemas/ticket-quation-schemas/ticket.quotation.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";
import {
  TechnicianAuthRequest,
  technicianProtecter,
} from "../../middleware/auth.middleware";
import { technicianTicketsQuotationsController } from "../../controllers/technician-dashboard-controllers/technician.quotations.controller";
import { generateQuotationCode } from "../../utils/generate.AutoCode.Counter";

const ticketQuotationRouter = Router();

const ticketQuotationServices = new GenericService<ticketQuatationDoc>(
  TicketQuations,
);

const ticketQuotationController = new AdvancedGenericController({
  service: ticketQuotationServices,
  populate: [
    "userId",
    "technicianId",
    "ticketId",
    "partsList",
    {
      path: "ticketId",
      populate: [
        { path: "ticketStatusId", select: "code" },
        { path: "priorityId", select: "serviceRequestPrioprity" },
        {
          path: "customerId",
          populate: [{ path: "personId", select: "firstName lastName" }],
        },
        { path: "vehicleId", select: "productName" },
      ],
    },
  ],
  validationSchema: ticketQuotationValidation,
  searchFields: ["quotationAutoId"],
});

ticketQuotationRouter.get(
  "/",
  technicianProtecter,
  technicianTicketsQuotationsController,
);
ticketQuotationRouter.get("/:id", ticketQuotationController.getById);
ticketQuotationRouter.post(
  "/",
  async (req, res, next) => {
    try {
      const quotationId = await generateQuotationCode();
      req.body.quotationAutoId = quotationId;
    } catch (err) {
      console.error("Failed to generate quotation ID", err);
      return res
        .status(500)
        .json({ message: "Failed to generate quotation ID" });
    }

    next();
  },
  technicianProtecter,
  (req: TechnicianAuthRequest, res: Response, next: NextFunction) => {
    req.body.userId = req.user.userId;
    req.body.technicianId = req.technicianId;
    next();
  },
  ticketQuotationController.create,
);
ticketQuotationRouter.put(
  "/:id",
  technicianProtecter,
  (req: TechnicianAuthRequest, res: Response, next: NextFunction) => {
    req.body.userId = req.user.userId;
    req.body.technicianId = req.technicianId;
    next();
  },
  ticketQuotationController.update,
);
ticketQuotationRouter.delete("/:id", ticketQuotationController.delete);

export default ticketQuotationRouter;
