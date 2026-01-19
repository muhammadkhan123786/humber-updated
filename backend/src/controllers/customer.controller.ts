import { GenericService } from "../services/generic.crud.services";
import { CustomerBaseDoc, domesticCutomerSchema, corporateCustomerSchema, CustomerBase } from "../models/customer.models";
import { domesticCustomerSchema } from "../schemas/domestic.customer.schema";
import { corporateCustomerValidationSchema } from "../schemas/corporate.customer.schema";
import { Request, Response, NextFunction } from "express";



const domesticServices = new GenericService<CustomerBaseDoc>(domesticCutomerSchema);

const corporateServices = new GenericService<CustomerBaseDoc>(corporateCustomerSchema);

export const saveCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { customerType } = req.body;
        let targetService: GenericService<CustomerBaseDoc>;
        let validationSchema;

        if (customerType === "domestic") {
            targetService = domesticServices;
            validationSchema = domesticCustomerSchema;
        } else if (customerType === "corporate") {
            targetService = corporateServices;
            validationSchema = corporateCustomerValidationSchema;
        } else {
            return res.status(400).json({ message: "Invalid customer type" });
        }

        // ✅ Validate input
        const parseResult = validationSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: parseResult.error.issues
            });
        }

        /* =========================
           CREATE
        ========================== */
        if (!id) {
            const customer = await targetService.create(req.body);
            return res.status(201).json({
                message: "Customer created successfully",
                data: customer
            });
        }

        // Fetch customer from BOTH collections
        const existingCustomer =
            (await domesticServices.getById(id)) ||
            (await corporateServices.getById(id));

        if (!existingCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        /* =========================
           TYPE CONVERSION
        ========================== */
        if (existingCustomer.customerType !== customerType) {

            // 1️⃣ Archive old customer
            const oldService =
                existingCustomer.customerType === "domestic"
                    ? domesticServices
                    : corporateServices;

            await oldService.updateById(existingCustomer._id.toString(), {
                isDeleted: true,
                convertedAt: new Date()
            });

            // 2️⃣ Create new customer
            const newCustomer = await targetService.create({
                ...req.body,
                previousCustomerId: existingCustomer._id
            });

            // 3️⃣ Link both
            await oldService.updateById(existingCustomer._id.toString(), {
                convertedToCustomerId: newCustomer._id
            });

            return res.status(201).json({
                message: "Customer converted successfully",
                data: newCustomer
            });
        }

        /* =========================
           NORMAL UPDATE
        ========================== */
        const updatedCustomer = await targetService.updateById(id, req.body);

        return res.status(200).json({
            message: "Customer updated successfully",
            data: updatedCustomer
        });

    } catch (error) {
        next(error);
    }
};


export const getCustomerSummary = async (req: Request, res: Response) => {
    try {
        console.log("Get Customer Summary");

        const { filter, from, to } = req.query as { filter?: string; from?: string; to?: string };

        const match: any = {};

        // 1️⃣ Custom date range filter
        if (from && to) {
            match.createdAt = {
                $gte: new Date(from),
                $lte: new Date(to),
            };
        }

        // 2️⃣ Determine grouping key
        let groupId: any = null;
        switch (filter) {
            case "daily":
                groupId = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
                break;
            case "weekly":
                groupId = { $dateToString: { format: "%Y-%U", date: "$createdAt" } }; // %U = week number
                break;
            case "monthly":
                groupId = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
                break;
            default:
                groupId = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        }

        // 3️⃣ Aggregate with customerType counts
        const summary = await CustomerBase.aggregate([
            { $match: match },
            {
                $group: {
                    _id: groupId,
                    total: { $sum: 1 },
                    domestic: {
                        $sum: { $cond: [{ $eq: ["$customerType", "domestic"] }, 1, 0] },
                    },
                    corporate: {
                        $sum: { $cond: [{ $eq: ["$customerType", "corporate"] }, 1, 0] },
                    },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // 4️⃣ Format response
        const formatted = summary.map((s) => ({
            period: s._id,
            total: s.total,
            domestic: s.domestic,
            corporate: s.corporate,
        }));

        res.json(formatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const percentage = (current: number, last: number) => {
    if (last === 0) {
        if (current === 0) return 0;
        return 100;
    }
    return Math.round(((current - last) / last) * 100);
};


export const getCustomerDashboardSummary = async (
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

        const result = await CustomerBase.aggregate([
            {
                $facet: {
                    // 🔢 Current totals by type
                    currentByType: [
                        {
                            $group: {
                                _id: "$customerType",
                                count: { $sum: 1 },
                            },
                        },
                    ],

                    // 🔢 Last month totals by type
                    lastMonthByType: [
                        {
                            $match: {
                                createdAt: {
                                    $gte: startOfLastMonth,
                                    $lte: endOfLastMonth,
                                },
                            },
                        },
                        {
                            $group: {
                                _id: "$customerType",
                                count: { $sum: 1 },
                            },
                        },
                    ],

                    // 👤 Active customers (current)
                    activeCurrent: [
                        { $match: { isActive: true } },
                        { $count: "count" },
                    ],

                    // 👤 Active customers (last month)
                    activeLastMonth: [
                        {
                            $match: {
                                isActive: true,
                                createdAt: {
                                    $gte: startOfLastMonth,
                                    $lte: endOfLastMonth,
                                },
                            },
                        },
                        { $count: "count" },
                    ],

                    // 📦 Total current
                    totalCurrent: [{ $count: "count" }],

                    // 📦 Total last month
                    totalLastMonth: [
                        {
                            $match: {
                                createdAt: {
                                    $gte: startOfLastMonth,
                                    $lte: endOfLastMonth,
                                },
                            },
                        },
                        { $count: "count" },
                    ],
                },
            },
        ]);

        const data = result[0];

        const getTypeCount = (arr: any[], type: string) =>
            arr.find((x) => x._id === type)?.count || 0;

        const currentDomestic = getTypeCount(data.currentByType, "domestic");
        const currentCorporate = getTypeCount(data.currentByType, "corporate");

        const lastDomestic = getTypeCount(data.lastMonthByType, "domestic");
        const lastCorporate = getTypeCount(data.lastMonthByType, "corporate");

        const totalCurrent = data.totalCurrent[0]?.count || 0;
        const totalLast = data.totalLastMonth[0]?.count || 0;

        const activeCurrent = data.activeCurrent[0]?.count || 0;
        const activeLast = data.activeLastMonth[0]?.count || 0;

        res.json({
            total: {
                current: totalCurrent,
                lastMonth: totalLast,
                percentage: percentage(totalCurrent, totalLast),
            },
            domestic: {
                current: currentDomestic,
                lastMonth: lastDomestic,
                percentage: percentage(currentDomestic, lastDomestic),
            },
            corporate: {
                current: currentCorporate,
                lastMonth: lastCorporate,
                percentage: percentage(currentCorporate, lastCorporate),
            },
            active: {
                current: activeCurrent,
                lastMonth: activeLast,
                percentage: percentage(activeCurrent, activeLast),
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Customer summary failed" });
    }
};
