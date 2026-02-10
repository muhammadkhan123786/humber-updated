import { AuthRequest } from "../../middleware/auth.middleware";
import { Request, Response } from "express";
import { Technicians } from "../../models/technician-models/technician.models";
import { TicketQuations } from "../../models/ticket-quation-models/ticket.quotation.models";
import { Types } from "mongoose";



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

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = (req.query.search as string) || "";

    const technicianObjectId = new Types.ObjectId(user.userId);

    // =========================
    // Aggregation pipeline
    // =========================
    const pipeline: any[] = [
      // 1️⃣ Match
      {
        $match: {
          technicianId: technicianObjectId,
          isDeleted: false,
        },
      },
        // 2️⃣ Lookup - ticket details
        {
            $lookup: {
                from: "customerticketbases",
                localField: "ticketId",
                foreignField: "_id",
                as: "ticket",
            },
        },
        { $unwind: "$ticket" },
        // 3️⃣ Lookup - quotation status
        {
            $lookup: {
                from: "ticketquationstatuses",
                localField: "quotationStatusId",
                foreignField: "_id",
                as: "quotationStatus",  
            },          
        },
        { $unwind: "$quotationStatus" },
        // 4️⃣ Lookup - parts details
        {
            $lookup: {
                from: "customerbases",
                localField: "ticket.customerId",
                foreignField: "_id",
                as: "customer",
            },  
        },
        { $unwind: "$customer" },
        {
            $lookup: {
                from: "people",   
                localField: "customer.personId",
                foreignField: "_id",
                as: "person",   
            },
        },
        { $unwind: "$person" },       

    ];
    console.log("Technician Quotations Initial Match Pipeline:", pipeline);

    // 🔍 Search
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
    // 🔢 Count (before pagination)
    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await TicketQuations.aggregate(countPipeline);
    console.log("Technician Quotations Count Result:", countResult);
    const total = countResult[0]?.total || 0;

    // Pagination
    pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    // 🎯 Projection
    pipeline.push({
      $project: {
        quotationAutoId: 1,
        labourTime: 1,
        labourRate: 1,
        partTotalBill: 1,
        labourTotalBill: 1,
        subTotalBill: 1,
        taxAmount: 1,
        netTotal: 1,
        createdAt: 1,
        updatedAt: 1,
        ticket: {
          _id: "$ticket._id",
          ticketCode: "$ticket.ticketCode",
          issue_Details: "$ticket.issue_Details",
         // location: "$ticket.location",
        },
        quotationStatus: "$quotationStatus.ticketQuationStatus",
        parts: 1,
        technician: {
          _id: "$technician._id",
          name: "$technician.name",
        },

        customer: {
          _id: "$customer._id",
          firstName: "$person.firstName",
          lastName: "$person.lastName",
          email: "$contact.emailId",
        },
      },
    });

    const quotations = await TicketQuations.aggregate(pipeline);
  console.log("Technician Quotations Aggregation Result:", quotations);
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


