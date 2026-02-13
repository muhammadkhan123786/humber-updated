import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";

import { TechniciansJobs } from "../../models/technician-jobs-models/technician.jobs.models";
import { TechnicianJobStatus } from "../../models/master-data-models/technician.job.status.models";
import { customerTicketBase } from "../../models/ticket-management-system-models/customer.ticket.base.models";
import { TechnicianAuthRequest } from "../../middleware/auth.middleware";
import { Technicians } from "../../models/technician-models/technician.models";
import { TicketQuations } from "../../models/ticket-quation-models/ticket.quotation.models";

export const technicianJobsStatisticsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const result = await TechnicianJobStatus.aggregate([
      {
        $facet: {
          // ✅ 1️⃣ STATUS COUNTS (Show ALL statuses)
          statusCounts: [
            {
              $lookup: {
                from: "techniciansjobs",
                let: { statusId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: [
                              {
                                $cond: [
                                  {
                                    $eq: [{ $type: "$jobStatusId" }, "string"],
                                  },
                                  { $toObjectId: "$jobStatusId" },
                                  "$jobStatusId",
                                ],
                              },
                              "$$statusId",
                            ],
                          },
                          { $eq: ["$isDeleted", false] },
                        ],
                      },
                    },
                  },
                  { $count: "totalJobs" },
                ],
                as: "jobsData",
              },
            },
            {
              $addFields: {
                totalJobs: {
                  $ifNull: [{ $arrayElemAt: ["$jobsData.totalJobs", 0] }, 0],
                },
              },
            },
            {
              $project: {
                _id: 1,
                technicianJobStatus: 1,
                totalJobs: 1,
              },
            },
          ],

          // ✅ 2️⃣ OVERALL TOTAL JOBS (REAL JOBS COLLECTION)
          overallTotal: [
            {
              $lookup: {
                from: "techniciansjobs",
                pipeline: [
                  { $match: { isDeleted: false } },
                  { $count: "overallTotalJobs" },
                ],
                as: "overall",
              },
            },
            {
              $unwind: {
                path: "$overall",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $limit: 1,
            },
            {
              $project: {
                overallTotalJobs: "$overall.overallTotalJobs",
              },
            },
          ],

          // ✅ 3️⃣ TODAY JOBS
          todayJobs: [
            {
              $lookup: {
                from: "techniciansjobs",
                pipeline: [
                  {
                    $match: {
                      isDeleted: false,
                      createdAt: { $gte: todayStart },
                    },
                  },
                  { $count: "todayJobs" },
                ],
                as: "today",
              },
            },
            { $unwind: { path: "$today", preserveNullAndEmptyArrays: true } },
            { $limit: 1 },
            {
              $project: {
                todayJobs: "$today.todayJobs",
              },
            },
          ],
        },
      },
      {
        $project: {
          statusCounts: 1,
          technicianJobStatus: 1,
          overallTotalJobs: {
            $ifNull: [
              { $arrayElemAt: ["$overallTotal.overallTotalJobs", 0] },
              0,
            ],
          },
          todayJobs: {
            $ifNull: [{ $arrayElemAt: ["$todayJobs.todayJobs", 0] }, 0],
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: result[0] || {
        statusCounts: [],
        overallTotalJobs: 0,
        todayJobs: 0,
      },
    });
  } catch (error) {
    console.error("Technician Jobs Statistics Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch technician job statistics.",
    });
  }
};

export const assignTicketToTechnicianController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params; // ✅ ticketId
    const { technicianId } = req.body; // ✅ technicianId

    // Validate ObjectIds
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ticketId" });
    }

    if (!Types.ObjectId.isValid(technicianId)) {
      return res.status(400).json({ message: "Invalid technicianId" });
    }

    // ✅ Add technician into array (NO DUPLICATES)
    const updatedTicket = await customerTicketBase
      .findByIdAndUpdate(
        id,
        {
          $addToSet: {
            assignedTechnicianId: technicianId,
          },
        },
        { new: true },
      )
      .populate("assignedTechnicianId");

    if (!updatedTicket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Technician assigned successfully",
      data: updatedTicket,
    });
  } catch (error) {
    console.error("Assign Technician Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to assign technician.",
    });
  }
};

export const technicianDashboardJobsStatisticsController = async (
  req: TechnicianAuthRequest,
  res: Response,
) => {
  try {
    const technicianId = req.technicianId; // 👈 middleware se
    if (!technicianId)
      return res
        .status(400)
        .json({ success: false, message: "Technician not found" });

    const technicianObjectId = new Types.ObjectId(technicianId);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const result = await TechnicianJobStatus.aggregate([
      {
        $facet: {
          // ✅ STATUS COUNTS (TECHNICIAN BASED)
          statusCounts: [
            {
              $lookup: {
                from: "techniciansjobs",
                let: { statusId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: [
                              {
                                $cond: [
                                  {
                                    $eq: [{ $type: "$jobStatusId" }, "string"],
                                  },
                                  { $toObjectId: "$jobStatusId" },
                                  "$jobStatusId",
                                ],
                              },
                              "$$statusId",
                            ],
                          },
                          { $eq: ["$technicianId", technicianObjectId] }, // ✅ FILTER ADDED
                          { $eq: ["$isDeleted", false] },
                        ],
                      },
                    },
                  },
                  { $count: "totalJobs" },
                ],
                as: "jobsData",
              },
            },
            {
              $addFields: {
                totalJobs: {
                  $ifNull: [{ $arrayElemAt: ["$jobsData.totalJobs", 0] }, 0],
                },
              },
            },
            {
              $project: {
                _id: 1,
                technicianJobStatus: 1,
                totalJobs: 1,
              },
            },
          ],

          // ✅ OVERALL TOTAL (TECHNICIAN BASED)
          overallTotal: [
            {
              $lookup: {
                from: "techniciansjobs",
                pipeline: [
                  {
                    $match: {
                      isDeleted: false,
                      technicianId: technicianObjectId, // ✅ FILTER ADDED
                    },
                  },
                  { $count: "overallTotalJobs" },
                ],
                as: "overall",
              },
            },
            { $unwind: { path: "$overall", preserveNullAndEmptyArrays: true } },
            { $limit: 1 },
            {
              $project: {
                overallTotalJobs: "$overall.overallTotalJobs",
              },
            },
          ],

          // ✅ TODAY JOBS (TECHNICIAN BASED)
          todayJobs: [
            {
              $lookup: {
                from: "techniciansjobs",
                pipeline: [
                  {
                    $match: {
                      isDeleted: false,
                      technicianId: technicianObjectId, // ✅ FILTER ADDED
                      createdAt: { $gte: todayStart },
                    },
                  },
                  { $count: "todayJobs" },
                ],
                as: "today",
              },
            },
            { $unwind: { path: "$today", preserveNullAndEmptyArrays: true } },
            { $limit: 1 },
            {
              $project: {
                todayJobs: "$today.todayJobs",
              },
            },
          ],
        },
      },
      {
        $project: {
          statusCounts: 1,
          overallTotalJobs: {
            $ifNull: [
              { $arrayElemAt: ["$overallTotal.overallTotalJobs", 0] },
              0,
            ],
          },
          todayJobs: {
            $ifNull: [{ $arrayElemAt: ["$todayJobs.todayJobs", 0] }, 0],
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: result[0] || {
        statusCounts: [],
        overallTotalJobs: 0,
        todayJobs: 0,
      },
    });
  } catch (error) {
    console.error("Technician Jobs Statistics Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch technician job statistics.",
    });
  }
};

//technician active jobs
export const getTechniciansWithActiveJobsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      filter = "paged", // ✅ paged | all
    } = req.query as any;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // ✅ Base match
    const matchStage: any = { isDeleted: false };

    // ✅ Search support
    if (search) {
      matchStage.$or = [
        { technicianName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // =========================
    // 🔥 BASE PIPELINE
    // =========================
    const basePipeline: any[] = [
      { $match: matchStage },

      // ✅ Populate Account
      {
        $lookup: {
          from: "users",
          localField: "accountId",
          foreignField: "_id",
          as: "accountId",
        },
      },
      { $unwind: { path: "$accountId", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "servicetypemasters",
          localField: "specializationIds",
          foreignField: "_id",
          as: "specializationIds",
        },
      },

      // ✅ Populate Person
      {
        $lookup: {
          from: "people",
          localField: "personId",
          foreignField: "_id",
          as: "personId",
        },
      },
      { $unwind: { path: "$personId", preserveNullAndEmptyArrays: true } },

      // ✅ Populate Contact
      {
        $lookup: {
          from: "contacts",
          localField: "contactId",
          foreignField: "_id",
          as: "contactId",
        },
      },
      { $unwind: { path: "$contactId", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "addresses",
          localField: "addressId",
          foreignField: "_id",
          as: "addressId",
        },
      },
      { $unwind: { path: "$addressId", preserveNullAndEmptyArrays: true } },
      // ✅ Count Active Jobs
      {
        $lookup: {
          from: "techniciansjobs",
          let: { technicianId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$technicianId", "$$technicianId"] },
                    { $eq: ["$isActive", true] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
            { $count: "activeJobs" },
          ],
          as: "jobsData",
        },
      },

      {
        $addFields: {
          activeJobs: {
            $ifNull: [{ $arrayElemAt: ["$jobsData.activeJobs", 0] }, 0],
          },
        },
      },

      {
        $project: {
          jobsData: 0,
        },
      },
    ];

    // =========================
    // ✅ IF FILTER = ALL → NO PAGINATION
    // =========================
    if (filter === "all") {
      const technicians = await Technicians.aggregate(basePipeline);

      return res.status(200).json({
        success: true,
        pagination: null,
        data: technicians,
      });
    }

    // =========================
    // ✅ PAGINATED RESULT
    // =========================
    const pipeline = [
      ...basePipeline,
      {
        $facet: {
          data: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limitNumber },
          ],
          totalCount: [{ $count: "total" }],
        },
      },
    ];

    const result = await Technicians.aggregate(pipeline);

    const technicians = result[0]?.data || [];
    const total = result[0]?.totalCount[0]?.total || 0;

    return res.status(200).json({
      success: true,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
      data: technicians,
    });
  } catch (error) {
    console.error("Technicians With Active Jobs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch technicians with active jobs",
    });
  }
};

//update techncian job status
export const updateTechnicianQuotationStatusController = async (
  req: TechnicianAuthRequest,
  res: Response
) => {
  try {
    const { techncianQuotationStatusId, techncianQuotationId } = req.body;

    // ✅ Validate role
    if (!req.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    // ✅ Validate IDs
    if (!techncianQuotationId || !Types.ObjectId.isValid(techncianQuotationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid technician quotation id.",
      });
    }

    if (!techncianQuotationStatusId || !Types.ObjectId.isValid(techncianQuotationStatusId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid technician job status id.",
      });
    }

    // =====================================
    // 🔐 ROLE BASED FILTER
    // =====================================
    const filter: any = {
      _id: techncianQuotationId,
      isDeleted: false,
    };

    // ✅ Technician → can update ONLY own job
    if (req.role === "Technician") {
      if (!req.technicianId) {
        return res.status(401).json({
          success: false,
          message: "Technician not authorized.",
        });
      }

      filter.technicianId = req.technicianId;
    }

    // ✅ Admin → no technician filter (can update all)

    const updatedJob = await TicketQuations.findOneAndUpdate(
      filter,
      {
        $set: { quotationStatusId: techncianQuotationStatusId },
      },
      {
        new: true,
      }
    ).lean();

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found or access denied.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quoation Status Updated Successfully.",
      data: updatedJob,
    });
  } catch (error) {
    console.error("Update Technician Quotation Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update technician Quotation status.",
    });
  }
};
