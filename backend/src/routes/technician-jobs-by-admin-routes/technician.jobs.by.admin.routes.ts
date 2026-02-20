import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import {
  technicianJobsByAdminDoc,
  TechnicianJobsByAdmin,
} from "../../models/techncian-jobs-by-admin-models/technician.jobs.by.admin.models";
import { technicianJobsByAdminValidation } from "../../schemas/technicians-jobs-by-admin/technician.jobs.by.admin.validations";
import { AdvancedGenericController } from "../../controllers/GenericController";
import {
  adminProtecter,
  technicianProtecter,
} from "../../middleware/auth.middleware";

const techncianJobsByAdminRouter = Router();

const techncianJobsByAdminServices =
  new GenericService<technicianJobsByAdminDoc>(TechnicianJobsByAdmin);

const techncianJobsByAdminController = new AdvancedGenericController({
  service: techncianJobsByAdminServices,
  populate: [
    {
      path: "userId",
      select: "email role",
    },
    {
      path: "ticketId",
      populate: [
        {
          path: "customerId",
          populate: [
            { path: "personId" },
            { path: "addressId" },
            { path: "contactId" },
          ],
        },
        {
          path: "vehicleId",
          populate: [
            { path: "vehicleBrandId" },
            { path: "vehicleModelId" },
            { path: "colorId" },
          ],
        },
        { path: "ticketStatusId" },
        { path: "priorityId" },
      ],
    },
    {
      path: "leadingTechnicianId",
      populate: [
        { path: "personId" },
        { path: "addressId" },
        { path: "contactId" },
      ],
    },
    { path: "quotationId" },
  ],
  validationSchema: technicianJobsByAdminValidation,
  searchFields: ["jobId", "partNumber"],
});
techncianJobsByAdminRouter.get(
  "/",
  technicianProtecter,
  techncianJobsByAdminController.getAll,
);
techncianJobsByAdminRouter.get(
  "/:id",
  technicianProtecter,
  techncianJobsByAdminController.getById,
);
techncianJobsByAdminRouter.post(
  "/",
  adminProtecter,
  techncianJobsByAdminController.create,
);
techncianJobsByAdminRouter.put(
  "/:id",
  adminProtecter,
  techncianJobsByAdminController.update,
);
techncianJobsByAdminRouter.delete(
  "/:id",
  adminProtecter,
  techncianJobsByAdminController.delete,
);

export default techncianJobsByAdminRouter;
