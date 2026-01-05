import { Router } from "express";
import { GenericService } from "../services/generic.crud.services";
import { warehouseDoc, Warehouse } from "../models/warehouse.models";
import { venderSchemaValidation } from "../schemas/vender.schema";
import { AdvancedGenericController } from "../controllers/GenericController";
import { saveCustomer } from "../controllers/customer.controller";
import { genericProfileIdsMiddleware } from "../middleware/generic.profile.middleware";

const warehouseRouter = Router();

const warehouseServices = new GenericService<warehouseDoc>(Warehouse);

const warehouseController = new AdvancedGenericController({
    service: warehouseServices,
    populate: ["userId", "personId", "addressId", "contactId", "sourceId",
        {
            path: "addressId",
            populate: [
                { path: "cityId" },
                { path: "countryId" }
            ]
        }],
    validationSchema: venderSchemaValidation,
});

const warehouseProfileMiddleware = genericProfileIdsMiddleware<warehouseDoc>({ targetModel: Warehouse }, false);

warehouseRouter.get("/", warehouseController.getAll);
warehouseRouter.get("/:id", warehouseController.getById);
warehouseRouter.post("/", warehouseProfileMiddleware, warehouseController.create);
warehouseRouter.post("/:id", warehouseProfileMiddleware, warehouseController.update);
warehouseRouter.delete("/:id", warehouseController.delete);

export default warehouseRouter;

