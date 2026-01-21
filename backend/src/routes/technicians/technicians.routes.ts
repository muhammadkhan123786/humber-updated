import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { technicianDoc, Technicians } from "../../models/technician-models/technician.models";
import { TECHNICIAN_SCHEMA_Validation } from "../../schemas/technicians/technicians.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";
import { genericProfileIdsMiddleware } from "../../middleware/generic.profile.middleware";
import { getTechnicianDashboardSummary } from "../../controllers/technician.statis.controller";

const techniciansRouter = Router();

const technicianServices = new GenericService<technicianDoc>(Technicians);

const technicianController = new AdvancedGenericController({
    service: technicianServices,
    populate: ["userId", "personId", "addressId", "contactId", "contractTypeId", "accountId",
        "departmentId", "specializationIds",
        {
            path: "addressId",
            populate: [
                { path: "cityId" },
                { path: "countryId" }
            ]
        }],
    searchFields: ["personId.firstName", "personId.middleName"],
    validationSchema: TECHNICIAN_SCHEMA_Validation,

});


const technicianProfileMiddleware = genericProfileIdsMiddleware<technicianDoc>({ targetModel: Technicians });


// Correct order:
techniciansRouter.get('/summary', getTechnicianDashboardSummary);
techniciansRouter.get("/", technicianController.getAll);
techniciansRouter.get("/:id", technicianController.getById);
techniciansRouter.post("/", technicianProfileMiddleware, technicianController.create);
techniciansRouter.put("/:id", technicianProfileMiddleware, technicianController.update);
techniciansRouter.delete("/:id", technicianController.delete);


export default techniciansRouter;

