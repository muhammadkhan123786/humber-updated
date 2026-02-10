import { Request, Response } from "express";
import { Types } from "mongoose";

import { generateTicketCode } from "../utils/generate.AutoCode.Counter";
import { TicketStatus } from "../models/ticket-management-system-models/ticket.status.models";
import { customerTicketBase } from "../models/ticket-management-system-models/customer.ticket.base.models";
import { CustomerTicketStatus } from "../models/ticket-management-system-models/customer.ticket.status.manager.models";
import { CustomerBase } from "../models/customer.models";
import { Technicians } from "../models/technician-models/technician.models";
import { sendEmailTemplate } from "../utils/sendEmailUtil";

const calculatePercentage = (current = 0, last = 0) => {
  if (last === 0 && current > 0) return 100;
  if (last === 0 && current === 0) return 0;
  return Number((((current - last) / last) * 100).toFixed(2));
};

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
      [
        {
          customerTicketId: ticket[0]._id,
          customerTicketStatusId: openStatus._id,
        },
      ],
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
        { assignedTechnicianId: { $size: 0 } },
        { assignedTechnicianId: { $exists: false } },
      ],
    };

    const [data, total] = await Promise.all([
      customerTicketBase
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate([
          {
            path: "customerId",
            populate: [
              { path: "personId" },
              { path: "addressId" },
              { path: "contactId" },
            ],
          },
          {
            path: "vehicleId",
            populate: [{ path: "vehicleBrandId" }, { path: "vehicleModelId" }],
          },
          { path: "priorityId" },
          { path: "ticketStatusId" },
        ]),

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
    console.error(error);
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
      59,
    );

    /* ============================
           DASHBOARD AGGREGATION
        ============================ */

    const result = await customerTicketBase.aggregate([
      {
        $match: { isDeleted: { $ne: true } },
      },
      {
        $facet: {
          /* -------- STATUS COUNTS -------- */

          current: [
            {
              $group: {
                _id: "$ticketStatusId",
                count: { $sum: 1 },
              },
            },
          ],

          lastMonth: [
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

          /* -------- TOTAL TICKETS -------- */

          totalCurrent: [{ $count: "count" }],

          totalLastMonth: [
            {
              $match: {
                createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
              },
            },
            { $count: "count" },
          ],

          /* -------- URGENT TICKETS -------- */

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
           STATUS WISE WITH PERCENTAGE
        ============================ */

    const statusWise = await customerTicketBase.aggregate([
      {
        $match: { isDeleted: { $ne: true } },
      },
      {
        $group: {
          _id: "$ticketStatusId",
          current: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "ticketstatuses",
          localField: "_id",
          foreignField: "_id",
          as: "status",
        },
      },
      { $unwind: "$status" },
      {
        $lookup: {
          from: "customerticketbases",
          let: { statusId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$ticketStatusId", "$$statusId"] },
                    { $gte: ["$createdAt", startOfLastMonth] },
                    { $lte: ["$createdAt", endOfLastMonth] },
                  ],
                },
              },
            },
            { $count: "count" },
          ],
          as: "lastMonth",
        },
      },
      {
        $addFields: {
          lastMonthCount: {
            $ifNull: [{ $arrayElemAt: ["$lastMonth.count", 0] }, 0],
          },
        },
      },
      {
        $addFields: {
          percentage: {
            $cond: [
              { $eq: ["$lastMonthCount", 0] },
              {
                $cond: [{ $gt: ["$current", 0] }, 100, 0],
              },
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          { $subtract: ["$current", "$lastMonthCount"] },
                          "$lastMonthCount",
                        ],
                      },
                      100,
                    ],
                  },
                  2,
                ],
              },
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          statusId: "$_id",
          statusCode: "$status.code",
          statusName: "$status.name",
          current: 1,
          lastMonth: "$lastMonthCount",
          percentage: 1,
        },
      },
      { $sort: { current: -1 } },
    ]);

    /* ============================
           COUNTS
        ============================ */

    const [totalCustomer, activeTechnicians] = await Promise.all([
      CustomerBase.countDocuments({ isDeleted: false }),
      Technicians.countDocuments({ isDeleted: false, isActive: true }),
    ]);

    /* ============================
           SUMMARY HELPER
        ============================ */

    const calcSummary = (current = 0, last = 0) => ({
      current,
      lastMonth: last,
      percentage:
        last === 0 ? (current > 0 ? 100 : 0) : ((current - last) / last) * 100,
    });

    /* ============================
           RESPONSE
        ============================ */

    res.json({
      success: true,
      summary: {
        totalTickets: calcSummary(
          data.totalCurrent[0]?.count || 0,
          data.totalLastMonth[0]?.count || 0,
        ),
        urgentTickets: calcSummary(
          data.urgentCurrent[0]?.count || 0,
          data.urgentLastMonth[0]?.count || 0,
        ),
      },
      statusWise,
      totalCustomer,
      activeTechnicians,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ticket status summary",
    });
  }
};

//send ticket copy to customer
interface IPopulatedLabel {
  _id: Types.ObjectId;
  label: string;
}

export const sendTicketDetailsToCustomer = async (
  req: Request,
  res: Response,
) => {
  try {
    const { ticketId } = req.body;

    if (!ticketId) {
      return res.status(400).json({
        success: false,
        message: "ticketId is required",
      });
    }

    const ticket = await customerTicketBase
      .findOne({ _id: ticketId, isDeleted: false })
      .populate<{ ticketStatusId: IPopulatedLabel }>("ticketStatusId", "label")
      .populate<{ priorityId: IPopulatedLabel }>("priorityId", "label")
      .populate({
        path: "customerId",
        populate: [
          { path: "personId", select: "firstName lastName" },
          { path: "contactId", select: "emailId" },
        ],
      })
      .populate("vehicleId", "serialNumber vehicleType");

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    // ✅ Safe access
    const customer: any = ticket.customerId;
    const person = customer?.personId;
    const contact = customer?.contactId;

    if (!contact?.emailId) {
      return res.status(400).json({
        success: false,
        message: "Customer email not found",
      });
    }

    // ✅ FIXED: ticketStatusId.label (NOT ticket.label)
    const emailHtml = `
      <h3>Hello ${person?.firstName ?? "Customer"},</h3>
      <p>Your service ticket has been created successfully.</p>

      <p>
        <b>Ticket Code:</b> ${ticket.ticketCode}<br/>
        <b>Issue:</b> ${ticket.issue_Details}<br/>
        <b>Status:</b> ${ticket.ticketStatusId?.label ?? "Pending"}<br/>
        <b>Priority:</b> ${ticket.priorityId?.label ?? "Normal"}<br/>
      </p>

      <p>Our technician will contact you shortly.</p>

      <br/>
      <p>Regards,<br/><b>Humber Mobility Support</b></p>
    `;

    await sendEmailTemplate(
      contact.emailId,
      emailHtml,
      `Ticket Created - ${ticket.ticketCode}`,
    );

    return res.status(200).json({
      success: true,
      message: "Ticket details sent to customer successfully",
    });
  } catch (err) {
    console.error("sendTicketDetailsToCustomer error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to send ticket details to customer.",
    });
  }
};
