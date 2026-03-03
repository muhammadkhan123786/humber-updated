import { Response } from "express";
import { SortOrder, Types } from "mongoose";
import { RIDER_STATUS } from "../../schemas/rider-schemas/rider.schema";
import { AuthRequest } from "../../middleware/auth.middleware";
import { Riders } from "../../models/rider/rider.models";

export type ActivityStatus = typeof RIDER_STATUS[number];

export const getAllRiders = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
      search,
      riderStatus,
      filter,
    } = req.query;

    const pageNumber = Number(page);
    const pageSize = Number(limit);

    const queryFilters: Record<string, any> = { isDeleted: false };

    // 🔹 Multi-tenant / ownership filter
    if (req.user && req.user.id) {
      queryFilters.accountId = new Types.ObjectId(req.user.id);
    }
    // 🔹 Multi-field search (adjust fields as needed)
    if (search) {
      queryFilters.$or = [
        { riderAutoId: { $regex: search as string, $options: "i" } },
        { phoneNumber: { $regex: search as string, $options: "i" } },
        { "personId.firstName": { $regex: search as string, $options: "i" } },
        { "personId.lastName": { $regex: search as string, $options: "i" } },
      ];
    }
    // 🔹 Multi-status filter (TypeScript-safe)
    if (riderStatus) {
      const statuses = (riderStatus as string)
        .split(",")
        .filter((s): s is ActivityStatus => RIDER_STATUS.includes(s as ActivityStatus));

      if (statuses.length) {
        queryFilters.riderStatus = { $in: statuses };
      }
    }
    // 🔹 Sorting
    const sortOption: Record<string, SortOrder> = {};
    sortOption[sortBy as string] = (order === "asc" ? 1 : -1) as SortOrder;

    // 🔹 Count total records for pagination
    const total = await Riders.countDocuments(queryFilters);

    // 🔹 Statistics by riderStatus for this admin/user
    const statsAgg = await Riders.aggregate([
      { $match: { isDeleted: false, accountId: new Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: "$riderStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    const statistics: Record<ActivityStatus, number> = {} as Record<ActivityStatus, number>;
    RIDER_STATUS.forEach((status) => (statistics[status] = 0));
    statsAgg.forEach((s) => (statistics[s._id as ActivityStatus] = s.count));

    // 🔹 Pagination query
    let query = Riders.find(queryFilters)
      .sort(sortOption)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .populate("personId") // optional
      .populate("contactId");

    // 🔹 If filter=all, skip pagination
    if (filter === "all") {
      query = Riders.find(queryFilters).sort(sortOption);
    }

    const data = await query.exec();

    res.status(200).json({
      success: true,
      total,
      page: filter === "all" ? 1 : pageNumber,
      limit: filter === "all" ? total : pageSize,
      data,
      statistics,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch riders",
    });
  }
};