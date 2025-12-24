import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { CustomPersonalInfo, CustomPersonalInfoDoc } from "../models/customer.models";
import { customerSchema } from "../schemas/customer.schema";
import { AdvancedGenericController } from "../controllers/GenericController";

const customerRouter = Router();

const customerServices = new GenericService<CustomPersonalInfoDoc>(CustomPersonalInfo);

const customerController = new AdvancedGenericController({
    service: customerServices,
    populate: "userId",
    validationSchema: customerSchema,
});

customerRouter.get("/", customerController.getAll);
customerRouter.get("/:id", customerController.getById);
customerRouter.post("/", customerController.create);
customerRouter.put("/:id", customerController.update);
customerRouter.delete("/:id", customerController.delete);

export default customerRouter;
