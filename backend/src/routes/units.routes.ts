import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { unitDoc, Unit } from "../models/unit.models";
import { unitSchemaSchemaValidation } from "../schemas/unit.schema";
import { AdvancedGenericController } from "../controllers/GenericController";

const unitRouter = Router();

const unitServices = new GenericService<unitDoc>(Unit);

const unitController = new AdvancedGenericController({
    service: unitServices,
    populate: ["userId"],
    validationSchema: unitSchemaSchemaValidation,
});


unitRouter.get("/", unitController.getAll);
unitRouter.get("/:id", unitController.getById);
unitRouter.post("/", unitController.create);
unitRouter.put("/:id", unitController.update);
unitRouter.delete("/:id", unitController.delete);

export default unitRouter;

