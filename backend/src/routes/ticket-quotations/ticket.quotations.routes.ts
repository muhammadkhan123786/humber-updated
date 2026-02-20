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
import { Types } from "mongoose";

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
  }, technicianProtecter, (req: TechnicianAuthRequest, res: Response, next: NextFunction) => {
    req.body.userId = req.user.userId;
    req.body.technicianId = req.technicianId;
    next();
  }, ticketQuotationController.create);
ticketQuotationRouter.put(
  "/:id",
  technicianProtecter,
  async (req: TechnicianAuthRequest, res: Response, next: NextFunction) => {
    req.body.userId = req.user.userId;
    req.body.technicianId = req.technicianId;

    if (req.technicianId) {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id))
        return res.status(200).json({ status: false, message: "Invalid ID" });

      const quotation = await TicketQuations.findOne({ _id: id, isDeleted: false });
      if (!quotation)
        return res.status(200).json({ status: false, message: "Quotation Not Found." });

      if (quotation.quotationStatusId === "APPROVED") {
        return res.status(200).json({ status: false, message: "You cannot update approved quotations." });
      }
    }

    next();
  },
  ticketQuotationController.update
);

ticketQuotationRouter.delete(
  "/:id",
  technicianProtecter,
  async (req: TechnicianAuthRequest, res: Response, next: NextFunction) => {
    try {
      if (req.technicianId) {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id))
          return res.status(200).json({ message: "Invalid ID" });

        const quotation = await TicketQuations.findOne({ _id: id, isDeleted: false });
        if (!quotation)
          return res.status(200).json({ message: "Quotation Not Found." });

        if (quotation.quotationStatusId === "APPROVED") {
          return res.status(200).json({ message: "You cannot delete approved quotations." });
        }
      }

      next();
    } catch (err: any) {
      console.error("Delete quotation error:", err);
      return res.status(500).json({ message: "Failed to delete quotation." });
    }
  },
  ticketQuotationController.delete
);

export default ticketQuotationRouter;
