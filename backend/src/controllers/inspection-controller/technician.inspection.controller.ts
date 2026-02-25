import { Response } from "express";
import { Types } from "mongoose";
import { TechnicianAuthRequest } from "../../middleware/auth.middleware";
import { VehicleInspectionsByTechnicians } from "../../models/technician-vehicle-inspections-models/technician.vehicle.inspection.models";


export const getInspectionByJobId = async (
  req: TechnicianAuthRequest,
  res: Response
) => {
  try {
    const technicianId = req.technicianId;
    const { jobId, inspectionTIME } = req.query;

    // ✅ Validate jobId
    if (!jobId || !Types.ObjectId.isValid(jobId as string)) {
      return res.status(400).json({
        success: false,
        message: "Valid jobId is required",
      });
    }

    // ✅ Validate technicianId
    if (!technicianId || !Types.ObjectId.isValid(technicianId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid technicianId",
      });
    }

    const matchStage: any = {
      jobId: new Types.ObjectId(jobId as string),
      tecnicianId: new Types.ObjectId(technicianId),
    };

    // ✅ Optional filter by inspection time
    if (inspectionTIME) {
      matchStage.inspectionTIME = inspectionTIME;
    }

    const inspections = await VehicleInspectionsByTechnicians
      .find(matchStage)
      .populate("jobId")
      .populate("tecnicianId")
      .populate({
        path: "inspections.inspectionTypeId",
        model: "technicianInspectionList",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: inspections.length,
      data: inspections,
    });

  } catch (error) {
    console.error("Error fetching inspections:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch inspections",
    });
  }
};