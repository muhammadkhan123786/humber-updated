import { NextFunction, Response } from "express";
import { Types } from "mongoose";
import { TechniciansJobsAssignment } from "../../models/technician-job-assignment/technician.jobs.assignment.models";
import { TechnicianAuthRequest } from "../../middleware/auth.middleware";
import { TicketQuations } from "../../models/ticket-quation-models/ticket.quotation.models";

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
      role,
      jobId
    } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;

    const matchStage: any = {};

    // ✅ Filter by status
    if (status) {
      matchStage.jobStatus = status;
    }
    if(role)
    {
       matchStage.role = role;
    }

    // ✅ Role-based filtering
    if (req.role === "Technician") {
      const technicianId = req.technicianId;
      if (technicianId && Types.ObjectId.isValid(technicianId)) {
        matchStage.assignedBy = new Types.ObjectId(technicianId);
      }
    }

    if (req.role === "Admin") {
      const userId = req.user?.userId;
      if (userId && Types.ObjectId.isValid(userId)) {
        matchStage.userId = new Types.ObjectId(userId);
      }
    }

    if(jobId)
    {
       if (typeof jobId ==='string' && Types.ObjectId.isValid(jobId)) {
        matchStage.jobId = new Types.ObjectId(jobId);
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

//mark part installed when technician changed the part 
export const updatePartInstallation = async (
  req: TechnicianAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { quotationId, partItemId, adjustQuantity } = req.body;
    // adjustQuantity: +1 for install, -1 for uninstall
    const technicianId = req.technicianId;

    // ✅ Validate IDs
    if (!Types.ObjectId.isValid(quotationId) || !Types.ObjectId.isValid(partItemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quotationId or partItemId",
      });
    }

    const quotation = await TicketQuations.findById(quotationId);
    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    const partItem = quotation.partsList.find(
      (item: any) => item._id.toString() === partItemId
    );

    if (!partItem) {
      return res.status(404).json({
        success: false,
        message: "Part not found in quotation",
      });
    }

    const newInstalledQty = (partItem.installedQuantity || 0) + adjustQuantity;

    // ✅ Prevent invalid quantities
    if (newInstalledQty < 0) {
      return res.status(400).json({
        success: false,
        message: "Installed quantity cannot be less than 0",
      });
    }

    if (newInstalledQty > partItem.quantity) {
      return res.status(400).json({
        success: false,
        message: "Installed quantity cannot exceed required quantity",
      });
    }

    // ✅ Update fields
    partItem.installedQuantity = newInstalledQty;
    partItem.installedBy = technicianId;
    partItem.installedAt = new Date();

    // ✅ Update installationStatus
    if (newInstalledQty === 0) {
      partItem.installationStatus = "PENDING";
    } else if (newInstalledQty < partItem.quantity) {
      partItem.installationStatus = "PARTIAL";
    } else {
      partItem.installationStatus = "INSTALLED";
    }

    await quotation.save();

    // 🔥 Update stock in inventory (if adjustQuantity is positive, reduce; negative, increase)
    // await Parts.findByIdAndUpdate(partItem.partId, {
    //   $inc: { stockQuantity: -adjustQuantity }, // negative adjustQuantity will increment stock
    // });

    return res.status(200).json({
      success: true,
      message: "Part installation updated successfully",
      data: partItem,
    });
  } catch (error) {
    console.error("Error updating part installation:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update part installation",
    });
  }
};



