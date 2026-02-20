import { Request, Response } from "express";
import { Types, Document, PopulateOptions } from "mongoose";
import { ZodObject, ZodRawShape, ZodTypeAny } from "zod";
import { normalizeToStringArray } from "../utils/query.utils";
import { GenericService } from "../services/generic.crud.services";

interface ControllerOptions<T extends Document> {
  service: GenericService<T>;
  populate?: (string | PopulateOptions)[];
  validationSchema?: ZodObject<ZodRawShape>;
  searchFields?: string[];
}

export class AdvancedGenericController<T extends Document> {
  constructor(private options: ControllerOptions<T>) { }

  // 🔹 CREATE
  create = async (req: Request, res: Response) => {
    try {
      let data = req.body;

      if (this.options.validationSchema) {
        data = this.options.validationSchema.parse(data);
      }

      if (req.body.userId) {
        data.userId = new Types.ObjectId(req.body.userId);
      }

      const doc = await this.options.service.create(data);
      res.status(201).json({ success: true, data: doc });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message || "Failed to create document",
      });
    }
  };

  // 🔹 GET ALL (generic aggregation with nested array search)
  getAll = async (req: Request, res: Response) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        order = "desc",
        search,
        filter,
        includeStats = "false",
        ...rawFilters
      } = req.query;

      const pageNumber = Number(page);
      const pageSize = Number(limit);

      // Base match filter
      const matchFilters: Record<string, any> = { isDeleted: false };

      // 🔹 Dynamic filters (ObjectId or plain value)
      Object.keys(rawFilters).forEach((key) => {
        const value = rawFilters[key];
        if (key.endsWith("Ids")) {
          const ids = normalizeToStringArray(value)
            .filter((id) => Types.ObjectId.isValid(id))
            .map((id) => new Types.ObjectId(id));
          if (ids.length) matchFilters[key.replace("Ids", "Id")] = { $in: ids };
          return;
        }

        if (typeof value === "string" && Types.ObjectId.isValid(value)) {
          matchFilters[key] = new Types.ObjectId(value);
        } else {
          matchFilters[key] = value;
        }
      });

      const pipeline: any[] = [{ $match: matchFilters }];

      // 🔹 Generic $lookup for populated fields
      if (this.options.populate?.length) {
        for (const field of this.options.populate) {
          const localField = typeof field === "string" ? field : field.path;
          const fromCollection = localField.replace(/Id$/, "") + "s";

          pipeline.push({
            $lookup: {
              from: fromCollection,
              localField,
              foreignField: "_id",
              as: localField,
            },
          });

          pipeline.push({
            $unwind: { path: `$${localField}`, preserveNullAndEmptyArrays: true },
          });
        }
      }

      // 🔹 Generic search (supports nested arrays recursively)
      if (search && this.options.searchFields?.length) {
        const unwindedArrays = new Set<string>();
        const orConditions: any[] = [];

        this.options.searchFields.forEach((field: string) => {
          const parts = field.split(".");
          if (parts.length > 1) {
            // recursive unwind for nested arrays
            for (let i = 0; i < parts.length - 1; i++) {
              const path = parts.slice(0, i + 1).join(".");
              if (!unwindedArrays.has(path)) {
                pipeline.push({
                  $unwind: { path: `$${path}`, preserveNullAndEmptyArrays: true },
                });
                unwindedArrays.add(path);
              }
            }
            orConditions.push({ [field]: { $regex: search, $options: "i" } });
          } else {
            orConditions.push({ [field]: { $regex: search, $options: "i" } });
          }
        });

        pipeline.push({ $match: { $or: orConditions } });

        // Group back to avoid duplicates
        pipeline.push({
          $group: { _id: "$_id", doc: { $first: "$$ROOT" } },
        });
        pipeline.push({ $replaceRoot: { newRoot: "$doc" } });
      }

      // 🔹 Sorting
      const sortOption: Record<string, number> = {};
      sortOption[sortBy as string] = order === "asc" ? 1 : -1;
      pipeline.push({ $sort: sortOption });

      // 🔹 Count total documents
      const countPipeline = [...pipeline, { $count: "total" }];
      const totalResult = await this.options.service.model.aggregate(countPipeline);
      const total = totalResult[0]?.total || 0;

      // 🔹 Pagination
      if (filter !== "all") {
        pipeline.push({ $skip: (pageNumber - 1) * pageSize });
        pipeline.push({ $limit: pageSize });
      }

      // 🔹 Execute final aggregation
      const data = await this.options.service.model.aggregate(pipeline);

      const response: any = {
        success: true,
        total,
        page: pageNumber,
        limit: pageSize,
        data,
      };

      // 🔹 Optional statistics
      if (includeStats === "true" && this.options.service.getProductStats) {
        response.statistics = await this.options.service.getProductStats(matchFilters);
      }

      return res.status(200).json(response);
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to fetch documents",
      });
    }
  };

  // 🔹 GET BY ID
  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const populateQuery = req.query.populate as string | undefined;
      const populate = populateQuery
        ? populateQuery.split(",").map((p) => p.trim())
        : this.options.populate;

      const doc = await this.options.service.getById(id, { populate });

      if (!doc) return res.status(404).json({ message: "Document not found" });

      res.status(200).json({ success: true, data: doc });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || "Failed to fetch document",
      });
    }
  };

  // 🔹 UPDATE
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

      let data = req.body;
      if (this.options.validationSchema) {
        data = this.options.validationSchema.partial().parse(data);
      }

      const updated = await this.options.service.updateById(id, data, {
        populate: this.options.populate,
      });
      if (!updated) return res.status(404).json({ message: "Document not found" });

      res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message || "Failed to update document",
      });
    }
  };

  // 🔹 DELETE
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

      const deleted = await this.options.service.deleteById(id);
      if (!deleted) return res.status(404).json({ message: "Document not found" });

      res.status(200).json({ success: true, message: "Document deleted successfully" });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || "Failed to delete document",
      });
    }
  };
}