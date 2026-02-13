import { Request, Response, NextFunction } from "express";
import { TechnicianAuthRequest } from "../../../middleware/auth.middleware";
import { TechnicianJobStatus } from "../../../models/master-data-models/technician.job.status.models";
import { Types } from "mongoose";
export const technicianDashboardJobsStatisticsController = async (
    req: TechnicianAuthRequest,
    res: Response
) => {
    try {
        const technicianId = req.technicianId;

        if (!technicianId) {
            return res.status(400).json({
                success: false,
                message: "TechnicianId missing from middleware",
            });
        }

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const result = await TechnicianJobStatus.aggregate([
            {
                $facet: {
                    // ✅ STATUS COUNTS (ONLY TECHNICIAN JOBS)
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
                                                    { $eq: ["$technicianId", new Types.ObjectId(technicianId)] }, // ✅ IMPORTANT
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

                    // ✅ OVERALL TOTAL JOBS (ONLY THIS TECHNICIAN)
                    overallTotal: [
                        {
                            $lookup: {
                                from: "techniciansjobs",
                                pipeline: [
                                    {
                                        $match: {
                                            isDeleted: false,
                                            technicianId: new Types.ObjectId(technicianId) // ✅ IMPORTANT
                                        }
                                    },
                                    { $count: "overallTotalJobs" }
                                ],
                                as: "overall"
                            }
                        },
                        {
                            $unwind: { path: "$overall", preserveNullAndEmptyArrays: true }
                        },
                        { $limit: 1 },
                        {
                            $project: {
                                overallTotalJobs: "$overall.overallTotalJobs"
                            }
                        }
                    ],

                    // ✅ TODAY JOBS (ONLY THIS TECHNICIAN)
                    todayJobs: [
                        {
                            $lookup: {
                                from: "techniciansjobs",
                                pipeline: [
                                    {
                                        $match: {
                                            isDeleted: false,
                                            technicianId: new Types.ObjectId(technicianId), // ✅ IMPORTANT
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
