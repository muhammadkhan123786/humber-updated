import { NextFunction, Request,Response, Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { ClientChannelConfigurationData, clientChannelConfigurationDataConfigDoc } from "../../models/communication-channel-models/client.channel.config.data.models";
import { clientChannelConfigDataValidation,buildDynamicConfigSchema } from "../../schemas/communication-channels-integration-schema/client.channel.configuration.data";
import { AdvancedGenericController } from "../../controllers/GenericController";
import { ChannelProviderConfigurationsFields } from "../../models/communication-channel-models/channel.provider.config.models";

const clientChannelConfigurationDataRouter = Router();

const clientChannelConfigDataServices = new GenericService<clientChannelConfigurationDataConfigDoc>(ClientChannelConfigurationData);

const clientChannelConfigDataController = new AdvancedGenericController({
    service: clientChannelConfigDataServices,
    populate: ["userId","providerId"],
    validationSchema: clientChannelConfigDataValidation,
});

clientChannelConfigurationDataRouter.get("/", clientChannelConfigDataController.getAll);
clientChannelConfigurationDataRouter.get("/:id", clientChannelConfigDataController.getById);
clientChannelConfigurationDataRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { providerId, configurationData } = req.body;

      const provider = await ChannelProviderConfigurationsFields.findOne({
        providerId
      });

      if (!provider) {
        return res.status(404).json({
          success: false,
          message: "Provider not found"
        });
      }

      // Build dynamic schema
      const configSchema = buildDynamicConfigSchema(provider.fields);

      // Validate configuration
      const parsedConfig = configSchema.parse(configurationData);

      // Replace body with validated data
      req.body.configurationData = parsedConfig;

      next();

    } catch (error) {
       console.error('🔥 Error in /api/client-channel-config-data:', error.stack || error);
      next(error);
    }
  },

  clientChannelConfigDataController.create
);
clientChannelConfigurationDataRouter.put("/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { providerId, configurationData } = req.body;

      const provider = await ChannelProviderConfigurationsFields.findOne({
        providerId
      });

      if (!provider) {
        return res.status(404).json({
          success: false,
          message: "Provider not found"
        });
      }

      // Build dynamic schema
      const configSchema = buildDynamicConfigSchema(provider.fields);

      // Validate configuration
      const parsedConfig = configSchema.parse(configurationData);

      // Replace body with validated data
      req.body.configurationData = parsedConfig;

      next();

    } catch (error) {
      console.error('🔥 Error in /api/client-channel-config-data:', error.stack || error);
      next(error);
    }
  }, clientChannelConfigDataController.update);
clientChannelConfigurationDataRouter.delete("/:id", clientChannelConfigDataController.delete);

export default clientChannelConfigurationDataRouter;

