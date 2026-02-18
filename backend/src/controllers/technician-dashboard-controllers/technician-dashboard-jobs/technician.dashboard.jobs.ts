import { Response } from "express";
import { TechnicianAuthRequest } from "../../../middleware/auth.middleware";
import { TechniciansJobs } from "../../../models/technician-jobs-models/technician.jobs.models";


export const technicianDashboardJobsController = async (
    req: TechnicianAuthRequest,
    res: Response
) => {
    try {
        const technicianId = req.technicianId;
        if (!technicianId) {
            return res.status(400).json({
                success: false,
                message: "TechnicianId not provided.",
            });
        }

        // ✅ Filters & Pagination from query
        const {
            filter = "all",       // "all", "active", "inactive"
            search = "",          // search string for jobId or ticketId
            page = 1,             // default page 1
            limit = 10            // default 10 per page
        } = req.query as any;

        const query: any = { technicianId, isDeleted: false };

        // Filter active/inactive
        if (filter === "active") query.isActive = true;
        if (filter === "inactive") query.isActive = false;

        // Search by jobId or ticketId
        if (search) {
            query.$or = [
                { jobId: { $regex: search, $options: "i" } },
                { ticketId: { $regex: search, $options: "i" } }
            ];
        }
        // Pagination calculation
        const skip = (parseInt(page) - 1) * parseInt(limit);
        // ✅ Fetch jobs with populate

        const jobs = await TechniciansJobs.find(query)
            .populate([
                {
                    path:"services",
                    select: "activityId duration description additionalNotes",
                    populate: { path: "activityId", select: "technicianServiceType" }        

                },
                {
                    path:"parts",
                    select: "partId",
                    populate: { path: "partId", select: "partName" }
                },
                {
                    path: "technicianId",
                    select: "personId contactId",
                    populate: [
                        { path: "personId", select: "firstName lastName" },
                        { path: "contactId", select: "phoneNumber mobileNumber" }
                    ]
                },
                {
                    path: "ticketId",
                    select: "ticketCode customerId issue_Details ticketStatusId vehicleId priorityId",
                    populate: [
                        {
                            path: "customerId",
                            select: "personId contactId addressId",
                            populate: [
                                { path: "personId", select: "firstName lastName" },
                                { path: "contactId", select: "mobileNumber phoneNumber" },
                                { path: "addressId", select: "address city state zipCode" }
                            ]
                        },
                        { 
                            path: "vehicleId", 
                            select: "vehicleType productName serialNumber vehicleModelId",
                            populate: {
                                path: "vehicleModelId",
                                select: "modelName"
                            }
                        },
                        { path: "priorityId", select: "serviceRequestPrioprity backgroundColor" },
                        { path: "ticketStatusId", select: "code" },
                    ],
                },
                {
                    path: "jobStatusId",
                    select: "technicianJobStatus"
                }
            ])
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();
        // ✅ Count total jobs, active and inactive
        const [totalJobs, totalActive, totalInactive] = await Promise.all([
            TechniciansJobs.countDocuments({ technicianId, isDeleted: false }),
            TechniciansJobs.countDocuments({ technicianId, isDeleted: false, isActive: true }),
            TechniciansJobs.countDocuments({ technicianId, isDeleted: false, isActive: false }),
        ]);

        return res.status(200).json({
            success: true,
            data: {
                jobs,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(totalJobs / parseInt(limit)),
                    totalJobs,
                    totalActive,
                    totalInactive
                }
            }
        });

    } catch (error) {
        console.error("Technician Jobs Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch technician jobs",
            error: error instanceof Error ? error.message : error,
        });
    }
};
