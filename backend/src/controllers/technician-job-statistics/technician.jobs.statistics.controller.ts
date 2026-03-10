import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";

import { TechniciansJobs } from "../../models/technician-jobs-models/technician.jobs.models";
import { TechnicianJobStatus } from "../../models/master-data-models/technician.job.status.models";
import { customerTicketBase } from "../../models/ticket-management-system-models/customer.ticket.base.models";
import { TechnicianAuthRequest } from "../../middleware/auth.middleware";
import { Technicians } from "../../models/technician-models/technician.models";
import { TicketQuations } from "../../models/ticket-quation-models/ticket.quotation.models";
import { Shop } from "../../models/shop.models";
import { User } from "../../models/user.models";
import { Person } from "../../models/person.models";
import { Contact } from "../../models/contact.models";
import { Address } from "../../models/addresses.models";
import { TechnicianJobsByAdmin } from "../../models/techncian-jobs-by-admin-models/technician.jobs.by.admin.models"; // your mongoose model
import { JOB_STATUS } from "../../schemas/technicians-jobs-by-admin/techncian.jobs.by.admin.schema";

export const technicianJobsStatisticsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const result = await TechnicianJobsByAdmin.aggregate([
      {
        $match: { isDeleted: false },
      },
      {
        $facet: {
          // ✅ Count jobs by status
          statusCounts: [
            {
              $group: {
                _id: "$jobStatusId",
                totalJobs: { $sum: 1 },
              },
            },
          ],

          // ✅ Overall total jobs
          overallTotal: [
            {
              $count: "overallTotalJobs",
            },
          ],

          // ✅ Today's jobs
          todayJobs: [
            {
              $match: { createdAt: { $gte: todayStart } },
            },
            {
              $count: "todayJobs",
            },
          ],
        },
      },
    ]);

    const aggregationResult = result[0] || {};

    // ✅ Normalize status counts (so missing statuses show 0)
    const formattedStatusCounts = JOB_STATUS.map((status) => {
      const found = aggregationResult.statusCounts?.find(
        (s: any) => s._id === status,
      );

      return {
        status,
        totalJobs: found ? found.totalJobs : 0,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        statusCounts: formattedStatusCounts,
        overallTotalJobs:
          aggregationResult.overallTotal?.[0]?.overallTotalJobs || 0,
        todayJobs: aggregationResult.todayJobs?.[0]?.todayJobs || 0,
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
    const id = req.params.id as string; // ✅ ticketId
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
      filter = "paged",
    } = req.query as any;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const basePipeline: any[] = [
      { $match: { isDeleted: false } },

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

      {
        $lookup: {
          from: "people",
          localField: "personId",
          foreignField: "_id",
          as: "personId",
        },
      },
      { $unwind: { path: "$personId", preserveNullAndEmptyArrays: true } },

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
    ];

    basePipeline.push({
      $addFields: {
        fullName: {
          $concat: ["$personId.firstName", " ", "$personId.lastName"],
        },
      },
    });

    if (search) {
      basePipeline.push({
        $match: {
          $or: [
            { employeeId: { $regex: search, $options: "i" } },
            { fullName: { $regex: search, $options: "i" } },
            { "personId.firstName": { $regex: search, $options: "i" } },
            { "personId.lastName": { $regex: search, $options: "i" } },
            { "accountId.email": { $regex: search, $options: "i" } },
            { "contactId.phoneNumber": { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    basePipeline.push(
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
    );

    if (filter === "all") {
      const technicians = await Technicians.aggregate([
        ...basePipeline,
        { $sort: { createdAt: -1 } },
      ]);

      return res.status(200).json({
        success: true,
        pagination: null,
        data: technicians,
      });
    }

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

    console.log("Technicians with Active Jobs (All):", technicians);

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
//update quotation job status
export const updateTechnicianQuotationStatusController = async (
  req: TechnicianAuthRequest,
  res: Response,
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

    // ✅ Validate quotation ID
    if (
      !techncianQuotationId ||
      !Types.ObjectId.isValid(techncianQuotationId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid technician quotation id.",
      });
    }

    // ✅ Validate ENUM status
    const allowedStatuses = [
      "SEND TO CUSTOMER",
      "SEND TO INSURANCE",
      "APPROVED",
      "REJECTED",
    ];

    if (
      !techncianQuotationStatusId ||
      !allowedStatuses.includes(techncianQuotationStatusId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid quotation status value.",
      });
    }

    // =====================================
    // 🔐 ROLE BASED FILTER
    // =====================================
    const filter: any = {
      _id: techncianQuotationId,
      isDeleted: false,
    };

    if (req.role === "Technician") {
      if (!req.technicianId) {
        return res.status(401).json({
          success: false,
          message: "Technician not authorized.",
        });
      }

      filter.technicianId = req.technicianId;
    }

    const updatedQuotation = await TicketQuations.findOneAndUpdate(
      filter,
      {
        $set: { quotationStatusId: techncianQuotationStatusId },
      },
      { new: true },
    ).lean();

    if (!updatedQuotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found or access denied.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quotation status updated successfully.",
      data: updatedQuotation,
    });
  } catch (error) {
    console.error("Update Technician Quotation Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update technician quotation status.",
    });
  }
};

//update technician job status and is completed job
export const updateTechnicianJobStatusController = async (
  req: TechnicianAuthRequest,
  res: Response,
) => {
  try {
    const { jobStatusId, techncianJobId } = req.body;

    // ✅ Role validation
    if (!req.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    // ✅ Validate technician job id
    if (!techncianJobId || !Types.ObjectId.isValid(techncianJobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid technician job id.",
      });
    }

    // ✅ Validate jobStatusId
    if (!jobStatusId || !JOB_STATUS.includes(jobStatusId)) {
      return res.status(400).json({
        success: false,
        message: `Invalid job status. Allowed values: ${JOB_STATUS.join(", ")}`,
      });
    }

    const filter: any = {
      _id: techncianJobId,
      isDeleted: false,
    };

    // ✅ Technician restriction
    if (req.role === "Technician") {
      if (!req.technicianId) {
        return res.status(401).json({
          success: false,
          message: "Technician not authorized.",
        });
      }

      filter.leadingTechnicianId = req.technicianId; // updated for new schema
    }
    console.log("Filter for updating job status:", filter);
    // ✅ Update jobStatusId
    const updatedJob = await TechnicianJobsByAdmin.findOneAndUpdate(
      filter,
      { $set: { jobStatusId } },
      { new: true },
    ).lean();

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Technician Job not found or access denied.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Technician Job Status Updated Successfully.",
      data: updatedJob,
    });
  } catch (error) {
    console.error("Update Technician Job Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update technician Job status.",
      error: error instanceof Error ? error.message : error,
    });
  }
};

//count total completed job where status is Completed
export const TechnicianCompletedJobCountController = async (
  req: TechnicianAuthRequest,
  res: Response,
) => {
  try {
    if (!req.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    if (req.role === "Technician" && !req.technicianId) {
      return res.status(401).json({
        success: false,
        message: "Technician not authorized.",
      });
    }

    const filter: any = {
      isDeleted: false,
      isJobCompleted: true,
      ...(req.role === "Technician" && {
        technicianId: req.technicianId,
      }),
    };

    const totalCompletedJobs = await TechniciansJobs.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Technician completed jobs count fetched successfully.",
      data: totalCompletedJobs,
    });
  } catch (error) {
    console.error("Technician Jobs Count Failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs count.",
    });
  }
};

//technician profile
export const TechnicianProfileController = async (
  req: TechnicianAuthRequest,
  res: Response,
) => {
  try {
    if (!req.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    if (req.role === "Technician" && !req.technicianId) {
      return res.status(401).json({
        success: false,
        message: "Technician not authorized.",
      });
    }

    // ✅ Get technician profile
    const technicianProfile = await Technicians.findOne({
      _id: req.technicianId,
      isDeleted: false,
    })
      .select("employeeId dateOfJoining userId")
      .populate({ path: "personId", select: "firstName lastName" })
      .populate({ path: "accountId", select: "email" })
      .populate({ path: "contactId", select: "phoneNumber" })
      .populate({ path: "addressId", select: "address" })
      .populate({ path: "specializationIds", select: "MasterServiceType" })
      .lean();

    if (!technicianProfile) {
      return res.status(404).json({
        success: false,
        message: "Technician profile not found.",
      });
    }
    // ✅ Get shop using userId (assuming technician.userId = shop owner id)
    const technicianShop = await Shop.findOne({
      userId: technicianProfile.userId,
      isDeleted: false,
    })
      .select("shopName")
      .lean();
    console.log("Technician Profile:", technicianShop);
    return res.status(200).json({
      success: true,
      message: "Technician profile fetched successfully.",
      data: {
        technician: technicianProfile,
        shop: technicianShop || null,
      },
    });
  } catch (error) {
    console.error("Technician Profile Fetch Failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch technician profile.",
    });
  }
};

//update technician profile
export const UpdateTechnicianProfileController = async (
  req: TechnicianAuthRequest,
  res: Response,
) => {
  try {
    if (!req.role || req.role !== "Technician" || !req.technicianId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    const { firstName, lastName, email, phoneNumber, address } = req.body;

    const technician = await Technicians.findOne({
      _id: req.technicianId,
      isDeleted: false,
    });

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: "Technician not found.",
      });
    }

    /* ===============================
       ✅ CHECK EMAIL UNIQUENESS
    =============================== */
    if (email) {
      const existingEmail = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: technician.accountId }, // exclude current user
      });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already in use by another account.",
        });
      }
    }

    /* ===============================
       UPDATE TECHNICIAN
    =============================== */
    if (firstName || lastName) {
      await Person.findByIdAndUpdate(technician.personId, {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
      });
    }

    if (email) {
      await User.findByIdAndUpdate(technician.accountId, {
        email: email.toLowerCase(),
      });
    }

    if (phoneNumber) {
      await Contact.findByIdAndUpdate(technician.contactId, {
        phoneNumber,
      });
    }

    if (address) {
      await Address.findByIdAndUpdate(technician.addressId, {
        address,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Technician profile updated successfully.",
    });
  } catch (error: any) {
    /* ===============================
       🔥 HANDLE UNIQUE INDEX ERROR
    =============================== */
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate email detected.",
      });
    }

    console.error("Update Technician Profile Failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update technician profile.",
    });
  }
};
