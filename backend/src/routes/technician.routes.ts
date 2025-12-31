import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { technicianInformationDoc, TechnicianProfileModel } from "../models/technicians.models";
import { createTechnicianSchema } from "../schemas/technician.profile.schema";
import { AdvancedGenericController } from "../controllers/GenericController";
import { genericProfileIdsMiddleware } from "../middleware/generic.profile.middleware";
import { createUploader } from "../config/multer";
const technicianRouter = Router();

const technicianUpload = createUploader([
    {
        name: 'profilePic',
        maxCount: 1,
        mimeTypes: ['image/jpeg', 'image/png']
    },
    {
        name: 'documents',
        maxCount: 5,
        mimeTypes: ['application/pdf']
    }
]);

const technicianServices = new GenericService<technicianInformationDoc>(TechnicianProfileModel);

const technicianController = new AdvancedGenericController({
    service: technicianServices,
    populate: ["userId", "personId", "addressId", "contactId", "roleId", "accountId"],
    validationSchema: createTechnicianSchema,
});

technicianRouter.get("/", technicianController.getAll);
technicianRouter.get("/:id", technicianController.getById);
technicianRouter.post("/", genericProfileIdsMiddleware, technicianUpload, technicianController.create);
technicianRouter.put("/:id", genericProfileIdsMiddleware, technicianUpload, technicianController.update);
technicianRouter.delete("/:id", technicianController.delete);

export default technicianRouter;

