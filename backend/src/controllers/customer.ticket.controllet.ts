import { Request, Response } from "express";

import { generateTicketCode } from "../utils/generateTicketCode";
import { TicketStatus } from "../models/ticket-management-system-models/ticket.status.models";
import { customerTicketBase } from "../models/ticket-management-system-models/customer.ticket.base.models";
import { CustomerTicketStatus } from "../models/ticket-management-system-models/customer.ticket.status.manager.models";
import { CustomerBase } from "../models/customer.models";
import { Technicians } from "../models/technician-models/technician.models";

export const saveTicket = async (req: Request, res: Response) => {
    // const session = await mongoose.startSession();
    // session.startTransaction();

    try {
        const openStatus = await TicketStatus.findOne({ code: "OPEN" });

        if (!openStatus) {
            return res.status(409).json({
                success: false,
                message: "OPEN status not configured",
            });
        }

        const generatedTicketCode = await generateTicketCode();

        const customerTicketData = {
            ticketSource: req.body.ticketSource,
            customerId: req.body.customerId,
            vehicleId: req.body.vehicleId,
            issueDetails: req.body.issueDetails,
            location: req.body.location,
            priorityId: req.body.priorityId,
            address: req.body.address || "",
            ticketCode: generatedTicketCode,
        };

        const ticket = await customerTicketBase.create(
            [customerTicketData],
            // { session }
        );

        const ticketStatus = await CustomerTicketStatus.create(
            [{
                customerTicketId: ticket[0]._id,
                customerTicketStatusId: openStatus._id,
            }],
            //  { session }
        );

        // await session.commitTransaction();
        // session.endSession();

        return res.status(201).json({
            success: true,
            message: "Customer Ticket Generated Successfully",
            ticket: ticket[0],
            ticketStatus: ticketStatus[0],
        });

    } catch (error: any) {
        //await session.abortTransaction();
        //session.endSession();

        return res.status(500).json({
            success: false,
            message: error.message || "Customer Ticket creation failed",
        });
    }
};


//get all ticket whose technician assigned 0 
export const getUnassignedTickets = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);

        const filter = {
            isDeleted: { $ne: true },
            $or: [
                { assignedTechnicianId: null },
                { assignedTechnicianId: { $exists: false } },
            ],
        };

        const [data, total] = await Promise.all([
            customerTicketBase.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate("customerId vehicleId priorityId ticketStatusId"),

            customerTicketBase.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            page,
            limit,
            total,
            data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch unassigned tickets",
        });
    }
};

// ticket count with status id 
export const getTicketCountByStatus = async (req: Request, res: Response) => {
    try {
        const now = new Date();

        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            0,
            23,
            59,
            59
        );

        const result = await customerTicketBase.aggregate([
            {
                $match: { isDeleted: { $ne: true } },
            },
            {
                $facet: {
                    /* ============================
                     STATUS WISE COUNTS
                    ============================ */

                    currentByStatus: [
                        {
                            $group: {
                                _id: "$ticketStatusId",
                                count: { $sum: 1 },
                            },
                        },
                    ],

                    lastMonthByStatus: [
                        {
                            $match: {
                                createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
                            },
                        },
                        {
                            $group: {
                                _id: "$ticketStatusId",
                                count: { $sum: 1 },
                            },
                        },
                    ],

                    /* ============================
                     TOTAL TICKETS
                    ============================ */

                    totalCurrent: [{ $count: "count" }],

                    totalLastMonth: [
                        {
                            $match: {
                                createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
                            },
                        },
                        { $count: "count" },
                    ],

                    /* ============================
                     URGENT TICKETS
                    ============================ */

                    urgentCurrent: [
                        { $match: { priority: "Urgent" } },
                        { $count: "count" },
                    ],

                    urgentLastMonth: [
                        {
                            $match: {
                                priority: "Urgent",
                                createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
                            },
                        },
                        { $count: "count" },
                    ],
                },
            },
        ]);

        const data = result[0];

        /* ============================
           STATUS WISE MERGE
        ============================ */
        const [totalCustomer, activeTechnicians] = await Promise.all([
            CustomerBase.countDocuments({ isDeleted: false }),
            Technicians.countDocuments({ isDeleted: false, isActive: true }),

        ]);


        const statusData = data.currentByStatus.map((curr: any) => {
            const last =
                data.lastMonthByStatus.find((l: any) =>
                    l._id.equals(curr._id)
                )?.count || 0;

            return {
                statusId: curr._id,
                statusName: curr.statusName,
                current: curr.count,
                lastMonth: last,
                percentage:
                    last === 0 ? (curr.count > 0 ? 100 : 0) : ((curr.count - last) / last) * 100,
            };
        });

        /* ============================
           SUMMARY HELPERS
        ============================ */

        const calcSummary = (current = 0, last = 0) => ({
            current,
            lastMonth: last,
            percentage:
                last === 0 ? (current > 0 ? 100 : 0) : ((current - last) / last) * 100,
        });

        res.json({
            success: true,
            summary: {
                totalTickets: calcSummary(
                    data.totalCurrent[0]?.count || 0,
                    data.totalLastMonth[0]?.count || 0
                ),
                urgentTickets: calcSummary(
                    data.urgentCurrent[0]?.count || 0,
                    data.urgentLastMonth[0]?.count || 0
                ),
            },
            statusWise: statusData,
            totalCustomer,
            activeTechnicians
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch ticket status summary",
        });
    }
};

