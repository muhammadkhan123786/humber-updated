import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { vehicleInspectionsDoc, VehicleInspectionsByTechnicians } from "../../models/technician-vehicle-inspections-models/technician.vehicle.inspection.models";
import { CreateInspectionZodSchemaValidation } from "../../schemas/technicians-inspections-schema/technician.inspections.validations";
import { AdvancedGenericController } from "../../controllers/GenericController";

const vehicleInspectionsRouter = Router();

const vehicleInspectionsServices = new GenericService<vehicleInspectionsDoc>(VehicleInspectionsByTechnicians);

const vehicleInspectionsController = new AdvancedGenericController({
    service: vehicleInspectionsServices,
    populate: ["userId", "jobId", "tecnicianId"],
    validationSchema: CreateInspectionZodSchemaValidation,
    searchFields: ["jobId.jobId"]
});

vehicleInspectionsRouter.get("/", vehicleInspectionsController.getAll);
vehicleInspectionsRouter.get("/:id", vehicleInspectionsController.getById);
vehicleInspectionsRouter.post("/", vehicleInspectionsController.create);
vehicleInspectionsRouter.put("/:id", vehicleInspectionsController.update);
vehicleInspectionsRouter.delete("/:id", vehicleInspectionsController.delete);

export default vehicleInspectionsRouter;

