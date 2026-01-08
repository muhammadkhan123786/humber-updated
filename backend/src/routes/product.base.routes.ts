import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { productDoc, ProductBasic } from "../models/product.basic.models";
import { productBasicSchemaValidation } from "../schemas/product.basic.schema";
import { AdvancedGenericController } from "../controllers/GenericController";

const productBaseRoute = Router();

const productBaseService = new GenericService<productDoc>(ProductBasic);

const productSourceController = new AdvancedGenericController({
    service: productBaseService,
    populate: ["userId"],
    validationSchema: productBasicSchemaValidation,
    searchFields: ["productName"]
});


productBaseRoute.get("/", productSourceController.getAll);
productBaseRoute.get("/:id", productSourceController.getById);
productBaseRoute.post("/", productSourceController.create);
productBaseRoute.put("/:id", productSourceController.update);
productBaseRoute.delete("/:id", productSourceController.delete);

export default productBaseRoute;
