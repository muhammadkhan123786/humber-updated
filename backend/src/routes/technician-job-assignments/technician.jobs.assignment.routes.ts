import { NextFunction, Response, Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { technicianJobsAssignmentDoc, TechniciansJobsAssignment } from "../../models/technician-job-assignment/technician.jobs.assignment.models";
import { technicianJobSchemaValidation } from "../../schemas/job-assignment/job.assignment.validation";
import { AdvancedGenericController } from "../../controllers/GenericController";
import { TechnicianAuthRequest } from "../../middleware/auth.middleware";
import { getAllSharedJobsToAssignedByLeadingTechnicians, getAllTechnicianAssignments, getAvailableTechniciansForJob } from "../../controllers/technician-jobs-assignment-controller/technician.jobs.assignment.controller";

const jobAssignmentRouter = Router();

const jobAssignmentServices = new GenericService<technicianJobsAssignmentDoc>(TechniciansJobsAssignment);

const jobAssignmentController = new AdvancedGenericController({
  service: jobAssignmentServices,
  populate: [
    "userId",
    "jobId",
    {path:"technicianId",select:"personId contactId employeeId",populate:[{path:"personId",select:"firstName lastName"},{path:"contactId",select:"phoneNumber mobileNumber"}]},
    {path:"assignedBy",select:"personId contactId",populate:[{path:"personId",select:"firstName lastName"},{path:"contactId",select:"phoneNumber mobileNumber"}]},
    {
      path: "jobId",
      select: "ticketId jobId jobStatusId",
      populate: {
        path: "ticketId",
        select: "customerId ticketCode priorityId vehicleId ticketStatusId",
        populate: [
          {path:"ticketStatusId",select:"code"},
          {
            path:"vehicleId",
            select:"productName vehicleType vehicleModelId serialNumber",
            populate:[{path:"vehicleModelId",select:"modelName"}],
          },
          {
            path: "customerId",
            select: "personId addressId contactId",
            populate: [{
              path: "personId",
              select: "firstName lastName",
            },{path:"contactId",select:"phoneNumber mobileNumber"},{path:"addressId",select:"address zipCode"}],
          },
          {
            path: "priorityId",
            select: "serviceRequestPrioprity",
          },
        ],
      },
    },
  ],
  validationSchema: technicianJobSchemaValidation,
});

jobAssignmentRouter.get("/", getAllTechnicianAssignments);
jobAssignmentRouter.get('/getavailabletechniciansforjob',getAvailableTechniciansForJob);
jobAssignmentRouter.get('/getmysharedjobsassignedbyleadingtechnicians',getAllSharedJobsToAssignedByLeadingTechnicians); 

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

