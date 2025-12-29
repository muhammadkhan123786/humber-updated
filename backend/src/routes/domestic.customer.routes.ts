import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { DomesticCustomer, DomesticCustomerDoc } from "../models/domestic.customer.models";
import { domesticCustomerSchema } from "../schemas/domestic.customer.schema";
import { AdvancedGenericController } from "../controllers/GenericController";
import { domesticCustomerMiddleware } from "../middleware/domestic.customer.middleware";

const DomesticCustomerRouter = Router();

const DomesticCustomerServices = new GenericService<DomesticCustomerDoc>(DomesticCustomer);

const DomesticCustomerController = new AdvancedGenericController({
    service: DomesticCustomerServices,
    populate: ["userId", "personId", "addressId", "contactId", "sourceId"],
    validationSchema: domesticCustomerSchema,
});

DomesticCustomerRouter.get("/", DomesticCustomerController.getAll);
DomesticCustomerRouter.get("/:id", DomesticCustomerController.getById);
DomesticCustomerRouter.post("/", domesticCustomerMiddleware, DomesticCustomerController.create);
DomesticCustomerRouter.put("/:id", domesticCustomerMiddleware, DomesticCustomerController.update);
DomesticCustomerRouter.delete("/:id", DomesticCustomerController.delete);

export default DomesticCustomerRouter;
