import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { VenderDoc, Vender } from "../models/vender.models";
import { venderSchemaValidation } from "../schemas/vender.schema";
import { AdvancedGenericController } from "../controllers/GenericController";
import { saveCustomer } from "../controllers/customer.controller";
import { genericProfileIdsMiddleware } from "../middleware/generic.profile.middleware";

const venderRouter = Router();

const VenderServices = new GenericService<VenderDoc>(Vender);

const VenderController = new AdvancedGenericController({
    service: VenderServices,
    populate: ["userId", "personId", "addressId", "contactId", "sourceId"
        {
            path: "addressId",
            populate: [
                { path: "cityId" },
                { path: "countryId" }
            ]
        }],
    validationSchema: venderSchemaValidation,
});

const customerProfileMiddleware = genericProfileIdsMiddleware<VenderDoc>({ targetModel: Vender }, false);

venderRouter.get("/", VenderController.getAll);
venderRouter.get("/:id", VenderController.getById);
venderRouter.post("/", customerProfileMiddleware, saveCustomer);
venderRouter.post("/:id", customerProfileMiddleware, saveCustomer);
venderRouter.delete("/:id", VenderController.delete);

export default venderRouter;

