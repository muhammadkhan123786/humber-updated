import { AuthRequest, TechnicianAuthRequest } from "../../middleware/auth.middleware";
import { Request, Response } from "express";
import { Technicians } from "../../models/technician-models/technician.models";
import { TicketQuations } from "../../models/ticket-quation-models/ticket.quotation.models";
import { Types } from "mongoose";



export const technicianTicketsQuotationsController = async (
  req: TechnicianAuthRequest,
  res: Response
) => {
  try {
    console.log("Login role:", req.role);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const filter = (req.query.filter as string) || "";
    const search = (req.query.search as string) || "";
    const quotationStatusId = req.query.quotationStatusId as string;
    const ticketStatusId = req.query.ticketStatusId as string;

    const skip = (page - 1) * limit;

    // =====================================================
    // ✅ ROLE BASED MATCH
    // =====================================================
    const matchQuery: any = { isDeleted: false };

    // Technician → only own quotations
    if (req.role === "Technician") {
      if (!req.technicianId) {
        return res.status(400).json({
          success: false,
          message: "Technician user not provided.",
        });
      }
      matchQuery.technicianId = new Types.ObjectId(req.technicianId);
    }

    // Admin → fetch all (no technician filter)

    // Optional filters
    if (quotationStatusId && Types.ObjectId.isValid(quotationStatusId)) {
      matchQuery.quotationStatusId = new Types.ObjectId(quotationStatusId);
    }

    // =====================================================
    // 🧱 BASE PIPELINE
    // =====================================================
    const pipeline: any[] = [
      { $match: matchQuery },

      // Ticket
      {
        $lookup: {
          from: "customerticketbases",
          localField: "ticketId",
          foreignField: "_id",
          as: "ticket",
        },
      },
      { $unwind: "$ticket" },

      // Ticket Status
      {
        $lookup: {
          from: "ticketstatuses",
          localField: "ticket.ticketStatusId",
          foreignField: "_id",
          as: "ticketStatusDetails",
        },
      },
      {
        $unwind: {
          path: "$ticketStatusDetails",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Quotation Status
      {
        $lookup: {
          from: "ticketquationstatuses",
          localField: "quotationStatusId",
          foreignField: "_id",
          as: "quotationStatus",
        },
      },
      { $unwind: "$quotationStatus" },

      // Customer
      {
        $lookup: {
          from: "customerbases",
          localField: "ticket.customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },

      // Person
      {
        $lookup: {
          from: "people",
          localField: "customer.personId",
          foreignField: "_id",
          as: "person",
        },
      },
      { $unwind: "$person" },

      // Contact (🔥 missing in your code earlier)
      {
        $lookup: {
          from: "contacts",
          localField: "customer.contactId",
          foreignField: "_id",
          as: "contact",
        },
      },
      {
        $unwind: {
          path: "$contact",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Vehicle
      {
        $lookup: {
          from: "customervehiclemodels",
          localField: "ticket.vehicleId",
          foreignField: "_id",
          as: "vehicle",
        },
      },
      {
        $unwind: {
          path: "$vehicle",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Vehicle Brand
      {
        $lookup: {
          from: "vechiclebrands",
          localField: "vehicle.vehicleBrandId",
          foreignField: "_id",
          as: "vehicleBrand",
        },
      },
      {
        $unwind: {
          path: "$vehicleBrand",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Vehicle Model
      {
        $lookup: {
          from: "vechiclemodels",
          localField: "vehicle.vehicleModelId",
          foreignField: "_id",
          as: "vehicleModel",
        },
      },
      {
        $unwind: {
          path: "$vehicleModel",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Parts
      {
        $lookup: {
          from: "parts",
          localField: "partsList",
          foreignField: "_id",
          as: "partsDetails",
        },
      },
      {
        $addFields: {
          originalPartsList: "$partsList",
        },
      },
    ];

    // =====================================================
    // 🔎 SEARCH FILTER
    // =====================================================
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

    // Ticket status filter
    if (ticketStatusId && Types.ObjectId.isValid(ticketStatusId)) {
      pipeline.push({
        $match: {
          "ticket.ticketStatusId": new Types.ObjectId(ticketStatusId),
        },
      });
    }

    // =====================================================
    // 🔢 COUNT PIPELINE (OPTIMIZED)
    // =====================================================
    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await TicketQuations.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // =====================================================
    // 📄 PAGINATION (skip if filter=all)
    // =====================================================
    pipeline.push({ $sort: { createdAt: -1 } });

    if (filter !== "all") {
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: limit });
    }

    // =====================================================
    // 🎯 FINAL PROJECTION
    // =====================================================
    pipeline.push({
      $project: {
        quotationAutoId: 1,
        labourTotalBill: 1,
        netTotal: 1,
        createdAt: 1,
        quotationStatus: "$quotationStatus.ticketQuationStatus",

        ticket: {
          _id: "$ticket._id",
          ticketCode: "$ticket.ticketCode",
          issue_Details: "$ticket.issue_Details",
          ticketStatus: {
            $ifNull: [
              "$ticketStatusDetails.label",
              "$ticketStatusDetails.code",
            ],
          },
        },

        customer: {
          _id: "$customer._id",
          firstName: "$person.firstName",
          lastName: "$person.lastName",
          email: "$contact.emailId",
        },

        vehicle: {
          brandName: "$vehicleBrand.brandName",
          modelName: "$vehicleModel.modelName",
        },
      },
    });

    const quotations = await TicketQuations.aggregate(pipeline);

    return res.status(200).json({
      success: true,
      message: "Quotations fetched successfully",
      data: quotations,
      pagination:
        filter === "all"
          ? null
          : {
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



