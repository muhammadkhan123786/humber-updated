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
import { generateTicketCode } from "../../utils/generateTicketCode";
import { normalizeArrays } from "../../middleware/normalizeArrays";

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
  populate: ["userId", "assignedTechnicianId", "vehicleId", "priorityId", "ticketStatusId"],
  validationSchema: customerTicketBaseSchemaValidation,
  searchFields: ["ticketCode"],
});

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
      console.log("[TICKET POST] ===== REQUEST RECEIVED =====");
      console.log("[TICKET POST] req.files:", req.files);
      console.log("[TICKET POST] req.body keys:", Object.keys(req.body || {}));
      console.log("[TICKET POST] Full req.body:", req.body);

      console.log(
        "[TICKET POST] Request body keys:",
        Object.keys(req.body || {}),
      );
      console.log("[TICKET POST] Received ticketCode:", req.body?.ticketCode);
      console.log(
        "[TICKET POST] vehicleRepairImages:",
        req.body?.vehicleRepairImages,
      );

      if (!req.body?.ticketCode) {
        const code = await generateTicketCode();
        if (!req.body) req.body = {};
        req.body.ticketCode = code;
        console.log("[TICKET POST] Generated ticketCode:", code);
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
  customerTicketBaseController.update,
);
customerTicketBaseRouter.delete("/:id", customerTicketBaseController.delete);

export default customerTicketBaseRouter;
