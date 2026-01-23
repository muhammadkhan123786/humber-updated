import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { technicianInspectionList, technicianInspectionListTypeDoc } from "../../models/master-data-models/technician.inspection.list.models";
import { technicianInspectionListValidation } from "../../schemas/master-data/technician.inspection.list.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";

const technicianInspectionListRouter = Router();

const technicianInspectionListServices = new GenericService<technicianInspectionListTypeDoc>(technicianInspectionList);

const technicianInspectionListController = new AdvancedGenericController({
    service: technicianInspectionListServices,
    populate: ["userId"],
    validationSchema: technicianInspectionListValidation,
    searchFields: ["technicianInspection"]
});

technicianInspectionListRouter.get("/", technicianInspectionListController.getAll);
technicianInspectionListRouter.get("/:id", technicianInspectionListController.getById);
technicianInspectionListRouter.post("/", technicianInspectionListController.create);
technicianInspectionListRouter.put("/:id", technicianInspectionListController.update);
technicianInspectionListRouter.delete("/:id", technicianInspectionListController.delete);

export default technicianInspectionListRouter;

