import { createProductValidation } from './../schemas/product.schema';
import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { ProductDoc, ProductModal } from '../models/product.models';
import { AdvancedGenericController } from "../controllers/GenericController";

const productRoutes = Router();

const productsBaseService = new GenericService<ProductDoc>(ProductModal);

const productController = new AdvancedGenericController({
    service: productsBaseService,
    populate: ["userId"],
    validationSchema: createProductValidation, 
});

productRoutes.get("/", productController.getAll);
productRoutes.get("/:id", productController.getById);
productRoutes.post("/", productController.create);
productRoutes.put("/:id", productController.update);
productRoutes.delete("/:id", productController.delete);

export default productRoutes;