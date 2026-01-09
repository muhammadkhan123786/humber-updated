import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import {
  departmentDoc,
  Department,
} from "../../models/ticket-management-system-models/department.models";
import { departmentSchemaValidation } from "../../schemas/ticket-management-system-schemas/department.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";

const departmentRouter = Router();

const departmentServices = new GenericService<departmentDoc>(Department);

const departmentController = new AdvancedGenericController({
  service: departmentServices,
  populate: ["userId"],
  validationSchema: departmentSchemaValidation,
  searchFields: ["departmentName"],
});

departmentRouter.get("/", departmentController.getAll);
departmentRouter.get("/:id", departmentController.getById);
departmentRouter.post("/", departmentController.create);
departmentRouter.put("/:id", departmentController.update);
departmentRouter.delete("/:id", departmentController.delete);

export default departmentRouter;
