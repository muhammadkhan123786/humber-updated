import { DriverModel } from "../../models/driver/driver.models";
import { Request, Response } from "express";

export const createDriver = async (req: Request, res: Response) => {
    try {
        // Ensure accountId exists
        if (!req.body.accountId) {
            return res.status(400).json({ message: "Account ID is required" });
        }

        // Prepare driver data
        const driverData = {
            ...req.body,
            contactDetails: {
                ...req.body.contactDetails,
                dateOfBirth: new Date(req.body.contactDetails.dateOfBirth),
            },
            driverLicenseDetails: {
                ...req.body.driverLicenseDetails,
                expiryDate: new Date(req.body.driverLicenseDetails.expiryDate),
            },
            documents: req.body.documents || {},
        };

        // Create driver
        const driver = await DriverModel.create(driverData);

        return res.status(201).json(driver);
    } catch (err) {
        console.error("Create driver error:", err);
        return res.status(500).json({ message: "Failed to create driver" });
    }
};

export const updateDriver = async (req: Request, res: Response) => {
    try {
        const driverId = req.params.id;
        if (!driverId) return res.status(400).json({ message: "Driver ID is required" });

        const existingDriver = await DriverModel.findById(driverId);
        if (!existingDriver) return res.status(404).json({ message: "Driver not found" });

        const updatedData: any = {
            ...req.body,
            contactDetails: {
                ...existingDriver.contactDetails,
                ...req.body.contactDetails,
                dateOfBirth: req.body.contactDetails?.dateOfBirth
                    ? new Date(req.body.contactDetails.dateOfBirth)
                    : existingDriver.contactDetails.dateOfBirth,
            },
            driverLicenseDetails: {
                ...existingDriver.driverLicenseDetails,
                ...req.body.driverLicenseDetails,
                expiryDate: req.body.driverLicenseDetails?.expiryDate
                    ? new Date(req.body.driverLicenseDetails.expiryDate)
                    : existingDriver.driverLicenseDetails.expiryDate,
            },
            documents: {
                ...existingDriver.documents,
                ...req.body.documents,
            },
        };

        const driver = await DriverModel.findByIdAndUpdate(driverId, updatedData, { new: true });

        return res.status(200).json(driver);
    } catch (err) {
        console.error("Update driver error:", err);
        return res.status(500).json({ message: "Failed to update driver" });
    }
};

