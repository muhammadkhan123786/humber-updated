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
    console.log("Technician Tickets Controller invoked for user:", user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Technician user not provided.",
      });
    }

    // ✅ Find technician account
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

    // ✅ Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = (req.query.search as string) || "";

    // ✅ Base Filter (array-safe)
    const filter: any = {
      assignedTechnicianId: technician._id,
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
        path:"vehicleId",
        select: "vehicleBrandId vehicleModelId serialNumber vehicleType",
        populate: [{ path: "vehicleBrandId",select:"brandName" }, { path: "vehicleModelId",select:"modelName" }],
      })
      .lean();

    // ✅ Format Response (ONLY LOGGED-IN TECHNICIAN)
    const formattedTickets = tickets.map((t: any) => {
      const myTechnician = Array.isArray(t.assignedTechnicianId)
        ? t.assignedTechnicianId.find(
            (tech: any) => tech?._id?.toString() === technician._id.toString()
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

