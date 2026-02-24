import { Response } from "express";
import { Types } from "mongoose";
import { TechniciansJobsAssignment } from "../../models/technician-job-assignment/technician.jobs.assignment.models";
import { TechnicianAuthRequest } from "../../middleware/auth.middleware";

export const getAllTechnicianAssignments = async (
  req: TechnicianAuthRequest,
  res: Response
) => {
  try {
    const {
      page = "1",
      limit = "10",
      status,
      search,
    } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;

    const matchStage: any = {};

    // ✅ Filter by status
    if (status) {
      matchStage.jobStatus = status;
    }

    // ✅ Role-based filtering
    if (req.role === "Technician") {
      const technicianId = req.technicianId;

      if (technicianId && Types.ObjectId.isValid(technicianId)) {
        matchStage.technicianId = new Types.ObjectId(technicianId);
      }
    }

    if (req.role === "Admin") {
      const userId = req.user?.userId;

      if (userId && Types.ObjectId.isValid(userId)) {
        matchStage.userId = new Types.ObjectId(userId);
      }
    }

    const pipeline: any[] = [
      { $match: matchStage },

      // 🔹 Join Job
      {
        $lookup: {
          from: "technicianjobsbyadmins",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
    ];

    // ✅ Search
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { generalNotes: { $regex: search, $options: "i" } },
            { "job.jobId": { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    // ✅ Facet: data + total + statusCounts
    pipeline.push({
      $facet: {
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limitNumber },
        ],

        totalCount: [
          { $count: "total" }
        ],

        statusCounts: [
          {
            $group: {
              _id: "$jobStatus",
              count: { $sum: 1 },
            },
          },
        ],
      },
    });

    const result = await TechniciansJobsAssignment.aggregate(pipeline);

    const data = result[0]?.data || [];
    const total = result[0]?.totalCount[0]?.total || 0;

    // Convert statusCounts array → object
    const statusCountsArray = result[0]?.statusCounts || [];

    const statusCounts = {
      PENDING: 0,
      IN_PROGRESS: 0,
      ON_HOLD: 0,
      COMPLETED: 0,
    };

    statusCountsArray.forEach((item: any) => {
      statusCounts[item._id] = item.count;
    });

    return res.status(200).json({
      success: true,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      statusCounts,
      data,
    });

  } catch (error) {
    console.error("Error fetching assignments:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch technician assignments",
    });
  }
};