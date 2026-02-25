import { Response } from "express";
import { Types } from "mongoose";
import { TechnicianAuthRequest } from "../../middleware/auth.middleware";
import { VehicleInspectionsByTechnicians } from "../../models/technician-vehicle-inspections-models/technician.vehicle.inspection.models";

export const getInspectionByJobId = async (
  req: TechnicianAuthRequest,
  res: Response,
) => {
  try {
    const technicianId = req.technicianId;
    const userId = req.user?.userId; // ✅ added
    const { jobId, inspectionTIME } = req.query;

    // ✅ Validate jobId
    if (!jobId || !Types.ObjectId.isValid(jobId as string)) {
      return res.status(400).json({
        success: false,
        message: "Valid jobId is required",
      });
    }

    // ✅ Validate technicianId OR userId
    if (
      (!technicianId || !Types.ObjectId.isValid(technicianId)) &&
      (!userId || !Types.ObjectId.isValid(userId))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid technicianId or userId",
      });
    }

    const matchStage: any = {
      jobId: new Types.ObjectId(jobId as string),
      tecnicianId: technicianId ? new Types.ObjectId(technicianId) : undefined,
      userId: !technicianId && userId ? new Types.ObjectId(userId) : undefined,
    };

    // remove undefined fields
    Object.keys(matchStage).forEach(
      (key) => matchStage[key] === undefined && delete matchStage[key],
    );

    // ✅ Optional filter by inspection time
    if (inspectionTIME) {
      matchStage.inspectionTIME = inspectionTIME;
    }

    const latestInspection = await VehicleInspectionsByTechnicians.findOne(
      matchStage,
    )
      .populate({
        path: "inspections.inspectionTypeId",
        model: "technicianInspectionList",
      })
      .sort({ createdAt: -1 });

    if (!latestInspection) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "No inspection found",
      });
    }

    return res.status(200).json({
      success: true,
      data: latestInspection,
    });
  } catch (error) {
    console.error("Error fetching inspections:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch inspections",
    });
  }
};
