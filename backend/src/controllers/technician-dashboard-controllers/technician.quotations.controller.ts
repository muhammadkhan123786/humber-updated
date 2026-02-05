import { AuthRequest } from "../../middleware/auth.middleware";
import { Request, Response } from "express";
import { Technicians } from "../../models/technician-models/technician.models";
import { TicketQuations } from "../../models/ticket-quation-models/ticket.quotation.models";

export const technicianTicketsQuotationsController = async (
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

        // Find technician
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

        // Pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = (req.query.search as string) || "";

        // =========================
        // Aggregation pipeline
        // =========================
        const pipeline: any[] = [
            { $match: { technicianId: technician._id, isDeleted: false } },

            // Lookup ticket
            {
                $lookup: {
                    from: "customerTicketBase",
                    localField: "ticketId",
                    foreignField: "_id",
                    as: "ticket",
                },
            },
            { $unwind: "$ticket" },

            // Lookup customer
            {
                $lookup: {
                    from: "CustomerBase",
                    localField: "ticket.customerId",
                    foreignField: "_id",
                    as: "customer",
                },
            },
            { $unwind: "$customer" },

            // Lookup person inside customer
            {
                $lookup: {
                    from: "Person",
                    localField: "customer.personId",
                    foreignField: "_id",
                    as: "person",
                },
            },
            { $unwind: "$person" },

            // Lookup contact inside customer (optional)
            {
                $lookup: {
                    from: "contacts",
                    localField: "customer.contactId",
                    foreignField: "_id",
                    as: "contact",
                },
            },
            { $unwind: { path: "$contact", preserveNullAndEmptyArrays: true } },

            // Lookup quotationStatus
            {
                $lookup: {
                    from: "TicketQuationStatus",
                    localField: "quotationStatusId",
                    foreignField: "_id",
                    as: "quotationStatus",
                },
            },
            { $unwind: { path: "$quotationStatus", preserveNullAndEmptyArrays: true } },

            // Lookup partsList
            {
                $lookup: {
                    from: "Parts",
                    localField: "partsList",
                    foreignField: "_id",
                    as: "parts",
                },
            },

            // Lookup technician info
            {
                $lookup: {
                    from: "TechnicianProfileModel",
                    localField: "technicianId",
                    foreignField: "_id",
                    as: "technician",
                },
            },
            { $unwind: { path: "$technician", preserveNullAndEmptyArrays: true } },
        ];

        // 🔹 Search filter (ticket fields + customer person)
        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { "ticket.ticketCode": { $regex: search, $options: "i" } },
                        { "ticket.issue_Details": { $regex: search, $options: "i" } },
                        { "person.firstName": { $regex: search, $options: "i" } },
                        { "person.lastName": { $regex: search, $options: "i" } },
                    ],
                },
            });
        }

        // Count total
        const countPipeline = [...pipeline, { $count: "total" }];
        const countResult = await TicketQuations.aggregate(countPipeline);
        const total = countResult[0]?.total || 0;

        // Pagination
        pipeline.push({ $sort: { createdAt: -1 } });
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });

        // Project desired fields
        pipeline.push({
            $project: {
                _id: 1,
                ticketId: "$ticket._id",
                ticketCode: "$ticket.ticketCode",
                issue_Details: "$ticket.issue_Details",
                location: "$ticket.location",
                quotationStatus: "$quotationStatus.label",
                partsList: "$parts",
                technician: { _id: "$technician._id", name: "$technician.name" },
                customer: {
                    _id: "$customer._id",
                    firstName: "$person.firstName",
                    lastName: "$person.lastName",
                    email: "$contact.emailId",
                },
                labourTime: 1,
                labourRate: 1,
                partTotalBill: 1,
                labourTotalBill: 1,
                subTotalBill: 1,
                taxAmount: 1,
                netTotal: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        });

        const quotations = await TicketQuations.aggregate(pipeline);

        return res.status(200).json({
            success: true,
            message: "Technician Quotations fetched successfully",
            tickets: quotations,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Technician Ticket quotations Error:", error);
        return res.status(500).json({
            success: false,
            message: "Technician quotations fetch failed.",
        });
    }
};


