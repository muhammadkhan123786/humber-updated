import { NextFunction, Request, Response, Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import {
  callLogsDoc,
  CallLogs,
} from "../../models/call-logs-modules-models/call.logs.models";
import { callLogsValidation } from "../../schemas/call-logs-module-schemas/call.logs.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";
import { generateCallLogsCode } from "../../utils/generate.AutoCode.Counter";

const callLogsRouter = Router();

const cleanFollowUpFields = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.method === "POST" || req.method === "PUT") {
      if (
        !req.body.followUpDate ||
        req.body.followUpDate === "" ||
        req.body.followUpDate === "null"
      ) {
        req.body.followUpDate = undefined;
      }

      if (
        !req.body.followUpTime ||
        req.body.followUpTime === "" ||
        req.body.followUpTime === "null"
      ) {
        req.body.followUpTime = undefined;
      }

      if (!req.body.followUpDate && !req.body.followUpTime) {
        delete req.body.followUpDate;
        delete req.body.followUpTime;
      }

      if (req.body.followUpDate && !req.body.followUpTime) {
        req.body.followUpTime = null;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

const callLogsServices = new GenericService<callLogsDoc>(CallLogs);

const callLogsController = new AdvancedGenericController({
  service: callLogsServices,
  populate: ["userId", "callTypeId", "priorityLevelId", "callStatusId"],
  validationSchema: callLogsValidation,
  searchFields: ["autoCallId", "customerName", "phoneNumber", "callPurpose"],
});

callLogsRouter.get("/", callLogsController.getAll);
callLogsRouter.get("/:id", callLogsController.getById);

callLogsRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const autoCallId = await generateCallLogsCode();
      req.body.autoCallId = autoCallId;
      next();
    } catch (error) {
      next(error);
    }
  },
  cleanFollowUpFields,
  callLogsController.create,
);

callLogsRouter.put("/:id", cleanFollowUpFields, callLogsController.update);
callLogsRouter.delete("/:id", callLogsController.delete);

export default callLogsRouter;
