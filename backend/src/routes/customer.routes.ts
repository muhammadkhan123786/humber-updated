

import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { CustomerBaseDoc, CustomerBase } from "../models/customer.models";
import { technicianRoleCreateSchema } from "../schemas/technician.roles.schema";
import { AdvancedGenericController } from "../controllers/GenericController";
import { CreateOrUpdateCustomerMiddleware } from "../middleware/customer.middleware";
import { saveCustomer } from "../controllers/customer.controller";

const CustomerBaseRouter = Router();

const CustomerBaseServices = new GenericService<CustomerBaseDoc>(CustomerBase);

const CustomerBaseController = new AdvancedGenericController({
    service: CustomerBaseServices,
    populate: ["userId", "personId", "addressId", "contactId", "sourceId"],
    validationSchema: technicianRoleCreateSchema,
});

CustomerBaseRouter.get("/", CustomerBaseController.getAll);
CustomerBaseRouter.get("/:id", CustomerBaseController.getById);
CustomerBaseRouter.post("/", CreateOrUpdateCustomerMiddleware, saveCustomer);
CustomerBaseRouter.put("/:id", CustomerBaseController.update);
CustomerBaseRouter.delete("/:id", CustomerBaseController.delete);

export default CustomerBaseRouter;

