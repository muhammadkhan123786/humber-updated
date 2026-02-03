import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { Technicians } from "../../models/technician-models/technician.models";
import { customerTicketBase } from "../../models/ticket-management-system-models/customer.ticket.base.models";


export const technicianTicketsController = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Please provide technician details.",
            });
        }
         console.log("Technician ID from token:", user); // ✅ Debug log for technician ID
        // ✅ Find technician by accountId
        const technician = await Technicians.findOne({
            accountId: user.userId,
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

        // ✅ Aggregation pipeline
        const pipeline: any[] = [
            {
                $match: {
                    assignedTechnicianId: { $in: [technician._id] },
                    isDeleted: false,
                },
            },
            // Lookup customer
            {
                $lookup: {
                    from: "customers",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customer",
                },
            },
            { $unwind: "$customer" },
            // Lookup person for customer
            {
                $lookup: {
                    from: "persons",
                    localField: "customer.personId",
                    foreignField: "_id",
                    as: "person",
                },
            },
            { $unwind: "$person" },
            // Lookup contact for customer
            {
                $lookup: {
                    from: "contacts",
                    localField: "customer.contactId",
                    foreignField: "_id",
                    as: "contact",
                },
            },
            { $unwind: "$contact" },
            // Lookup vehicle
            {
                $lookup: {
                    from: "vehicles",
                    localField: "vehicleId",
                    foreignField: "_id",
                    as: "vehicle",
                },
            },
            { $unwind: "$vehicle" },
            // Lookup priority
            {
                $lookup: {
                    from: "priorities",
                    localField: "priorityId",
                    foreignField: "_id",
                    as: "priority",
                },
            },
            { $unwind: "$priority" },
            // Lookup ticket status
            {
                $lookup: {
                    from: "ticketstatuses",
                    localField: "ticketStatusId",
                    foreignField: "_id",
                    as: "ticketStatus",
                },
            },
            { $unwind: "$ticketStatus" },
        ];

        // ✅ Search filter
        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { ticketCode: { $regex: search, $options: "i" } },
                        { issue_Details: { $regex: search, $options: "i" } },
                        { "person.firstName": { $regex: search, $options: "i" } },
                        { "person.lastName": { $regex: search, $options: "i" } },
                    ],
                },
            });
        }

        // ✅ Count total tickets
        const countPipeline = [...pipeline, { $count: "total" }];
        const countResult = await customerTicketBase.aggregate(countPipeline);
        const totalTickets = countResult[0]?.total || 0;

        // ✅ Pagination
        pipeline.push({ $sort: { createdAt: -1 } });
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });

        // ✅ Project desired fields
        pipeline.push({
            $project: {
                _id: 1,
                ticketCode: 1,
                issue_Details: 1,
                location: 1,
                assignedTechnicianId: 1,
                createdAt: 1,
                updatedAt: 1,
                customer: {
                    firstName: "$person.firstName",
                    lastName: "$person.lastName",
                    email: "$contact.emailId",
                },
                vehicle: 1,
                priority: "$priority.label",
                ticketStatus: "$ticketStatus.label",
            },
        });

        const tickets = await customerTicketBase.aggregate(pipeline);

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
