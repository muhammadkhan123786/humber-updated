import { Request, Response, NextFunction, Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import {
  customerTicketBaseDoc,
  customerTicketBase,
} from "../../models/ticket-management-system-models/customer.ticket.base.models";
import { customerTicketBaseSchemaValidation } from "../../schemas/ticket-management-system-schemas/ticket.base.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";
import { createUploader } from "../../config/multer";
import { mapUploadedFilesToBody } from "../../middleware/mapUploadedFiles";
import { generateTicketCode } from "../../utils/generate.AutoCode.Counter";
import { normalizeArrays } from "../../middleware/normalizeArrays";
import {
  getTicketCountByStatus,
  getUnassignedTickets,
} from "../../controllers/customer.ticket.controllet";

const repairVehicleUpload = createUploader([
  {
    name: "vehicleRepairImagesFile",
    maxCount: 1000,
    mimeTypes: ["image/jpeg", "image/png"],
  },
  {
    name: "vehicleRepairVideo",
    maxCount: 1,
    mimeTypes: [
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-matroska",
    ],
  },
]);

const customerTicketBaseRouter = Router();

const customerTicketServices = new GenericService<customerTicketBaseDoc>(
  customerTicketBase,
);

const customerTicketBaseController = new AdvancedGenericController({
  service: customerTicketServices,
  populate: [
    "userId",
    "assignedTechnicianId",
    "vehicleId",
    "priorityId",
    "ticketStatusId",
    {
      path: "customerId",
      populate: {
        path: "personId",
      },
    },
    {
      path: "assignedTechnicianId",
      populate: [{ path: "personId" }],
    },
    {
      path: "vehicleId",
      populate: [{ path: "vehicleBrandId" }, { path: "vehicleModelId" }],
    },
    {
      path: "customerId",
      populate: [
        { path: "personId" },
        { path: "addressId" },
        { path: "contactId" },
      ],
    },
    {
      path: "investigationParts.partId",
    },
  ],
  validationSchema: customerTicketBaseSchemaValidation,
  searchFields: ["ticketCode"],
});

customerTicketBaseRouter.get(
  "/unassigned-technician-tickets",
  getUnassignedTickets,
);
customerTicketBaseRouter.get(
  "/ticket-count-status-wise",
  getTicketCountByStatus,
);

customerTicketBaseRouter.get("/", customerTicketBaseController.getAll);
customerTicketBaseRouter.get("/:id", customerTicketBaseController.getById);
customerTicketBaseRouter.post(
  "/",
  repairVehicleUpload,
  mapUploadedFilesToBody("/uploads", {
    vehicleRepairImagesFile: "vehicleRepairImages",
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const code = await generateTicketCode();
      if (!req.body) req.body = {};
      req.body.ticketCode = code;
      req.body.purchaseDate = new Date(req.body.purchaseDate);
      console.log("Body Report: ", req.body);
      if (typeof req.body.investigationParts === "string") {
        try {
          req.body.investigationParts = JSON.parse(req.body.investigationParts);
        } catch {
          return res
            .status(400)
            .json({ message: "Invalid investigationParts JSON" });
        }
      }

      if (req.body.isEmailSendReport !== undefined) {
        req.body.isEmailSendReport =
          req.body.isEmailSendReport === "true" ||
          req.body.isEmailSendReport === true;
      }

      next();
    } catch (error) {
      console.error("[TICKET POST ERROR]:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to generate ticket code" });
    }
  },
  customerTicketBaseController.create,
);

customerTicketBaseRouter.put(
  "/:id",
  repairVehicleUpload,
  mapUploadedFilesToBody("/uploads", {
    vehicleRepairImagesFile: "vehicleRepairImages",
  }),
  normalizeArrays(["vehicleRepairImages"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body) req.body = {};

      if (req.body.purchaseDate) {
        req.body.purchaseDate = new Date(req.body.purchaseDate);
      }

      if (typeof req.body.investigationParts === "string") {
        try {
          req.body.investigationParts = JSON.parse(req.body.investigationParts);
        } catch {
          return res
            .status(400)
            .json({ message: "Invalid investigationParts JSON" });
        }
      }

      if (req.body.isEmailSendReport !== undefined) {
        req.body.isEmailSendReport =
          req.body.isEmailSendReport === "true" ||
          req.body.isEmailSendReport === true;
      }

      next();
    } catch (error) {
      console.error("[TICKET PUT ERROR]:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update ticket" });
    }
  },
  customerTicketBaseController.update,
);

customerTicketBaseRouter.delete("/:id", customerTicketBaseController.delete);

export default customerTicketBaseRouter;
