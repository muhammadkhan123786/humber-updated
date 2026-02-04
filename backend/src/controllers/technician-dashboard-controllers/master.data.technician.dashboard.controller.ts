import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { Technicians } from "../../models/technician-models/technician.models";

export const ticketsStatusController = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Technician user not provided.",
            });
        }
        const technician = await Technicians.findOne({
            accountId: user.userId,
            isDeleted: false,
            isActive: true,
        }).select("_id");

        if (!technician) {
            return res.status(404).json({
                success: false,
                message: "Technician not found.",
            });
        }



    } catch (error) {
        console.error("Technician Ticket Error:", error);
        return res.status(500).json({
            success: false,
            message: "Technician ticket fetch failed.",
        });
    }
};