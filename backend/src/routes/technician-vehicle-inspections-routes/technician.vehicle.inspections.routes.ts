import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { vehicleInspectionsDoc, VehicleInspectionsByTechnicians } from "../../models/technician-vehicle-inspections-models/technician.vehicle.inspection.models";
import { CreateInspectionZodSchemaValidation } from "../../schemas/technicians-inspections-schema/technician.inspections.validations";
import { AdvancedGenericController } from "../../controllers/GenericController";
import { TechnicianAuthRequest } from "../../middleware/auth.middleware";
import { checkInspectionExists } from "../../middleware/create-inspection-middlware/create.update.inspection.middleware";
import { getInspectionByJobId } from "../../controllers/inspection-controller/technician.inspection.controller";

const vehicleInspectionsRouter = Router();

const vehicleInspectionsServices = new GenericService<vehicleInspectionsDoc>(VehicleInspectionsByTechnicians);

const vehicleInspectionsController = new AdvancedGenericController({
    service: vehicleInspectionsServices,
    populate: ["userId", "jobId", "tecnicianId"],
    validationSchema: CreateInspectionZodSchemaValidation,
    searchFields: ["jobId.jobId"]
});

//inspections by job id 
vehicleInspectionsRouter.get('/inspectionbyjobid',getInspectionByJobId);

vehicleInspectionsRouter.get("/", vehicleInspectionsController.getAll);
vehicleInspectionsRouter.get("/:id", vehicleInspectionsController.getById);
vehicleInspectionsRouter.post("/",checkInspectionExists,async(req:TechnicianAuthRequest,res,next)=> {
    req.body.technicianId = req.technicianId; // Assuming you have userId from authentication middleware
    req.body.userId = req.user.userId; // Assuming you have userId from authentication middleware
    
  next();
},vehicleInspectionsController.create);
vehicleInspectionsRouter.put("/:id",async(req:TechnicianAuthRequest,res,next)=> {
    console.log("PUT request body:", req.body); // Debugging log
    req.body.technicianId = req.technicianId; // Assuming you have userId from authentication middleware
    req.body.userId = req.user.userId; // Assuming you have userId from authentication middleware
    
  next();
}, vehicleInspectionsController.update);
vehicleInspectionsRouter.delete("/:id", vehicleInspectionsController.delete);

export default vehicleInspectionsRouter;

