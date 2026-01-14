import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
import { NextFunction, Request, Response } from "express";

export const vehicleVideoStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: "vehicle_repair_videos", // folder in Cloudinary
            resource_type: "video",          // very important for videos
            format: "mp4",                   // optional, can convert to mp4
            public_id: `vehicle_${Date.now()}` // optional custom ID
        };
    },
});

export const uploadVehicleVideo = multer({
    storage: vehicleVideoStorage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

export const handleVehicleVideoUpload = (fieldName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const uploader = uploadVehicleVideo.single(fieldName);

        uploader(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: err.message });
            } else if (err) {
                return res.status(500).json({ message: "Video upload failed" });
            }

            // If file exists, add URL to req.body
            if (req.file) {
                (req.body as any).vehicleRepairVideoURL = (req.file as any).path;
            }

            next();
        });
    };
};