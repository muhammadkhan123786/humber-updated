import { NextFunction, Response, Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { technicianJobsAssignmentDoc, TechniciansJobsAssignment } from "../../models/technician-job-assignment/technician.jobs.assignment.models";
import { technicianJobSchemaValidation } from "../../schemas/job-assignment/job.assignment.validation";
import { AdvancedGenericController } from "../../controllers/GenericController";
import { TechnicianAuthRequest } from "../../middleware/auth.middleware";
import { getAllTechnicianAssignments, getAvailableTechniciansForJob } from "../../controllers/technician-jobs-assignment-controller/technician.jobs.assignment.controller";

const jobAssignmentRouter = Router();

const jobAssignmentServices = new GenericService<technicianJobsAssignmentDoc>(TechniciansJobsAssignment);

const jobAssignmentController = new AdvancedGenericController({
    service: jobAssignmentServices,
    populate: ["userId","jobId","technicianId","assignedBy"],
    validationSchema:technicianJobSchemaValidation,
});

jobAssignmentRouter.get("/", getAllTechnicianAssignments);
jobAssignmentRouter.get('/getavailabletechniciansforjob',getAvailableTechniciansForJob)

jobAssignmentRouter.get("/:id", jobAssignmentController.getById);
jobAssignmentRouter.post("/",async(req:TechnicianAuthRequest,res:Response,next:NextFunction)=>{
     if(req.body.jobStatus === "IN_PROGRESS") {
        req.body.acceptedAt = new Date();
       }
       if (req.body.jobStatus === "COMPLETED") {
             req.body.completedAt = new Date();
        }
     if(req.technicianId)
     {
        req.body.assignedBy=req.technicianId;
        
     }
     req.body.userId = req.user.userId;
     next();
    
}, jobAssignmentController.create);

jobAssignmentRouter.put("/:id",async(req:TechnicianAuthRequest,res:Response,next:NextFunction)=>{
     if(req.body.jobStatus === "IN_PROGRESS") {
        req.body.acceptedAt = new Date();
       }
       if (req.body.jobStatus === "COMPLETED") {
             req.body.completedAt = new Date();
        }
     if(req.technicianId)
     {
        req.body.assignedBy=req.technicianId;
        
     }
     req.body.userId = req.user.userId;
     next();
    
}, jobAssignmentController.update);
jobAssignmentRouter.delete("/:id", jobAssignmentController.delete);

export default jobAssignmentRouter;

