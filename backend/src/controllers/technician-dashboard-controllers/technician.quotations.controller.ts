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
        // 3️⃣ Lookup - ticket status
        {
            $lookup: {
                from: "ticketstatuses",
                localField: "ticket.ticketStatusId",
                foreignField: "_id",
                as: "ticketStatusDetails",
            },
        },
        { $unwind: { path: "$ticketStatusDetails", preserveNullAndEmptyArrays: true } },
        // 4️⃣ Lookup - quotation status
        {
            $lookup: {
                from: "ticketquationstatuses",
                localField: "quotationStatusId",
                foreignField: "_id",
                as: "quotationStatus",  
            },          
        },
        { $unwind: "$quotationStatus" },
        // 5️⃣ Lookup - customer details
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
        // 6️⃣ Lookup - vehicle details
        {
            $lookup: {
                from: "customervehiclemodels",
                localField: "ticket.vehicleId",
                foreignField: "_id",
                as: "vehicle",
            },
        },
        { $unwind: { path: "$vehicle", preserveNullAndEmptyArrays: true } },
        // 7️⃣ Lookup - vehicle brand
        {
            $lookup: {
                from: "vechiclebrands",
                localField: "vehicle.vehicleBrandId",
                foreignField: "_id",
                as: "vehicleBrand",
            },
        },
        { $unwind: { path: "$vehicleBrand", preserveNullAndEmptyArrays: true } },
        // 8️⃣ Lookup - vehicle model
        {
            $lookup: {
                from: "vechiclemodels",
                localField: "vehicle.vehicleModelId",
                foreignField: "_id",
                as: "vehicleModel",
            },
        },
        { $unwind: { path: "$vehicleModel", preserveNullAndEmptyArrays: true } },
        // 9️⃣ Lookup - parts details
        {
            $lookup: {
                from: "parts",
                localField: "partsList",
                foreignField: "_id",
                as: "partsDetails",
            },
        },
        // 🔟 Add fields to preserve original partsList array
        {
            $addFields: {
                originalPartsList: "$partsList",
                debugVehicle: {
                    hasVehicle: { $cond: [{ $ifNull: ["$vehicle._id", false] }, true, false] },
                    hasBrand: { $cond: [{ $ifNull: ["$vehicleBrand.brandName", false] }, true, false] },
                    hasModel: { $cond: [{ $ifNull: ["$vehicleModel.modelName", false] }, true, false] },
                    vehicleId: "$ticket.vehicleId"
                }
            }
        },

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
        technicianId: 1,
        labourTime: 1,
        labourRate: 1,
        partTotalBill: 1,
        labourTotalBill: 1,
        subTotalBill: 1,
        taxAmount: 1,
        netTotal: 1,
        aditionalNotes: 1,
        validityDate: 1,
        createdAt: 1,
        updatedAt: 1,
        ticket: {
          _id: "$ticket._id",
          ticketCode: "$ticket.ticketCode",
          issue_Details: "$ticket.issue_Details",
          pay_by: "$ticket.decisionId",
          ticketStatus: { $ifNull: ["$ticketStatusDetails.label", "$ticketStatusDetails.code"] },
          customer: {
            _id: "$customer._id",
            firstName: "$person.firstName",
            lastName: "$person.lastName",
            email: "$contact.emailId",
          },
          vehicle: {
            _id: "$vehicle._id",
            vehicleBrandId: {
              _id: "$vehicleBrand._id",
              brandName: "$vehicleBrand.brandName",
            },
            vehicleModelId: {
              _id: "$vehicleModel._id",
              modelName: "$vehicleModel.modelName",
            },
          },
        },
        quotationStatus: "$quotationStatus.ticketQuationStatus",
        partsList: {
          $map: {
            input: "$originalPartsList",
            as: "partId",
            in: {
              $let: {
                vars: {
                  matchedPart: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$partsDetails",
                          as: "detail",
                          cond: { $eq: ["$$detail._id", "$$partId"] }
                        }
                      },
                      0
                    ]
                  }
                },
                in: {
                  _id: "$$matchedPart._id",
                  partName: "$$matchedPart.partName",
                  partNumber: "$$matchedPart.partNumber",
                  unitCost: "$$matchedPart.unitCost",
                  stock: "$$matchedPart.stock",
                  description: "$$matchedPart.description",
                  quantity: 1
                }
              }
            }
          }
        },
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
        debugVehicle: 1,
      },
    });

    const quotations = await TicketQuations.aggregate(pipeline);
    console.log("Technician Quotations Aggregation Result:", JSON.stringify(quotations, null, 2));
    
    // Log specific quotation details for debugging
    if (quotations.length > 0) {
      console.log("First quotation partsList length:", quotations[0].partsList?.length);
      console.log("First quotation partsList:", JSON.stringify(quotations[0].partsList, null, 2));
      console.log("First quotation originalPartsList:", quotations[0].originalPartsList);
      console.log("First quotation ticket:", JSON.stringify(quotations[0].ticket, null, 2));
      console.log("First quotation vehicle:", JSON.stringify(quotations[0].ticket?.vehicle, null, 2));
      console.log("First quotation customer:", JSON.stringify(quotations[0].ticket?.customer, null, 2));
      console.log("First quotation partsList:", quotations[0].partsList);
    }
    
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


