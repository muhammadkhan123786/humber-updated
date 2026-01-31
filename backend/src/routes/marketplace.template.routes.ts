import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { AdvancedGenericController } from "../controllers/GenericController";

import {
  MarketplaceTemplateDoc,
  MarketplaceTemplateModel,
} from "../models/marketplace.template.model";

import {
  marketplaceTemplateSchemaValidation,
} from "../schemas/marketplace.template.schema";

const marketplaceTemplateRoutes = Router();

const marketplaceTemplateService =
  new GenericService<MarketplaceTemplateDoc>(MarketplaceTemplateModel);

const marketplaceTemplateController = new AdvancedGenericController({
  service: marketplaceTemplateService,
  populate: ["userId","icon", "color"],
  validationSchema: marketplaceTemplateSchemaValidation,
});

marketplaceTemplateRoutes.get("/", marketplaceTemplateController.getAll);
marketplaceTemplateRoutes.get("/:id", marketplaceTemplateController.getById);
marketplaceTemplateRoutes.post("/", marketplaceTemplateController.create);
marketplaceTemplateRoutes.put("/:id", marketplaceTemplateController.update);
marketplaceTemplateRoutes.delete("/:id", marketplaceTemplateController.delete);

export default marketplaceTemplateRoutes;
