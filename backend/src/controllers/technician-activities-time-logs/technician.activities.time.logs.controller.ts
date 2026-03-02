import { Types } from "mongoose";
import { TechniciansActivitiesMaster } from "../../models/technician-activities-master-models/technician.activities.master.models";
import { TimeLog } from "../../schemas/technician-activities-records/technician.activities.records.schema";
import { TicketQuations } from "../../models/ticket-quation-models/ticket.quotation.models";



//calculate total time 
const calculateTotalTime = (timeLogs: TimeLog[]) => {
  return timeLogs.reduce((acc, log) => {
    if (log.startTime && log.endTime) {
      return acc + (log.endTime.getTime() - log.startTime.getTime()) / 1000;
    }
    return acc;
  }, 0);
};

//functions to manage start/ in progress/ end activity 
//from pending to start
export const startActivity = async (activityId: string|Types.ObjectId, technicianId: string|Types.ObjectId) => {
  const activity = await TechniciansActivitiesMaster.findById(activityId);
  if (!activity) throw new Error("Activity not found");

  if (activity.technicianId.toString() !== technicianId) 
      throw new Error("Not authorized");

  if (activity.status !== "pending") 
      throw new Error(`Cannot start activity in status ${activity.status}`);

  activity.status = "in_progress";
  activity.timeLogs.push({ startTime: new Date() });

  await activity.save();
  return activity;
};

//from in_progress to pause function 
export const pauseActivity = async (activityId: string|Types.ObjectId, technicianId: string|Types.ObjectId) => {
  const activity = await TechniciansActivitiesMaster.findById(activityId);
  if (!activity) throw new Error("Activity not found");

  if (activity.technicianId.toString() !== technicianId) 
      throw new Error("Not authorized");

  if (activity.status !== "in_progress") 
      throw new Error(`Cannot pause activity in status ${activity.status}`);

  // Close last log
  const lastLog = activity.timeLogs[activity.timeLogs.length - 1];
  if (!lastLog || lastLog.endTime) throw new Error("No active time log to pause");

  lastLog.endTime = new Date();
  activity.status = "paused";
  activity.totalTimeInSeconds = calculateTotalTime(activity.timeLogs);

  await activity.save();
  return activity;
};

//resume time 

export const resumeActivity = async (activityId: string|Types.ObjectId, technicianId: string|Types.ObjectId) => {
  const activity = await TechniciansActivitiesMaster.findById(activityId);
  if (!activity) throw new Error("Activity not found");

  if (activity.technicianId.toString() !== technicianId) 
      throw new Error("Not authorized");

  if (activity.status !== "paused") 
      throw new Error(`Cannot resume activity in status ${activity.status}`);

  activity.status = "in_progress";
  activity.timeLogs.push({ startTime: new Date() });

  await activity.save();
  return activity;
};

//complete and caculate total time 
export const completeActivity = async (activityId: string|Types.ObjectId, technicianId: string|Types.ObjectId) => {
  const activity = await TechniciansActivitiesMaster.findById(activityId);
  if (!activity) throw new Error("Activity not found");

  if (activity.technicianId.toString() !== technicianId) 
      throw new Error("Not authorized");

  if (!["in_progress","paused"].includes(activity.status)) 
      throw new Error(`Cannot complete activity in status ${activity.status}`);

  // Close last log if running
  const lastLog = activity.timeLogs[activity.timeLogs.length - 1];
  if (lastLog && !lastLog.endTime) lastLog.endTime = new Date();

  activity.status = "completed";
  activity.totalTimeInSeconds = calculateTotalTime(activity.timeLogs);

  await activity.save();
  return activity;
};


//fetch parts for logs time 


export const getAvailablePartsForActivity = async (quotationId: string|Types.ObjectId) => {
  const quotation = await TicketQuations.findById(quotationId);

  if (!quotation) throw new Error("Quotation not found");

  // Filter parts that are not yet fully installed
  const availableParts = quotation.partsList.filter(
    (part) => part.installationStatus !== "INSTALLED"
  );

  return availableParts;
};

//install parts during activity 
export const installPartsDuringActivity = async (
  activityId: string,
  technicianId: string,
  partsUsed: { partId: string; quantity: number }[]
) => {
  const activity = await TechniciansActivitiesMaster.findOne({
    _id: activityId,
    technicianId,
  });
  if (!activity) throw new Error("Activity not found");

  const lastLog = activity.timeLogs[activity.timeLogs.length - 1];
  if (!lastLog || lastLog.endTime) throw new Error("Activity is not active");

  lastLog.partsUsed = lastLog.partsUsed || [];

  const quotation = await TicketQuations.findById(activity.quotationId);
  if (!quotation) throw new Error("Quotation not found");

  for (const part of partsUsed) {
    if (part.quantity <= 0) throw new Error("Quantity must be greater than 0");

    const quotationPart = quotation.partsList.find(
      (p) => p._id?.toString() === part.partId
    );
    if (!quotationPart) throw new Error(`Part ${part.partId} not found`);

    const remainingQty = quotationPart.quantity - (quotationPart.installedQuantity || 0);
    if (part.quantity > remainingQty) {
      throw new Error(`Cannot install ${part.quantity}, only ${remainingQty} left`);
    }

    quotationPart.installedQuantity = (quotationPart.installedQuantity || 0) + part.quantity;
    quotationPart.installedBy = technicianId;
    quotationPart.installedAt = new Date();
    quotationPart.installationStatus =
      quotationPart.installedQuantity === quotationPart.quantity
        ? "INSTALLED"
        : "PARTIAL";

    lastLog.partsUsed.push({
      partId: quotationPart._id.toString(),
      quotationPartId: quotationPart._id.toString(),
      quantityUsed: part.quantity,
    });
  }

  await quotation.save();
  await activity.save();

  return activity;
};