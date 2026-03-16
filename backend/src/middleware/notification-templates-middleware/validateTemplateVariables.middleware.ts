import { Request, Response, NextFunction } from "express";
import { EventActions } from "../../models/communication-channel-models/Notifications-models/event.actions.models";
import { extractTemplateVariables } from "../../utils/notification-template-utils/templateVariablesExtractor";
export const validateTemplateVariables = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const { eventKeyId, templateBody } = req.body;

    if (!templateBody) return next();

    const event = await EventActions.findById(eventKeyId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    const allowedVariables = event.variables.map((v: any) => v.key);

    const templateVariables = extractTemplateVariables(templateBody);

    const invalidVariables = templateVariables.filter(
      (v) => !allowedVariables.includes(v)
    );

    if (invalidVariables.length > 0) {
      return res.status(400).json({
        message: "Invalid template variables",
        invalidVariables,
        allowedVariables
      });
    }

    next();

  } catch (error) {
    next(error);
  }
};