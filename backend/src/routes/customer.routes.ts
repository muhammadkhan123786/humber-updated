import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { CustomerBaseDoc, CustomerBase } from "../models/customer.models";
import { baseCustomerZodSchema } from "../schemas/base.customer.schema";
import { AdvancedGenericController } from "../controllers/GenericController";
import { saveCustomer } from "../controllers/customer.controller";
import { genericProfileIdsMiddleware } from "../middleware/generic.profile.middleware";

const CustomerBaseRouter = Router();

const CustomerBaseServices = new GenericService<CustomerBaseDoc>(CustomerBase);

const CustomerBaseController = new AdvancedGenericController({
    service: CustomerBaseServices,
    populate: ["userId", "personId", "addressId", "contactId", "sourceId", "accountId",
        {
            path: "addressId",
            populate: [
                { path: "cityId" },
                { path: "countryId" }
            ]
        }],
    validationSchema: baseCustomerZodSchema,

});

const customerProfileMiddleware = genericProfileIdsMiddleware<CustomerBaseDoc>({ targetModel: CustomerBase });

CustomerBaseRouter.get("/", CustomerBaseController.getAll);
CustomerBaseRouter.get("/:id", CustomerBaseController.getById);
CustomerBaseRouter.post("/", customerProfileMiddleware, saveCustomer);
CustomerBaseRouter.post("/:id", customerProfileMiddleware, saveCustomer);
CustomerBaseRouter.delete("/:id", CustomerBaseController.delete);

export default CustomerBaseRouter;

