import { GenericService } from "../services/generic.crud.services";
import { categoryDoc, Category } from '../models/category.models';
import { categorySchemaValidation } from '../schemas/category.schema';
import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";


const categoryServices = new GenericService<categoryDoc>(Category);

export const createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // ✅ Validate request body
        const data = categorySchemaValidation.parse(req.body);

        // ✅ Convert string IDs to ObjectId
        const payLoad: Partial<categoryDoc> = {
            ...data,
            userId: new Types.ObjectId(data.userId),
            parentId: data.parentId ? new Types.ObjectId(data.parentId) : null,
        };

        // ✅ Create category using generic service
        const category = await categoryServices.create(payLoad);

        // ✅ Send response safely
        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    } catch (error: any) {
        // ✅ Handle Zod validation errors or Mongo errors
        if (error.name === "ZodError") {
            return res.status(400).json({ success: false, errors: error.errors });
        }
        next(error); // Pass unknown errors to global error handler
    }
};

export const updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // ✅ Validate incoming body (can reuse same Zod schema)
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

        const data = categorySchemaValidation.partial().parse(req.body);

        // ✅ Convert IDs
        const payLoad: Partial<categoryDoc> = {
            ...data,
            userId: new Types.ObjectId(data.userId),
            parentId: data.parentId ? new Types.ObjectId(data.parentId) : null,
        };

        // ✅ Call generic update
        const updatedCategory = await categoryServices.updateById(id, payLoad);

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: updatedCategory,
        });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({ success: false, errors: error.errors });
        }
        next(error);
    }
};