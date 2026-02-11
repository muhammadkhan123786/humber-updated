import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
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
                    // 1️⃣ Count jobs per status from master table
                    statusCounts: [
                        {
                            $lookup: {
                                from: "technicianjobs", // exact collection name
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
                                    $ifNull: [{ $arrayElemAt: ["$jobsData.totalJobs", 0] }, 0]
                                }
                            }
                        },
                        {
                            $project: { _id: 1, statusName: 1, totalJobs: 1, jobsData: 0 }
                        }
                    ],

                    // 2️⃣ Overall total jobs
                    overallTotal: [
                        {
                            $match: { isDeleted: false } // only active jobs
                        },
                        { $count: "overallTotalJobs" }
                    ],

                    // 3️⃣ Today’s jobs
                    todayJobs: [
                        {
                            $match: {
                                isDeleted: false,
                                createdAt: { $gte: todayStart }
                            }
                        },
                        { $count: "todayJobs" }
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
            data: result[0] // aggregation returns array, so take first element
        });
    } catch (error) {
        console.error("Technician Jobs Statistics Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch technician job statistics."
        });
    }
};
