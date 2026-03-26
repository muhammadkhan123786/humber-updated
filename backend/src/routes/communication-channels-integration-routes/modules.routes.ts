import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import {
  moduleDoc,
  Modules,
} from "../../models/communication-channel-models/module.models";
import { modulesValidation } from "../../schemas/communication-channels-integration-schema/module.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";

const moduleRouter = Router();

const moduleServices = new GenericService<moduleDoc>(Modules);

const modulesController = new AdvancedGenericController({
  service: moduleServices,

  validationSchema: modulesValidation,
  searchFields: ["moduleName"],
});

moduleRouter.get("/", modulesController.getAll);
moduleRouter.get("/:id", modulesController.getById);
moduleRouter.post("/", modulesController.create);
moduleRouter.put("/:id", modulesController.update);
moduleRouter.delete("/:id", modulesController.delete);

export default moduleRouter;
