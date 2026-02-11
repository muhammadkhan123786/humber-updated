import { NextFunction, Request, Response, Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { ticketQuatationDoc, TicketQuations } from "../../models/ticket-quation-models/ticket.quotation.models";
import { ticketQuotationValidation } from "../../schemas/ticket-quation-schemas/ticket.quotation.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";
import { technicianMasterProtector, technicianProtecter } from "../../middleware/auth.middleware";
import { technicianTicketsQuotationsController } from "../../controllers/technician-dashboard-controllers/technician.quotations.controller";
import { generateQuotationCode } from "../../utils/generate.AutoCode.Counter";

const ticketQuotationRouter = Router();

const ticketQuotationServices = new GenericService<ticketQuatationDoc>(TicketQuations);

const ticketQuotationController = new AdvancedGenericController({
    service: ticketQuotationServices,
    populate: ["userId","technicianId","ticketId","quotationStatusId","partsList"],
    validationSchema: ticketQuotationValidation,
    searchFields: ["quotationAutoId"]
});


ticketQuotationRouter.get("/", technicianProtecter, technicianTicketsQuotationsController);
ticketQuotationRouter.get("/:id", ticketQuotationController.getById);
ticketQuotationRouter.post("/",async (req, res, next) => {
       try {
        const quotationId = await generateQuotationCode();
        req.body.quotationAutoId = quotationId;
      } catch (err) {
        console.error("Failed to generate quotation ID", err);
        return res.status(500).json({ message: "Failed to generate quotation ID" });
      }
    
    next();
  }, technicianMasterProtector,(req:Request,res:Response,next:NextFunction)=>{
    console.log("Create Ticket Quotation Request Body:", req.body);
      const newUserId = req.body.userId;
      req.body.userId = req.body.technicianId;
      req.body.technicianId = newUserId;
      console.log("Modified Request Body for Ticket Quotation Creation:", req.body);
    next();
  }, ticketQuotationController.create);
ticketQuotationRouter.put("/:id", technicianMasterProtector, (req:Request,res:Response,next:NextFunction)=>{
    console.log("Update Ticket Quotation Request Body:", req.body);
    console.log("Parts list being updated:", req.body.partsList);
    console.log("Parts list length:", req.body.partsList?.length);
    console.log("Parts list array:", JSON.stringify(req.body.partsList, null, 2));
      const newUserId = req.body.userId;
      req.body.userId = req.body.technicianId;
      req.body.technicianId = newUserId;
      console.log("Modified Request Body for Ticket Quotation Update:", req.body);
    next();
  }, ticketQuotationController.update);
ticketQuotationRouter.delete("/:id", ticketQuotationController.delete);

export default ticketQuotationRouter;

