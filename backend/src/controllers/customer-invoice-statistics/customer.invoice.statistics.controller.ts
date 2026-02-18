import { Request, Response } from "express";
import { CustomerJobsInvoices } from "../../models/invoice-jobs/invoice.jobs.models";

export const customerInvoiceStatisticsController = async (
    req: Request,
    res: Response
) => {
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const now = new Date();

        const result = await CustomerJobsInvoices.aggregate([
            {
                $match: { isDeleted: false }
            },
            {
                $facet: {

                    /* =========================
                       1️⃣ STATUS COUNTS + AMOUNT
                    ========================= */
                    statusCounts: [
                        {
                            $group: {
                                _id: "$status",
                                count: { $sum: 1 },
                                totalAmount: { $sum: "$netTotal" },
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

                    /* =========================
                       4️⃣ OVERDUE INVOICES
                    ========================= */
                    overdueInvoices: [
                        {
                            $match: {
                                dueDate: { $lt: now },
                                status: { $nin: ["PAID", "CANCELLED"] }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: 1 },
                                totalAmount: { $sum: "$netTotal" }
                            }
                        }
                    ],

                    /* =========================
                       5️⃣ PAID INVOICES
                    ========================= */
                    paidInvoices: [
                        {
                            $match: { status: "PAID" }
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: 1 },
                                totalAmount: { $sum: "$netTotal" }
                            }
                        }
                    ],
                },
            },
        ]);

        const data = result[0] || {};

        const defaultStatuses: any = {
            DRAFT: { count: 0, amount: 0 },
            ISSUED: { count: 0, amount: 0 },
            CANCELLED: { count: 0, amount: 0 },
            PAID: { count: 0, amount: 0 },
        };

        if (data.statusCounts) {
            data.statusCounts.forEach((item: any) => {
                defaultStatuses[item._id] = {
                    count: item.count,
                    amount: item.totalAmount || 0,
                };
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                statusCounts: defaultStatuses,
                totalInvoices: data.totalInvoices?.[0]?.total || 0,
                todayInvoices: data.todayInvoices?.[0]?.today || 0,

                overdue: {
                    count: data.overdueInvoices?.[0]?.count || 0,
                    amount: data.overdueInvoices?.[0]?.totalAmount || 0,
                },

                paid: {
                    count: data.paidInvoices?.[0]?.count || 0,
                    amount: data.paidInvoices?.[0]?.totalAmount || 0,
                },
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
