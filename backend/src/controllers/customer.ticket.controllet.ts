import { Request, Response } from "express";

import { generateTicketCode } from "../utils/generateTicketCode";
import { TicketStatus } from "../models/ticket-management-system-models/ticket.status.models";
import { customerTicketBase } from "../models/ticket-management-system-models/customer.ticket.base.models";
import { CustomerTicketStatus } from "../models/ticket-management-system-models/customer.ticket.status.manager.models";

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
