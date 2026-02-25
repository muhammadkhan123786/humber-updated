import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { VehicleInspectionsByTechnicians } from "../../models/technician-vehicle-inspections-models/technician.vehicle.inspection.models";
import { TechnicianAuthRequest } from "../auth.middleware";


export const checkInspectionExists = async (
  req: TechnicianAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const tecnicianId = req.technicianId;

    const { jobId,inspectionTIME } = req.body;

    // Validate required fields
    if (!jobId || !tecnicianId || !inspectionTIME) {
      return res.status(400).json({
        success: false,
        message: "jobId, tecnicianId and inspectionTIME are required",
      });
    }

    if (!Types.ObjectId.isValid(jobId) || !Types.ObjectId.isValid(tecnicianId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid jobId or technicianId",
      });
    }

    const existingInspection = await VehicleInspectionsByTechnicians.findOne({
      jobId,
      tecnicianId,
      inspectionTIME,
    });

    if (existingInspection) {
      return res.status(400).json({
        success: false,
        message: "Inspection already exists for this job and type.",
      });
    }

    // ✅ Continue if not exists
    next();

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error validating inspection",
    });
  }
};