import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";

import { TechniciansJobs } from "../../models/technician-jobs-models/technician.jobs.models";
import { TechnicianJobStatus } from "../../models/master-data-models/technician.job.status.models";

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
