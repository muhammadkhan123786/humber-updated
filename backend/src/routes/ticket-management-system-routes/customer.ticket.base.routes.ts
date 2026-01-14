import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import {
    customerTicketBaseDoc,
    customerTicketBase,
} from "../../models/ticket-management-system-models/customer.ticket.base.models";
import { customerTicketBaseSchemaValidation } from "../../schemas/ticket-management-system-schemas/ticket.base.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";
import { createUploader } from "../../config/multer";
import { mapUploadedFilesToBody } from "../../middleware/mapUploadedFiles";
import { handleVehicleVideoUpload } from "../../middleware/uploadVehicleVideo";

const repairVehicleUpload = createUploader([
    { name: 'vehicleRepairImages', maxCount: 1000, mimeTypes: ['image/jpeg', 'image/png'] },

]);

const customerTicketBaseRouter = Router();

const customerTicketServices = new GenericService<customerTicketBaseDoc>(customerTicketBase);

const customerTicketBaseController = new AdvancedGenericController({
    service: customerTicketServices,
    populate: ["userId"],
    validationSchema: customerTicketBaseSchemaValidation,
    searchFields: ["ticketCode"],
});


customerTicketBaseRouter.get("/", customerTicketBaseController.getAll);
customerTicketBaseRouter.get("/:id", customerTicketBaseController.getById);
customerTicketBaseRouter.post("/", repairVehicleUpload, mapUploadedFilesToBody(), handleVehicleVideoUpload("vehicleRepairVideo"), customerTicketBaseController.create);
customerTicketBaseRouter.put("/:id", repairVehicleUpload, mapUploadedFilesToBody(), handleVehicleVideoUpload("vehicleRepairVideo"), customerTicketBaseController.update);
customerTicketBaseRouter.delete("/:id", customerTicketBaseController.delete);

export default customerTicketBaseRouter;
