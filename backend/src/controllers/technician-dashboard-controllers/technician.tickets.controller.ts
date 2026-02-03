import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { Technicians } from "../../models/technician-models/technician.models";
import { customerTicketBase } from "../../models/ticket-management-system-models/customer.ticket.base.models";

export const technicianTicketsController = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const user = req.body.user;
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Please provide technician details.",
            });
        }

        // ✅ Find technician by accountId
        const technician = await Technicians.findOne({
            accountId: user._id,
            isDeleted: false,
            isActive: true,
        });

        if (!technician) {
            return res.status(404).json({
                success: false,
                message: "Technician not found or inactive.",
            });
        }

        // ✅ Pagination & Search
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const search = (req.query.search as string) || "";

        // Build search query
        const searchQuery: any = {
            assignedTechnicianId: { $in: [technician._id] },
            isDeleted: false,
        };

        if (search) {
            searchQuery.$or = [
                { ticketCode: { $regex: search, $options: "i" } },
                { issue_Details: { $regex: search, $options: "i" } },
            ];
        }

        // ✅ Count total for pagination
        const totalTickets = await customerTicketBase.countDocuments(searchQuery);

        // ✅ Fetch tickets
        const tickets = await customerTicketBase.find(searchQuery)
            .sort({ createdAt: -1 }) // latest tickets first
            .skip(skip)
            .limit(limit)
            .populate({
                path: "customerId",
                select: "personId contactId",
                populate: [
                    { path: "personId", select: "firstName lastName" },
                    { path: "contactId", select: "emailId" },
                ],
            })
            .populate("vehicleId", "serialNumber vehicleType")
            .populate("ticketStatusId", "label")
            .populate("priorityId", "label");

        return res.status(200).json({
            success: true,
            message: "Tickets fetched successfully",
            tickets,
            pagination: {
                total: totalTickets,
                page,
                limit,
                pages: Math.ceil(totalTickets / limit),
            },
        });
    } catch (error) {
        console.error("Technician Ticket Error:", error);
        return res.status(500).json({
            success: false,
            message: "Technician Tickets fetch failed due to server error.",
        });
    }
};