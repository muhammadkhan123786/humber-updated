import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { VechicleBrand, VehicleBrandDoc } from "../models/vehicleBrand.models";
import { vehicleBrandCreateSchema } from "../schemas/vehicleBrand.schema";
import { AdvancedGenericController } from "../controllers/GenericController";

const router = Router();

const vehicleBrandServices = new GenericService<VehicleBrandDoc>(VechicleBrand);

const vehicleBrandController = new AdvancedGenericController({
    service: vehicleBrandServices,
    populate: ["userId"],
    validationSchema: vehicleBrandCreateSchema,
    searchFields: ["brandName"]
});

router.get("/", vehicleBrandController.getAll);
router.get("/:id", vehicleBrandController.getById);
router.post("/", vehicleBrandController.create);
router.put("/:id", vehicleBrandController.update);
router.delete("/:id", vehicleBrandController.delete);

export default router;
