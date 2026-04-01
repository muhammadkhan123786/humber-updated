import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { callTypeDoc, CallTypes } from "../../models/call-logs-modules-models/call.type.models";
import { callTypeValidation } from "../../schemas/call-logs-module-schemas/call.type.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";

const callTypeRouter = Router();

const callTypeServices = new GenericService<callTypeDoc>(CallTypes);

const callTypeController = new AdvancedGenericController({
    service: callTypeServices,
    populate: ["userId"],
    validationSchema: callTypeValidation,
    searchFields: ["callTypeName"]
});

callTypeRouter.get("/", callTypeController.getAll);
callTypeRouter.get("/:id", callTypeController.getById);
callTypeRouter.post("/", callTypeController.create);
callTypeRouter.put("/:id", callTypeController.update);
callTypeRouter.delete("/:id", callTypeController.delete);

export default callTypeRouter;

