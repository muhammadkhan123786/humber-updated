import { NextFunction, Request, Response, Router } from "express";
import { GenericService } from "../../services/generic.crud.services";
import { callLogsDoc, CallLogs } from "../../models/call-logs-modules-models/call.logs.models";
import { callLogsValidation } from "../../schemas/call-logs-module-schemas/call.logs.schema";
import { AdvancedGenericController } from "../../controllers/GenericController";
import { generateCallLogsCode } from "../../utils/generate.AutoCode.Counter";

const callLogsRouter = Router();

const callLogsServices = new GenericService<callLogsDoc>(CallLogs);

const callLogsController = new AdvancedGenericController({
    service: callLogsServices,
    populate: ["userId"],
    validationSchema: callLogsValidation,
    searchFields: ["autoCallId","customerName","phoneNumber","callPurpose"]
});

callLogsRouter.get("/", callLogsController.getAll);
callLogsRouter.get("/:id", callLogsController.getById);
callLogsRouter.post("/",async (req:Request,res:Response,next:NextFunction)=>{
      const autoCallId = await generateCallLogsCode();
      req.body.autoCallId = autoCallId;
}, callLogsController.create);
callLogsRouter.put("/:id", callLogsController.update);
callLogsRouter.delete("/:id", callLogsController.delete);

export default callLogsRouter;

