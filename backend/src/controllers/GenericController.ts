import { Request, Response } from "express";
import { GenericService } from "../services/generic.crud.services";
import { Document, PopulateOptions, Types } from "mongoose";
import { z, ZodObject, ZodRawShape } from "zod";

const queryFilters: Record<string, any> = {}; // <-- new object for mongoose
interface ControllerOptions<T extends Document> {
    service: GenericService<T>;
    populate?: (string | PopulateOptions)[];
    validationSchema?: ZodObject<ZodRawShape>; // optional Zod validation
}
export class AdvancedGenericController<T extends Document> {
    constructor(private options: ControllerOptions<T>) { }
    // CREATE
    create = async (req: Request, res: Response) => {
        try {
            let data = req.body;
            console.log("Creating document with data:", data);

            // Validate request body if schema provided
            if (this.options.validationSchema) {
                data = this.options.validationSchema.parse(data);
            }

            if (req.body.userId) {
                data.userId = new Types.ObjectId(req.body.userId);
            }

            const doc = await this.options.service.create(data);
            res.status(201).json({ success: true, data: doc });
        } catch (err: any) {
            res.status(400).json({ success: false, message: err.message || "Failed to create document" });
        }
    };

    // GET ALL with filtering, pagination, sorting
    getAll = async (req: Request, res: Response) => {
        try {
            const { page = 1, limit = 10, sortBy = "createdAt", order = "desc", search, ...rawFilters } = req.query;

            const pageNumber = Number(page);
            const pageSize = Number(limit);

            // Convert query params to mongoose filter
            const queryFilters: Record<string, any> = { "isActive": true };
            if (search) {
                queryFilters.brandName = { $regex: search, $options: 'i' };
            }
            Object.keys(rawFilters).forEach((key) => {
                const value = rawFilters[key];
                if (typeof value === "string" && Types.ObjectId.isValid(value)) {
                    queryFilters[key] = new Types.ObjectId(value);
                } else {
                    queryFilters[key] = value;
                }
            });

            // Total count
            const total = await this.options.service.getQuery(queryFilters).countDocuments();

            // Query with populate, sort, pagination
            let query = this.options.service.getQuery(queryFilters, { populate: this.options.populate });
            const sortOption: any = {};
            sortOption[sortBy as string] = order === "asc" ? 1 : -1;

            query = query.sort(sortOption).skip((pageNumber - 1) * pageSize).limit(pageSize);
            const data = await query.exec();

            res.status(200).json({
                success: true,
                total,
                page: pageNumber,
                limit: pageSize,
                data,
            });
        } catch (err: any) {
            res.status(500).json({ success: false, message: err.message || "Failed to fetch documents" });
        }
    };


    // GET BY ID
    getById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid ID" });
            }

            // Allow dynamic populate from query
            const populateQuery = req.query.populate as string | undefined;

            const populate = populateQuery
                ? populateQuery.split(",").map(p => p.trim())
                : this.options.populate;

            const doc = await this.options.service.getById(id, { populate });

            if (!doc) {
                return res.status(404).json({ message: "Document not found" });
            }

            res.status(200).json({ success: true, data: doc });
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message || "Failed to fetch document",
            });
        }
    };


    // UPDATE
    update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

            let data = req.body;
            if (this.options.validationSchema) {
                data = this.options.validationSchema.partial().parse(data);
            }

            const updated = await this.options.service.updateById(id, data, { populate: this.options.populate });
            if (!updated) return res.status(404).json({ message: "Document not found" });

            res.status(200).json({ success: true, data: updated });
        } catch (err: any) {
            res.status(400).json({ success: false, message: err.message || "Failed to update document" });
        }
    };

    // DELETE (soft delete)
    delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

            const deleted = await this.options.service.deleteById(id);
            if (!deleted) return res.status(404).json({ message: "Document not found" });

            res.status(200).json({ success: true, message: "Document deleted successfully" });
        } catch (err: any) {
            res.status(500).json({ success: false, message: err.message || "Failed to delete document" });
        }
    };
}
