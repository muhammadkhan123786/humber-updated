import { Router } from "express";
import { GenericService } from "../../../services/generic.crud.services";
import {
  NotificationTemplateDoc,
  NotificationTemplates,
} from "../../../models/communication-channel-models/Notifications-models/notification.template.models";
import { notificationTemplateValidation } from "../../../schemas/communication-channels-integration-schema/Notifications-Schemas/notification.template.schema";
import { AdvancedGenericController } from "../../../controllers/GenericController";
import { validateTemplateVariables } from "../../../middleware/notification-templates-middleware/validateTemplateVariables.middleware";

const notificationTemplateRouter = Router();

const NotificationTemplateServices =
  new GenericService<NotificationTemplateDoc>(NotificationTemplates);

const NotificationTemplateController = new AdvancedGenericController({
  service: NotificationTemplateServices,
  populate: [
    { path: "userId" },
    { path: "eventKeyId" },
    { path: "channelId", populate: { path: "channelId" } },
  ],
  validationSchema: notificationTemplateValidation,
  searchFields: ["subject", "templateBody"],
});

notificationTemplateRouter.get("/", NotificationTemplateController.getAll);
notificationTemplateRouter.get("/:id", NotificationTemplateController.getById);
notificationTemplateRouter.post(
  "/",
  validateTemplateVariables,
  NotificationTemplateController.create,
);
notificationTemplateRouter.put(
  "/:id",
  validateTemplateVariables,
  NotificationTemplateController.update,
);
notificationTemplateRouter.delete(
  "/:id",
  NotificationTemplateController.delete,
);

export default notificationTemplateRouter;
