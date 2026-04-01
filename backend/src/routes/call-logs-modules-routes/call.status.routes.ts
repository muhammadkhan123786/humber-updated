import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { callStatusDoc, CallStatus } from "../../models/call-logs-modules-models/call.status.models";
import { callStatusValidation } from "../../schemas/call-logs-module-schemas/call.status.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";

const callStatusRouter = Router();

const callStatusServices = new GenericService<callStatusDoc>(CallStatus);

const callStatusController = new AdvancedGenericController({
    service: callStatusServices,
    populate: ["userId"],
    validationSchema: callStatusValidation,
    searchFields: ["callStatus"]
});

callStatusRouter.get("/", callStatusController.getAll);
callStatusRouter.get("/:id", callStatusController.getById);
callStatusRouter.post("/", callStatusController.create);
callStatusRouter.put("/:id", callStatusController.update);
callStatusRouter.delete("/:id", callStatusController.delete);

export default callStatusRouter;

