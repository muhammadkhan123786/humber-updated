import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";

import { TechniciansJobs } from "../../models/technician-jobs-models/technician.jobs.models";
import { TechnicianJobStatus } from "../../models/master-data-models/technician.job.status.models";
import { customerTicketBase } from "../../models/ticket-management-system-models/customer.ticket.base.models";
import { TechnicianAuthRequest } from "../../middleware/auth.middleware";

export const technicianJobsStatisticsController = async (
    req: Request,
    res: Response
) => {
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const result = await TechnicianJobStatus.aggregate([
            {
                $facet: {
                    // ✅ 1️⃣ STATUS COUNTS (Show ALL statuses)
                    statusCounts: [
                        {
                            $lookup: {
                                from: "techniciansjobs",
                                let: { statusId: "$_id" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    {
                                                        $eq: [
                                                            {
                                                                $cond: [
                                                                    { $eq: [{ $type: "$jobStatusId" }, "string"] },
                                                                    { $toObjectId: "$jobStatusId" },
                                                                    "$jobStatusId"
                                                                ]
                                                            },
                                                            "$$statusId"
                                                        ]
                                                    },
                                                    { $eq: ["$isDeleted", false] }
                                                ]
                                            }
                                        }
                                    },
                                    { $count: "totalJobs" }
                                ],
                                as: "jobsData"
                            }
                        },
                        {
                            $addFields: {
                                totalJobs: {
                                    $ifNull: [
                                        { $arrayElemAt: ["$jobsData.totalJobs", 0] },
                                        0
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                technicianJobStatus: 1,
                                totalJobs: 1
                            }
                        }
                    ],

                    // ✅ 2️⃣ OVERALL TOTAL JOBS (REAL JOBS COLLECTION)
                    overallTotal: [
                        {
                            $lookup: {
                                from: "techniciansjobs",
                                pipeline: [
                                    { $match: { isDeleted: false } },
                                    { $count: "overallTotalJobs" }
                                ],
                                as: "overall"
                            }
                        },
                        {
                            $unwind: {
                                path: "$overall",
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        {
                            $limit: 1
                        },
                        {
                            $project: {
                                overallTotalJobs: "$overall.overallTotalJobs"
                            }
                        }
                    ],

                    // ✅ 3️⃣ TODAY JOBS
                    todayJobs: [
                        {
                            $lookup: {
                                from: "techniciansjobs",
                                pipeline: [
                                    {
                                        $match: {
                                            isDeleted: false,
                                            createdAt: { $gte: todayStart }
                                        }
                                    },
                                    { $count: "todayJobs" }
                                ],
                                as: "today"
                            }
                        },
                        { $unwind: { path: "$today", preserveNullAndEmptyArrays: true } },
                        { $limit: 1 },
                        {
                            $project: {
                                todayJobs: "$today.todayJobs"
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    statusCounts: 1,
                    technicianJobStatus: 1,
                    overallTotalJobs: {
                        $ifNull: [
                            { $arrayElemAt: ["$overallTotal.overallTotalJobs", 0] },
                            0
                        ]
                    },
                    todayJobs: {
                        $ifNull: [
                            { $arrayElemAt: ["$todayJobs.todayJobs", 0] },
                            0
                        ]
                    }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            data: result[0] || {
                statusCounts: [],
                overallTotalJobs: 0,
                todayJobs: 0
            }
        });

    } catch (error) {
        console.error("Technician Jobs Statistics Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch technician job statistics."
        });
    }
};

export const assignTicketToTechnicianController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;          // ✅ ticketId
        const { technicianId } = req.body;  // ✅ technicianId

        // Validate ObjectIds
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ticketId" });
        }

        if (!Types.ObjectId.isValid(technicianId)) {
            return res.status(400).json({ message: "Invalid technicianId" });
        }

        // ✅ Add technician into array (NO DUPLICATES)
        const updatedTicket = await customerTicketBase.findByIdAndUpdate(
            id,
            {
                $addToSet: {
                    assignedTechnicianId: technicianId
                }
            },
            { new: true }
        ).populate("assignedTechnicianId");

        if (!updatedTicket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Technician assigned successfully",
            data: updatedTicket,
        });

    } catch (error) {
        console.error("Assign Technician Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to assign technician.",
        });
    }
};


export const technicianDashboardJobsStatisticsController = async (
    req: TechnicianAuthRequest,
    res: Response
) => {
    try {
        const technicianId = req.technicianId; // 👈 middleware se
        if (!technicianId)
            return res.status(400).json({ success: false, message: "Technician not found" });

        const technicianObjectId = new Types.ObjectId(technicianId);

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const result = await TechnicianJobStatus.aggregate([
            {
                $facet: {

                    // ✅ STATUS COUNTS (TECHNICIAN BASED)
                    statusCounts: [
                        {
                            $lookup: {
                                from: "techniciansjobs",
                                let: { statusId: "$_id" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    {
                                                        $eq: [
                                                            {
                                                                $cond: [
                                                                    { $eq: [{ $type: "$jobStatusId" }, "string"] },
                                                                    { $toObjectId: "$jobStatusId" },
                                                                    "$jobStatusId"
                                                                ]
                                                            },
                                                            "$$statusId"
                                                        ]
                                                    },
                                                    { $eq: ["$technicianId", technicianObjectId] }, // ✅ FILTER ADDED
                                                    { $eq: ["$isDeleted", false] }
                                                ]
                                            }
                                        }
                                    },
                                    { $count: "totalJobs" }
                                ],
                                as: "jobsData"
                            }
                        },
                        {
                            $addFields: {
                                totalJobs: {
                                    $ifNull: [{ $arrayElemAt: ["$jobsData.totalJobs", 0] }, 0]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                technicianJobStatus: 1,
                                totalJobs: 1
                            }
                        }
                    ],

                    // ✅ OVERALL TOTAL (TECHNICIAN BASED)
                    overallTotal: [
                        {
                            $lookup: {
                                from: "techniciansjobs",
                                pipeline: [
                                    {
                                        $match: {
                                            isDeleted: false,
                                            technicianId: technicianObjectId // ✅ FILTER ADDED
                                        }
                                    },
                                    { $count: "overallTotalJobs" }
                                ],
                                as: "overall"
                            }
                        },
                        { $unwind: { path: "$overall", preserveNullAndEmptyArrays: true } },
                        { $limit: 1 },
                        {
                            $project: {
                                overallTotalJobs: "$overall.overallTotalJobs"
                            }
                        }
                    ],

                    // ✅ TODAY JOBS (TECHNICIAN BASED)
                    todayJobs: [
                        {
                            $lookup: {
                                from: "techniciansjobs",
                                pipeline: [
                                    {
                                        $match: {
                                            isDeleted: false,
                                            technicianId: technicianObjectId, // ✅ FILTER ADDED
                                            createdAt: { $gte: todayStart }
                                        }
                                    },
                                    { $count: "todayJobs" }
                                ],
                                as: "today"
                            }
                        },
                        { $unwind: { path: "$today", preserveNullAndEmptyArrays: true } },
                        { $limit: 1 },
                        {
                            $project: {
                                todayJobs: "$today.todayJobs"
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    statusCounts: 1,
                    overallTotalJobs: {
                        $ifNull: [{ $arrayElemAt: ["$overallTotal.overallTotalJobs", 0] }, 0]
                    },
                    todayJobs: {
                        $ifNull: [{ $arrayElemAt: ["$todayJobs.todayJobs", 0] }, 0]
                    }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            data:
                result[0] || {
                    statusCounts: [],
                    overallTotalJobs: 0,
                    todayJobs: 0
                }
        });
    } catch (error) {
        console.error("Technician Jobs Statistics Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch technician job statistics."
        });
    }
};


//technician active jobs 
export const technicianActiveJobsCountController = async (
    req: Request,
    res: Response
) => {
    try {
        const { technicianId } = req.body;

        // ✅ Validate ObjectId
        if (!Types.ObjectId.isValid(technicianId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid technicianId",
            });
        }

        // ✅ Count ONLY this technician active jobs
        const totalActiveJobs = await TechniciansJobs.countDocuments({
            technicianId: new Types.ObjectId(technicianId), // 👈 IMPORTANT FILTER
            isDeleted: false,
            isActive: true,
        });

        return res.status(200).json({
            success: true,
            message: "Technician active jobs count successfully",
            totalActiveJobs,
        });
    } catch (error) {
        console.error("Technician Active Jobs Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get technician active jobs count.",
        });
    }
};
