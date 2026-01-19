import { GenericService } from "../services/generic.crud.services";
import { CustomerBaseDoc, domesticCutomerSchema, corporateCustomerSchema, CustomerBase } from "../models/customer.models";
import { domesticCustomerSchema } from "../schemas/domestic.customer.schema";
import { corporateCustomerValidationSchema } from "../schemas/corporate.customer.schema";
import { Request, Response, NextFunction } from "express";

//utlity functions 
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);

const startOfWeek = (d: Date) => {
    const day = d.getDay() || 7; // Sunday = 7
    const diff = d.getDate() - day + 1; // Monday
    return startOfDay(new Date(d.setDate(diff)));
};

const endOfWeek = (d: Date) => {
    const start = startOfWeek(new Date(d));
    return endOfDay(new Date(start.setDate(start.getDate() + 6)));
};

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

const startOfYear = (d: Date) => new Date(d.getFullYear(), 0, 1);
const endOfYear = (d: Date) => new Date(d.getFullYear(), 11, 31, 23, 59, 59);

const toYMD = (d: Date) => d.toISOString().slice(0, 10);

const generateDailyPeriods = (start: Date, end: Date) => {
    const days: string[] = [];
    const current = new Date(start);

    while (current <= end) {
        days.push(toYMD(current));
        current.setDate(current.getDate() + 1);
    }
    return days;
};

const generateMonthlyPeriods = (year: number) =>
    Array.from({ length: 12 }, (_, i) =>
        `${year}-${String(i + 1).padStart(2, "0")}`
    );

const generateWeeklyPeriods = (start: Date, end: Date) => {
    const weeks: string[] = [];
    const current = new Date(start);

    while (current <= end) {
        const year = current.getFullYear();

        // week number of the year (0-53)
        const onejan = new Date(year, 0, 1);
        const weekNum = Math.floor(
            ((current.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7
        );

        const period = `${year}-${String(weekNum).padStart(2, "0")}`;

        if (!weeks.includes(period)) weeks.push(period);

        // jump to next week
        current.setDate(current.getDate() + 7);
    }

    return weeks;
};


const zeroFill = (periods: string[], data: any[]) => {
    const map = new Map(
        data.map((item) => [item.period, item])
    );

    return periods.map((p) => ({
        period: p,
        total: map.get(p)?.total ?? 0,
        domestic: map.get(p)?.domestic ?? 0,
        corporate: map.get(p)?.corporate ?? 0,
    }));
};





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
        const { filter, from, to } = req.query as {
            filter?: "daily" | "weekly" | "monthly";
            from?: string;
            to?: string;
        };

        const now = new Date();
        const match: any = {};

        let rangeStart!: Date;
        let rangeEnd!: Date;

        // 🔹 1. Custom range
        if (from && to) {
            rangeStart = new Date(from);
            rangeEnd = new Date(to);
            match.createdAt = { $gte: rangeStart, $lte: rangeEnd };
        } else {
            if (filter === "daily") {
                rangeStart = startOfWeek(new Date(now));
                rangeEnd = endOfWeek(new Date(now));
            }

            if (filter === "weekly") {
                rangeStart = startOfMonth(now);
                rangeEnd = endOfMonth(now);
            }

            if (filter === "monthly") {
                rangeStart = startOfYear(now);
                rangeEnd = endOfYear(now);
            }

            match.createdAt = { $gte: rangeStart, $lte: rangeEnd };
        }

        // 🔹 2. Grouping key
        let groupId: any;

        switch (filter) {
            case "daily":
                groupId = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
                break;

            case "weekly":
                groupId = { $dateToString: { format: "%Y-%U", date: "$createdAt" } };
                break;

            case "monthly":
                groupId = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
                break;

            default:
                groupId = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        }

        // 🔹 3. Mongo aggregation
        const mongoResult = await CustomerBase.aggregate([
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

        const formattedMongo = mongoResult.map((s) => ({
            period: s._id,
            total: s.total,
            domestic: s.domestic,
            corporate: s.corporate,
        }));

        // 🔹 4. Generate expected periods
        let periods: string[] = [];

        if (filter === "daily") {
            periods = generateDailyPeriods(rangeStart, rangeEnd);
        }

        if (filter === "weekly") {
            periods = generateWeeklyPeriods(rangeStart, rangeEnd);
        }

        if (filter === "monthly") {
            periods = generateMonthlyPeriods(rangeStart.getFullYear());
        }

        // 🔹 5. Zero fill
        const result = zeroFill(periods, formattedMongo);

        res.json(result);
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
