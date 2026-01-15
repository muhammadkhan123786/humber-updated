import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { Icons, iconDoc } from "../../models/master-data-models/icons.models";
import { iconSchemaValidation } from "../../schemas/master-data/icons.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";

const iconsRouter = Router();

const iconServices = new GenericService<iconDoc>(Icons);

const iconsController = new AdvancedGenericController({
    service: iconServices,
    populate: ["userId"],
    validationSchema: iconSchemaValidation,
    searchFields: ["iconName"]
});

iconsRouter.get("/", iconsController.getAll);
iconsRouter.get("/:id", iconsController.getById);
iconsRouter.post("/", iconsController.create);
iconsRouter.put("/:id", iconsController.update);
iconsRouter.delete("/:id", iconsController.delete);

export default iconsRouter;

