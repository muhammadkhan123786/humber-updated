import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { VenderDoc, Vender } from "../models/vender.models";
import { venderSchemaValidation } from "../schemas/vender.schema";
import { AdvancedGenericController } from "../controllers/GenericController";
import { genericProfileIdsMiddleware } from "../middleware/generic.profile.middleware";
import { saveOrUpdateVender } from "../controllers/vender.controller";

const venderRouter = Router();

const VenderServices = new GenericService<VenderDoc>(Vender);

const VenderController = new AdvancedGenericController({
  service: VenderServices,
  populate: ["userId", "personId", "addressId", "contactId"],
  validationSchema: venderSchemaValidation,
});

const venderProfileMiddleware = genericProfileIdsMiddleware<VenderDoc>(
  { targetModel: Vender },
  false
);

venderRouter.get("/", VenderController.getAll);
venderRouter.get("/:id", VenderController.getById);
venderRouter.post("/", saveOrUpdateVender);
venderRouter.put("/:id", saveOrUpdateVender);
venderRouter.delete("/:id", VenderController.delete);

export default venderRouter;
