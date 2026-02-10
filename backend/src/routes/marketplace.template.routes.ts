import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { AdvancedGenericController } from "../controllers/GenericController";
import { MarketplaceController } from "../controllers/marketplace.controller";


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
const marketplaceController = new MarketplaceController(marketplaceTemplateService);
const marketplaceTemplateController = new AdvancedGenericController({
  service: marketplaceTemplateService,
  populate: ["userId",
    {
      path: "icon", select: "_id icon"
    }
    , "color"],
  validationSchema: marketplaceTemplateSchemaValidation,
});

marketplaceTemplateRoutes.get("/", marketplaceTemplateController.getAll);
marketplaceTemplateRoutes.get("/:id", marketplaceTemplateController.getById);
marketplaceTemplateRoutes.post("/", marketplaceTemplateController.create);
marketplaceTemplateRoutes.put("/:id", marketplaceTemplateController.update);
marketplaceTemplateRoutes.delete("/:id", marketplaceTemplateController.delete);

marketplaceTemplateRoutes.patch("/:id/toggle-active", marketplaceController.toggleActive);
marketplaceTemplateRoutes.patch("/:id/set-default", marketplaceController.setDefault);
marketplaceTemplateRoutes.patch("/bulk-update", marketplaceController.bulkUpdate);

export default marketplaceTemplateRoutes;
