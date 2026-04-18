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
    console.log("eventKeyId", eventKeyId, "templateBody", templateBody )
    if (!templateBody) return next();

    const event = await EventActions.findById(eventKeyId);
console.log("event", event)
    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    const allowedVariables = event.variables.map((v: any) => v.key);
console.log("allowedVariables", allowedVariables)
    const templateVariables = extractTemplateVariables(templateBody);

    console.log("templateVariables", templateVariables)
    const invalidVariables = templateVariables.filter(
      (v) => !allowedVariables.includes(v)
    );

    console.log('invalidVariables', invalidVariables)

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