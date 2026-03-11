import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import {
  channelProviderDoc,
  communicationChannelsProvider,
} from "../../models/communication-channel-models/provider.models";
import { channelProviderValidation } from "../../schemas/communication-channels-integration-schema/providers.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";

const channelProviderRouter = Router();

const channelProviderServices = new GenericService<channelProviderDoc>(
  communicationChannelsProvider,
);

const channelProviderController = new AdvancedGenericController({
  service: channelProviderServices,
  populate: ["userId", "channelId"],
  validationSchema: channelProviderValidation,
  searchFields: ["providerName"],
});

channelProviderRouter.get("/", channelProviderController.getAll);
channelProviderRouter.get("/:id", channelProviderController.getById);
channelProviderRouter.post("/", channelProviderController.create);
channelProviderRouter.put("/:id", channelProviderController.update);
channelProviderRouter.delete("/:id", channelProviderController.delete);

export default channelProviderRouter;
