import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { channelDoc, Channels } from "../../models/communication-channel-models/communication.channel.models";
import { channelValidation } from "../../schemas/communication-channels-integration-schema/channel.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";

const channelRouter = Router();

const channelServices = new GenericService<channelDoc>(Channels);

const channelController = new AdvancedGenericController({
    service: channelServices,
    populate: ["userId"],
    validationSchema: channelValidation,
    searchFields: ["channelName"]
});

channelRouter.get("/", channelController.getAll);
channelRouter.get("/:id", channelController.getById);
channelRouter.post("/", channelController.create);
channelRouter.put("/:id", channelController.update);
channelRouter.delete("/:id", channelController.delete);

export default channelRouter;

