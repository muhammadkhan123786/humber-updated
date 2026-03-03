import { Router } from "express";
import { GenericService } from "../../../services/generic.crud.services";
import { AdvancedGenericController } from "../../../controllers/GenericController";
import { CustomerBase, CustomerBaseDoc } from "../../../models/customer.models";
import { baseCustomerZodSchema } from "../../../schemas/base.customer.schema";
import { genericProfileIdsMiddleware } from "../../../middleware/generic.profile.middleware";
import { getCustomerDashboardSummary, getCustomerSummary, saveCustomer } from "../../../controllers/customer.controller";

const MobileCustomerBaseRouter = Router();

const CustomerBaseServices = new GenericService<CustomerBaseDoc>(CustomerBase);

const CustomerBaseController = new AdvancedGenericController({
  service: CustomerBaseServices,
  populate: [
    "userId",
    "personId",
    "addressId",
    "contactId",
    "sourceId",
    "accountId",
    {
      path: "addressId",
      populate: [{ path: "cityId" }, { path: "countryId" }],
    },
  ],
  validationSchema: baseCustomerZodSchema,
});

const customerProfileMiddleware = genericProfileIdsMiddleware<CustomerBaseDoc>({
  targetModel: CustomerBase,
});


// Correct order:
// MobileCustomerBaseRouter.get("/summary", getCustomerSummary);
// MobileCustomerBaseRouter.get("/summary/dashboard", getCustomerDashboardSummary);
// MobileCustomerBaseRouter.get("/", CustomerBaseController.getAll);
// MobileCustomerBaseRouter.get("/:id", CustomerBaseController.getById);

MobileCustomerBaseRouter.post("/", customerProfileMiddleware, saveCustomer);
// MobileCustomerBaseRouter.put("/:id", customerProfileMiddleware, saveCustomer);
// MobileCustomerBaseRouter.delete("/:id", CustomerBaseController.delete);

export default MobileCustomerBaseRouter;
