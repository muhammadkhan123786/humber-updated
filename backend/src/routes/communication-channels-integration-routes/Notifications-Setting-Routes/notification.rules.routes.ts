import { NextFunction, Request, Response, Router } from "express";
import { GenericService } from "../../../services/generic.crud.services";
import {
  notificationRulesDoc,
  NotificationRules,
} from "../../../models/communication-channel-models/Notifications-models/notification.rules.models";
import { notificationRulesValidation } from "../../../schemas/communication-channels-integration-schema/Notification-rules/notification.rules.schema";
import { AdvancedGenericController } from "../../../controllers/GenericController";
import { generateNotificationRuleCode } from "../../../utils/generate.AutoCode.Counter";

const notificationRulesRouter = Router();

const NotificationRulesServices =
  new GenericService<notificationRulesDoc>(NotificationRules);

const NotificationRulesController = new AdvancedGenericController({
  service: NotificationRulesServices,
  populate: [
    { path: "userId" },
    { path: "eventKeyId" },
    {path:"moduleId"},
    { path: "channelIds"},
  ],
  validationSchema: notificationRulesValidation,
  searchFields: ["conditions", "priority"],
});

notificationRulesRouter.get("/", NotificationRulesController.getAll);
notificationRulesRouter.get("/:id", NotificationRulesController.getById);
notificationRulesRouter.post(
  "/",
 async(req:Request,res:Response,next:NextFunction)=>{
      const ruleAutoId = await generateNotificationRuleCode();
      req.body.autoRuleId = ruleAutoId;
      next();

 },
  NotificationRulesController.create,
);
notificationRulesRouter.put(
  "/:id",
  NotificationRulesController.update,
);
notificationRulesRouter.delete(
  "/:id",
  NotificationRulesController.delete,
);

export default notificationRulesRouter;
