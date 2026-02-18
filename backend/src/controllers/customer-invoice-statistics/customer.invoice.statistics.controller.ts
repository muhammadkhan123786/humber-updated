import { Request, Response } from "express";
import { CustomerJobsInvoices } from "../../models/invoice-jobs/invoice.jobs.models";

export const customerInvoiceStatisticsController = async (
    req: Request,
    res: Response
) => {
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const result = await CustomerJobsInvoices.aggregate([
            {
                $match: { isDeleted: false }
            },
            {
                $facet: {
                    /* =========================
                       1️⃣ STATUS COUNTS
                    ========================= */
                    statusCounts: [
                        {
                            $group: {
                                _id: "$status",
                                count: { $sum: 1 },
                            },
                        },
                    ],

                    /* =========================
                       2️⃣ TOTAL INVOICES
                    ========================= */
                    totalInvoices: [
                        { $count: "total" }
                    ],

                    /* =========================
                       3️⃣ TODAY INVOICES
                    ========================= */
                    todayInvoices: [
                        {
                            $match: {
                                createdAt: { $gte: todayStart },
                            },
                        },
                        { $count: "today" }
                    ],
                },
            },
        ]);

        const data = result[0] || {};

        /* =========================
           Ensure ALL statuses return
        ========================= */

        const defaultStatuses = {
            DRAFT: 0,
            ISSUED: 0,
            CANCELLED: 0,
            PAID: 0,
        };

        if (data.statusCounts) {
            data.statusCounts.forEach((item: any) => {
                defaultStatuses[item._id] = item.count;
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                statusCounts: defaultStatuses,
                totalInvoices: data.totalInvoices?.[0]?.total || 0,
                todayInvoices: data.todayInvoices?.[0]?.today || 0,
            },
        });

    } catch (error) {
        console.error("Invoice Statistics Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch invoice statistics.",
        });
    }
};
