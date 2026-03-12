import { Response } from "express";
import { Types } from "mongoose";
import { AuthRequest } from "../../middleware/auth.middleware";
import { ChannelProviderConfigurationsFields } from "../../models/communication-channel-models/channel.provider.config.models";

export const getProviderFieldsByProviderId = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const providerId = new Types.ObjectId(req.params.provider_id as string);

    const provider = await ChannelProviderConfigurationsFields
    .findOne({
        providerId,
        userId: req.user.userId,
        isDeleted: false
    })
    .select("fields")
    .lean();

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider fields not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: provider.fields,
    });

  } catch (error) {
    console.error("Error fetching provider fields:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch fields",
    });
  }
};