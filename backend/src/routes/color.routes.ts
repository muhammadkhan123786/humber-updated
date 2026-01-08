import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { Color, colorDoc } from "../models/color.models";
import { colorSchemaValidation } from "../schemas/color.schema";
import { AdvancedGenericController } from "../controllers/GenericController";

const colorRouter = Router();

const colorServices = new GenericService<colorDoc>(Color);

const colorController = new AdvancedGenericController({
    service: colorServices,
    populate: ["userId"],
    validationSchema: colorSchemaValidation,
    searchFields: ["colorName"]
});

colorRouter.get("/", colorController.getAll);
colorRouter.get("/:id", colorController.getById);
colorRouter.post("/", colorController.create);
colorRouter.put("/:id", colorController.update);
colorRouter.delete("/:id", colorController.delete);

export default colorRouter;

