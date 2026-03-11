import { Response } from "express";
import { TechnicianAuthRequest } from "../../../middleware/auth.middleware";
import { JOB_STATUS } from "../../../schemas/technicians-jobs-by-admin/techncian.jobs.by.admin.schema";
import { TechnicianJobsByAdmin } from "../../../models/techncian-jobs-by-admin-models/technician.jobs.by.admin.models";
import { Types } from "mongoose";


export const technicianDashboardJobsController = async (
  req: TechnicianAuthRequest,
  res: Response
) => {
  try {
    const technicianId = req.technicianId;
    console.log("Technician ID from Request:", technicianId); // Debug log to check technicianId
    if (!technicianId) {
      return res.status(400).json({
        success: false,
        message: "TechnicianId not provided.",
      });
    }

    // =========================
    // Query Params
    // =========================
    const filter = (req.query.filter as string) || "all";
    const search = (req.query.search as string) || "";
    const status = req.query.status as string;
    const fromDate = req.query.fromDate as string;
    const toDate = req.query.toDate as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    // =========================
    // Base Query
    // =========================
    const query: any = {
      leadingTechnicianId: technicianId,
      isDeleted: false,
    };

    if (filter === "active") query.isActive = true;
    if (filter === "inactive") query.isActive = false;

    if (search) {
      query.jobId = { $regex: search, $options: "i" };
    }

    if (status && JOB_STATUS.includes(status as any)) {
      query.jobStatusId = status;
    }

    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate);
    }

    // =========================
    // Fetch Jobs
    // =========================
    const jobs = await TechnicianJobsByAdmin.find(query) // Exclude __v and isDeleted fields
      .populate([
        {
          path: "leadingTechnicianId",
          select: "personId contactId",
          populate: [
            { path: "personId", select: "firstName lastName" },
            { path: "contactId", select: "phoneNumber mobileNumber" },
          ],
        },
        {
          path: "ticketId",
          select:
            "ticketCode customerId issue_Details ticketStatusId vehicleId priorityId",
          populate: [
            {
              path: "customerId",
              select: "personId contactId addressId",
              populate: [
                { path: "personId", select: "firstName lastName" },
                { path: "contactId", select: "mobileNumber phoneNumber" },
                { path: "addressId", select: "address city state zipCode" },
              ],
            },
            {
              path: "vehicleId",
              select:
                "vehicleType productName serialNumber vehicleModelId",
              populate: {
                path: "vehicleModelId",
                select: "modelName",
              },
            },
            { path: "priorityId", select: "serviceRequestPrioprity backgroundColor" },
            { path: "ticketStatusId", select: "code" },
          ],
        },
        {
          path: "quotationId",
          select: "quotationCode totalAmount partsList",
        },
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
      console.log("Fetched Jobs:", jobs); // Debug log to check number of jobs fetched
    // =========================
    // Status KPI Aggregation
    // =========================
    const statusAggregation = await TechnicianJobsByAdmin.aggregate([
      {
        $match: {
          leadingTechnicianId: new Types.ObjectId(technicianId),
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$jobStatusId",
          count: { $sum: 1 },
        },
      },
    ]);

    // Default counts
    const statusSummary = {
      pending: 0,
      started: 0,
      onHold: 0,
      ended: 0,
    };

    // Map aggregation result
    statusAggregation.forEach((item) => {
      switch (item._id) {
        case "PENDING":
          statusSummary.pending = item.count;
          break;
        case "START":
          statusSummary.started = item.count;
          break;
        case "ON HOLD":
          statusSummary.onHold = item.count;
          break;
        case "END":
          statusSummary.ended = item.count;
          break;
      }
    });

    // =========================
    // Counts
    // =========================
    const totalJobs = await TechnicianJobsByAdmin.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: {
        jobs,
        statusSummary, // 🔥 KPI added here
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(totalJobs / limit),
          totalJobs,
        },
      },
    });
  } catch (error) {
    console.error("Technician Jobs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch technician jobs",
      error: error instanceof Error ? error.message : error,
    });
  }
};
