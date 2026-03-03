import { Response } from "express";
import { SortOrder, Types } from "mongoose";
import { RIDER_STATUS } from "../../schemas/rider-schemas/rider.schema";
import { AuthRequest } from "../../middleware/auth.middleware";
import { Riders } from "../../models/rider/rider.models";

export type ActivityStatus = (typeof RIDER_STATUS)[number];

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

    const queryFilters: Record<string, any> = {
      isDeleted: false,
    };

    // ✅ Multi-tenant filter
    if (req.user?.id) {
      queryFilters.accountId = new Types.ObjectId(req.user.id);
    }

    // ✅ Multi-field search
    if (search) {
      queryFilters.$or = [
        { riderAutoId: { $regex: search as string, $options: "i" } },
        { phoneNumber: { $regex: search as string, $options: "i" } },
        { "personId.firstName": { $regex: search as string, $options: "i" } },
        { "personId.lastName": { $regex: search as string, $options: "i" } },
      ];
    }

    // ✅ Multi-status filter
    if (riderStatus) {
      const statuses = (riderStatus as string)
        .split(",")
        .filter((s): s is ActivityStatus =>
          RIDER_STATUS.includes(s as ActivityStatus),
        );

      if (statuses.length) {
        queryFilters.riderStatus = { $in: statuses };
      }
    }

    // ✅ Sorting
    const sortOption: Record<string, SortOrder> = {};
    sortOption[sortBy as string] = order === "asc" ? 1 : -1;

    // ✅ Total count
    const total = await Riders.countDocuments(queryFilters);

    // ✅ Statistics (Status Wise)
    const statsAgg = await Riders.aggregate([
      { $match: queryFilters },
      {
        $group: {
          _id: "$riderStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    const statistics: Record<string, number> = {};

    // Initialize all statuses to 0
    RIDER_STATUS.forEach((status) => {
      statistics[status] = 0;
    });

    // Fill actual counts
    statsAgg.forEach((item) => {
      statistics[item._id] = item.count;
    });

    // ✅ ADD TOTAL INTO STATISTICS
    statistics["total"] = total;

    // ✅ Main Query
    let query = Riders.find(queryFilters)
      .sort(sortOption)
      .populate("personId")
      .populate("contactId");

    // Pagination only if filter !== all
    if (filter !== "all") {
      query = query.skip((pageNumber - 1) * pageSize).limit(pageSize);
    }

    const data = await query.exec();

    return res.status(200).json({
      success: true,
      total,
      page: filter === "all" ? 1 : pageNumber,
      limit: filter === "all" ? total : pageSize,
      data,
      statistics, // now includes total
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch riders",
    });
  }
};
