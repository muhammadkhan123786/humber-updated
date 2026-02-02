import { Technicians } from "../models/technician-models/technician.models";
import { Request, Response } from "express";

const percentage = (current: number, last: number) => {
    if (last === 0) {
        if (current === 0) return 0;
        return 100;
    }
    return Math.round(((current - last) / last) * 100);
};

export const getTechnicianDashboardSummary = async (
    req: Request,
    res: Response
) => {
    try {
        const now = new Date();

        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            0,
            23,
            59,
            59
        );

        const result = await Technicians.aggregate([
            {
                $facet: {
                    // 👨‍🔧 Total technicians (current)
                    totalCurrent: [
                        { $match: { isDeleted: { $ne: true } } },
                        { $count: "count" },
                    ],

                    // 👨‍🔧 Total technicians (last month)
                    totalLastMonth: [
                        {
                            $match: {
                                isDeleted: { $ne: true },
                                createdAt: {
                                    $gte: startOfLastMonth,
                                    $lte: endOfLastMonth,
                                },
                            },
                        },
                        { $count: "count" },
                    ],

                    // ✅ Active technicians (current)
                    activeCurrent: [
                        { $match: { isActive: true, isDeleted: { $ne: true } } },
                        { $count: "count" },
                    ],

                    // ✅ Active technicians (last month)
                    activeLastMonth: [
                        {
                            $match: {
                                isActive: true,
                                isDeleted: { $ne: true },
                                createdAt: {
                                    $gte: startOfLastMonth,
                                    $lte: endOfLastMonth,
                                },
                            },
                        },
                        { $count: "count" },
                    ],

                    // 🟢 Available technicians
                    availableCurrent: [
                        {
                            $match: {
                                technicianStatus: "Available",
                                isDeleted: { $ne: true },
                            },
                        },
                        { $count: "count" },
                    ],

                    // 🔴 Busy technicians
                    busyCurrent: [
                        {
                            $match: {
                                technicianStatus: "Busy",
                                isDeleted: { $ne: true },
                            },
                        },
                        { $count: "count" },
                    ],
                },
            },
        ]);

        const data = result[0];

        const getCount = (arr: any[]) => arr[0]?.count || 0;

        const totalCurrent = getCount(data.totalCurrent);
        const totalLast = getCount(data.totalLastMonth);

        const activeCurrent = getCount(data.activeCurrent);
        const activeLast = getCount(data.activeLastMonth);

        const available = getCount(data.availableCurrent);
        const busy = getCount(data.busyCurrent);

        res.json({
            total: {
                current: totalCurrent,
                lastMonth: totalLast,
                percentage: percentage(totalCurrent, totalLast),
            },
            active: {
                current: activeCurrent,
                lastMonth: activeLast,
                percentage: percentage(activeCurrent, activeLast),
            },
            status: {
                available,
                busy,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Technician dashboard summary failed" });
    }
};
