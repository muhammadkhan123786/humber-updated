import { Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { channelProviderConfigDoc, ChannelProviderConfigurationsFields } from "../../models/communication-channel-models/channel.provider.config.models";
import { channelConfigValidation } from "../../schemas/communication-channels-integration-schema/provider.config.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";
import { testCommunicationConnection } from "../../controllers/communication-channel-provider-controller/communication.channel.provider.controller";

const channelProviderConfigFieldsRouter = Router();

const channelProviderConfigFieldsServices = new GenericService<channelProviderConfigDoc>(ChannelProviderConfigurationsFields);

const channelProviderConfigFieldsController = new AdvancedGenericController({
    service: channelProviderConfigFieldsServices,
    populate: ["userId"],
    validationSchema: channelConfigValidation,
    searchFields: ["providerId"]
});

channelProviderConfigFieldsRouter.post('/communication/test-connection',testCommunicationConnection)
channelProviderConfigFieldsRouter.get("/", channelProviderConfigFieldsController.getAll);
channelProviderConfigFieldsRouter.get("/:id", channelProviderConfigFieldsController.getById);
channelProviderConfigFieldsRouter.post("/", channelProviderConfigFieldsController.create);
channelProviderConfigFieldsRouter.put("/:id", channelProviderConfigFieldsController.update);
channelProviderConfigFieldsRouter.delete("/:id", channelProviderConfigFieldsController.delete);

export default channelProviderConfigFieldsRouter;

