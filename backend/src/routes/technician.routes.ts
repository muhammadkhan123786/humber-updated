import { Router, Request, Response, NextFunction } from 'express';
import { GenericService } from '../services/generic.crud.services';
import { technicianInformationDoc, TechnicianProfileModel } from '../models/technicians.models';
import { createTechnicianSchema } from '../schemas/technician.profile.schema';
import { AdvancedGenericController } from '../controllers/GenericController';
import { genericProfileIdsMiddleware } from '../middleware/generic.profile.middleware';
import { createUploader, UploadedFiles } from '../config/multer';

const technicianRouter = Router();

// Configure file upload
const technicianUpload = createUploader([
    { name: 'profilePic', maxCount: 1, mimeTypes: ['image/jpeg', 'image/png'] },
    { name: 'documents', maxCount: 5, mimeTypes: ['application/pdf'] }
]);

// Services + Controller
const technicianServices = new GenericService<technicianInformationDoc>(TechnicianProfileModel);
const technicianController = new AdvancedGenericController({
    service: technicianServices,
    populate: ["userId", "personId", "addressId", "contactId", "roleId", "accountId"],
    validationSchema: createTechnicianSchema,
});

// Middleware to validate profile IDs
const technicianProfileMiddleware = genericProfileIdsMiddleware<technicianInformationDoc>({
    targetModel: TechnicianProfileModel
});

// Routes
technicianRouter.get("/", technicianController.getAll);
technicianRouter.get("/:id", technicianController.getById);

// POST route with middleware + upload
technicianRouter.post(
    "/",
    technicianProfileMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
        technicianUpload(req, res, (err: any) => {
            if (err) return res.status(400).json({ error: err.message });
            next();
        });
    },
    technicianController.create
);

// PUT route with middleware + upload
technicianRouter.put(
    "/:id",
    technicianProfileMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
        technicianUpload(req, res, (err: any) => {
            if (err) return res.status(400).json({ error: err.message });
            next();
        });
    },
    technicianController.update
);

technicianRouter.delete("/:id", technicianController.delete);

export default technicianRouter;
