import { Types } from "mongoose";
import { TechniciansActivitiesMaster } from "../../models/technician-activities-master-models/technician.activities.master.models";
import { TimeLog } from "../../schemas/technician-activities-records/technician.activities.records.schema";
import { TicketQuations } from "../../models/ticket-quation-models/ticket.quotation.models";
import { TechnicianJobsByAdmin } from "../../models/techncian-jobs-by-admin-models/technician.jobs.by.admin.models";



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
//from pending to start (or restart from completed)
export const startActivity = async (activityId: string|Types.ObjectId, technicianId: string|Types.ObjectId) => {
  const activity = await TechniciansActivitiesMaster.findById(activityId);
  if (!activity) throw new Error("Activity not found");

  if (activity.technicianId.toString() !== technicianId) 
      throw new Error("Not authorized");

  if (!["pending", "completed"].includes(activity.status)) 
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

//technician job performance list 
export const getTechnicianDashboard = async ({
  technicianId,
  page = 1,
  limit = 10,
  search,
  jobStatus,
  sortBy = "createdAt",
  sortOrder = -1,
}: {
  technicianId: string;
  page?: number;
  limit?: number;
  search?: string;
  jobStatus?: string;
  sortBy?: string;
  sortOrder?: 1 | -1;
}) => {
  const techId = new Types.ObjectId(technicianId);
  const skip = (page - 1) * limit;

  const matchStage: any = { technicianId: techId };
  if (jobStatus) matchStage.jobStatus = jobStatus;
  const aggregation: any[] = [
    { $match: matchStage },
    // 🔹 Join Admin Job
    {
      $lookup: {
        from: "technicianjobsbyadmins",
        localField: "jobId",
        foreignField: "_id",
        as: "adminJob",
      },
    },
    { $unwind: "$adminJob" },

    // 🔹 Search by jobId
    ...(search
      ? [
          {
            $match: {
              "adminJob.jobId": { $regex: search, $options: "i" },
            },
          },
        ]
      : []),

    // 🔹 Join Ticket
    {
      $lookup: {
        from: "customerticketbases",
        localField: "adminJob.ticketId",
        foreignField: "_id",
        as: "ticket",
      },
    },
    { $unwind: "$ticket" },

    // 🔹 Join Quotation
    {
      $lookup: {
        from: "ticketquations",
        localField: "adminJob.quotationId",
        foreignField: "_id",
        as: "quotation",
      },
    },
    { $unwind: "$quotation" },

    // 🔹 Join Activities
    {
      $lookup: {
        from: "technicianactivitiesmasters",
        localField: "jobId",
        foreignField: "JobAssignedId",
        as: "activities",
      },
    },

    // 🔹 Calculations
    {
      $addFields: {
        totalActivities: { $size: "$activities" },

        totalWorkedSeconds: {
          $sum: "$activities.totalTimeInSeconds",
        },

        // Parts Cost
        partsCost: {
          $sum: "$quotation.partsList.total",
        },

        // Labour Cost (based on worked time)
        labourCost: {
          $multiply: [
            { $divide: [{ $sum: "$activities.totalTimeInSeconds" }, 3600] },
            "$quotation.labourRate",
          ],
        },
      },
    },

    // 🔹 Format Output
    {
      $project: {
        jobAssignmentId: "$_id",
        role: 1,
        jobStatus: 1,
        createdAt: 1,

        jobId: "$adminJob.jobId",
        ticketCode: "$ticket.ticketCode",
        customerName: "$ticket.customerName",

        totalActivities: 1,
        totalWorkedSeconds: 1,
        partsCost: 1,
        labourCost: 1,
      },
    },

    // 🔹 Pagination
    {
      $facet: {
        data: [
          { $sort: { [sortBy]: sortOrder } },
          { $skip: skip },
          { $limit: limit },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const result = await TechnicianJobsByAdmin.aggregate(aggregation);

  const data = result[0]?.data || [];
  const total = result[0]?.totalCount[0]?.count || 0;

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

