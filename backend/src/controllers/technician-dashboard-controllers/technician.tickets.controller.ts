import { Response } from "express";
import {
  AuthRequest,
  TechnicianAuthRequest,
} from "../../middleware/auth.middleware";
import { Technicians } from "../../models/technician-models/technician.models";
import { customerTicketBase } from "../../models/ticket-management-system-models/customer.ticket.base.models";
import { TechniciansJobs } from "../../models/technician-jobs-models/technician.jobs.models";
import { Tax } from "../../models/tax.models";
import { Types } from "mongoose";
import { TicketQuationStatus } from "../../models/ticket-quation-models/ticket.quation.status.models";

export const technicianTicketsController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const technicianId = req.technicianId || req.body.technicianId;
    // const technicianId = req.user?.userId;
    console.log("Body: ", req);
    console.log(
      "Technician Tickets Controller invoked for user:",
      technicianId,
    );
    if (!technicianId) {
      return res.status(400).json({
        success: false,
        message: "Technician user not provided.",
      });
    }
    // ✅ Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = (req.query.search as string) || "";

    // ✅ Base Filter (array-safe)
    const filter: any = {
      assignedTechnicianId: technicianId,
      isDeleted: false,
    };

    // ✅ Search filter
    if (search) {
      filter.$or = [
        { ticketCode: { $regex: search, $options: "i" } },
        { issue_Details: { $regex: search, $options: "i" } },
      ];
    }

    // ✅ Total Count
    const totalTickets = await customerTicketBase.countDocuments(filter);

    // ✅ Fetch Tickets
    const tickets = await customerTicketBase
      .find(filter)
      .sort({ createdAt: -1 })
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

      .populate("priorityId", "serviceRequestPrioprity")
      .populate("ticketStatusId", "label")
      .populate({
        path: "assignedTechnicianId",
        select: "personId",
        populate: {
          path: "personId",
          select: "firstName lastName",
        },
      })
      .populate({
        path: "vehicleId",
        select: "vehicleBrandId vehicleModelId serialNumber vehicleType",
        populate: [
          { path: "vehicleBrandId", select: "brandName" },
          { path: "vehicleModelId", select: "modelName" },
        ],
      })
      .lean();

    // ✅ Format Response (ONLY LOGGED-IN TECHNICIAN)
    const formattedTickets = tickets.map((t: any) => {
      const myTechnician = Array.isArray(t.assignedTechnicianId)
        ? t.assignedTechnicianId.find(
            (tech: any) => tech?._id?.toString() === technicianId,
          )
        : null;

      return {
        _id: t._id,
        ticketCode: t.ticketCode,
        issue_Details: t.issue_Details,
        location: t.location,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        brandName: t.vehicleId?.vehicleBrandId?.brandName || "",
        modelName: t.vehicleId?.vehicleModelId?.modelName || "",
        ticketSource: t.ticketSource,

        // ✅ single technician object
        assignedTechnician: myTechnician
          ? {
              _id: myTechnician._id,
              firstName: myTechnician.personId?.firstName || "",
              lastName: myTechnician.personId?.lastName || "",
            }
          : null,

        customer: {
          firstName: t.customerId?.personId?.firstName || "",
          lastName: t.customerId?.personId?.lastName || "",
          email: t.customerId?.contactId?.emailId || "",
        },

        vehicle: t.vehicleId || null,
        priority: t.priorityId?.serviceRequestPrioprity || "",
        ticketStatus: t.ticketStatusId?.label || "",
      };
    });

    return res.status(200).json({
      success: true,
      message: "Technician tickets fetched successfully",
      tickets: formattedTickets,
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
      message: "Technician ticket fetch failed.",
    });
  }
};

export const technicianJobsController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const technicianId = req.technicianId;

    if (!technicianId) {
      return res.status(400).json({
        success: false,
        message: "Technician user not provided.",
      });
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = (req.query.search as string) || "";

    const pipeline: any[] = [
      {
        $match: {
          technicianId: technicianId,
          isDeleted: false,
        },
      },
      // ticket
      {
        $lookup: {
          from: "customerTicketBase",
          localField: "ticketId",
          foreignField: "_id",
          as: "ticket",
        },
      },
      { $unwind: "$ticket" },

      // customer
      {
        $lookup: {
          from: "CustomerBase",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },

      // person
      {
        $lookup: {
          from: "persons",
          localField: "customer.personId",
          foreignField: "_id",
          as: "person",
        },
      },
      { $unwind: "$person" },

      // vehicle
      {
        $lookup: {
          from: "vehicles",
          localField: "ticket.vehicleId",
          foreignField: "_id",
          as: "vehicle",
        },
      },
      {
        $lookup: {
          from: "addresses",
          localField: "customer.addressId",
          foreignField: "_id",
          as: "address",
        },
      },
      { $unwind: { path: "$vehicle", preserveNullAndEmptyArrays: true } },
    ];

    // 🔎 Nested Search
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

    // Count
    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await TechniciansJobs.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // Pagination
    pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    // Projection
    pipeline.push({
      $project: {
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        ticketCode: "$ticket.ticketCode",
        issue_Details: "$ticket.issue_Details",
        location: "$address.address",
        customer: {
          firstName: "$person.firstName",
          lastName: "$person.lastName",
        },
        vehicle: "$vehicle",
      },
    });

    const tickets = await TechniciansJobs.aggregate(pipeline);

    return res.status(200).json({
      success: true,
      message: "Technician tickets fetched successfully",
      tickets,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Technician Ticket Error:", error);
    return res.status(500).json({
      success: false,
      message: "Technician ticket fetch failed.",
    });
  }
};

//default tax get to add tax amount in technician quotations
export const getDefaultTaxPercentageController = async (
  req: TechnicianAuthRequest,
  res: Response,
) => {
  try {
    const tax = await Tax.findOne({
      userId: req.user.userId,
      isDefault: true,
      isDeleted: false,
    }).select("percentage");

    if (!tax) {
      return res.status(401).json({
        success: false,
        message: "Default tax not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Default tax fetched successfully.",
      taxPercentage: tax.percentage,
    });
  } catch (error) {
    console.error("Get Default Tax Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch default tax.",
    });
  }
};

//default quotation status get to add default status in technician quotations
export const getDefaultQuotationStatusController = async (
  req: TechnicianAuthRequest,
  res: Response,
) => {
  try {
    const defaultStatus = await TicketQuationStatus.findOne({
      userId: req.user.userId,
      isDefault: true,
      isDeleted: false,
    }).select("_id");

    if (!defaultStatus) {
      return res.status(401).json({
        success: false,
        message: "Default quotation status not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Default quotation status fetched successfully.",
      defaultQuotationStatusId: defaultStatus._id,
    });
  } catch (error) {
    console.error("Get Default Quotation Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch default quotation status.",
    });
  }
};
