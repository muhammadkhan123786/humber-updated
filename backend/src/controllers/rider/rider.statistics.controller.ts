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
    RIDER_STATUS.forEach((status) => {
      statistics[status] = 0;
    });
    statsAgg.forEach((item) => {
      statistics[item._id] = item.count;
    });
    statistics["total"] = total;

    // ✅ Main Query with full population
    let query = Riders.find(queryFilters)
      .sort(sortOption)
      .populate("userId")
      .populate("personId")
      .populate("addressId")
      .populate("contactId")
      .populate("accountId")
      .populate("vehicleTypeId")
      .populate("employeementTypeId")
      .populate({
        path: "addressId",
        populate: [{ path: "cityId" }, { path: "countryId" }],
      });

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
      statistics,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch riders",
    });
  }
};


export const getAvailableDrivers = async (req: AuthRequest, res: Response) => {
  try {
      const { userId, page, limit, search, requiredUserId } = req.query;
    console.log("request is coming be here", userId)
    const accountId = req.user?.id;

    // if (!accountId) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Unauthorized",
    //   });
    // }

    // ✅ Sirf ACTIVE aur APPROVED drivers fetch karo
    const drivers = await Riders.find({
      // accountId: new Types.ObjectId(accountId),
      isDeleted: false,
      riderStatus: { $in: ["ACTIVE", "APPROVED"] }
    })
    .populate("personId", "firstName lastName")  // ✅ IMPORTANT: Populate personId first
    .select("riderAutoId phoneNumber vehicleNumber riderStatus personId"); // ✅ Include personId in select

    // ✅ Data ko simple format mein convert karo (with null check)
    const formattedDrivers = drivers.map(driver => {
      // ✅ Safely access personId after population
      const person = driver.personId as any; // Type assertion for populated data
      
      return {
        _id: driver._id,
        name: person?.firstName && person?.lastName 
          ? `${person.firstName} ${person.lastName}`.trim()
          : person?.firstName || person?.lastName || "Unknown",
        phone: driver.phoneNumber,
        // vehicleNumber: driver.vehicleNumber,
        status: driver.riderStatus,
        riderId: driver.riderAutoId
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedDrivers,
      total: formattedDrivers.length
    });

  } catch (error: any) {
    console.error("Error in getAvailableDrivers:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch drivers",
    });
  }
};
