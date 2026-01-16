import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { Icons, iconDoc } from "../../models/master-data-models/icons.models";
import { iconSchemaValidation } from "../../schemas/master-data/icons.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";
import { createUploader } from "../../config/multer";
import { mapUploadedFilesToBody } from "../../middleware/mapUploadedFiles";

const iconUpload = createUploader([
    {
        name: "icon",
        maxCount: 1,
        mimeTypes: ["image/jpeg", "image/png"],
    }
]);
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
iconsRouter.post("/", iconUpload, mapUploadedFilesToBody(), iconsController.create);
iconsRouter.put("/:id", iconUpload, mapUploadedFilesToBody(), iconsController.update);
iconsRouter.delete("/:id", iconsController.delete);

export default iconsRouter;

