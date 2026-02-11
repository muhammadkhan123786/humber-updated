import { Request, Response } from "express";
import { TechnicianJobStatus } from "../../models/master-data-models/technician.job.status.models";

export const technicianJobsStatisticsController = async (
    req: Request,
    res: Response
) => {
    try {
        const result = await TechnicianJobStatus.aggregate([
            {
                $facet: {

                    /* ===================================================
                       ✅ 1. STATUS COUNTS (Master Driven)
                    ==================================================== */
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
                                                    { $eq: ["$jobStatusId", "$$statusId"] },
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
                                jobsData: 0
                            }
                        }
                    ],

                    /* ===================================================
                       ✅ 2. OVERALL TOTAL JOBS
                    ==================================================== */
                    overallTotal: [
                        {
                            $lookup: {
                                from: "techniciansjobs",
                                pipeline: [
                                    { $match: { isDeleted: false } },
                                    { $count: "overallTotalJobs" }
                                ],
                                as: "data"
                            }
                        },
                        {
                            $project: {
                                overallTotalJobs: {
                                    $ifNull: [
                                        { $arrayElemAt: ["$data.overallTotalJobs", 0] },
                                        0
                                    ]
                                }
                            }
                        }
                    ],

                    /* ===================================================
                       ✅ 3. EXTRA DASHBOARD STATS (OPTIONAL)
                    ==================================================== */
                    stats: [
                        {
                            $lookup: {
                                from: "techniciansjobs",
                                pipeline: [
                                    { $match: { isDeleted: false } },
                                    {
                                        $group: {
                                            _id: null,
                                            completedJobs: {
                                                $sum: {
                                                    $cond: [
                                                        { $eq: ["$jobStatusName", "Completed"] }, // adjust if needed
                                                        1,
                                                        0
                                                    ]
                                                }
                                            },
                                            pendingJobs: {
                                                $sum: {
                                                    $cond: [
                                                        { $eq: ["$jobStatusName", "Pending"] },
                                                        1,
                                                        0
                                                    ]
                                                }
                                            },
                                            todayJobs: {
                                                $sum: {
                                                    $cond: [
                                                        {
                                                            $gte: [
                                                                "$createdAt",
                                                                new Date(new Date().setHours(0, 0, 0, 0))
                                                            ]
                                                        },
                                                        1,
                                                        0
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                ],
                                as: "data"
                            }
                        },
                        {
                            $project: {
                                stats: { $arrayElemAt: ["$data", 0] }
                            }
                        }
                    ]
                }
            },

            /* ===================================================
               ✅ FINAL CLEAN RESPONSE SHAPE
            ==================================================== */
            {
                $project: {
                    statusCounts: 1,
                    overallTotalJobs: {
                        $arrayElemAt: ["$overallTotal.overallTotalJobs", 0]
                    },
                    stats: {
                        $arrayElemAt: ["$stats.stats", 0]
                    }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            data: result
        });




    } catch (error) {
        console.error("Technician Jobs Statistics Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch technician job statistics failed.",
        });
    }
};