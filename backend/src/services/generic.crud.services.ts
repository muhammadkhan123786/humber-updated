import { Model, Types, Document, UpdateQuery, QueryFilter } from "mongoose";
import { z, ZodObject, ZodRawShape } from "zod";

export interface CRUDOptions<T extends Document> {
    populate?: string | string[];
    validationSchema?: ZodObject<ZodRawShape>;
}

export class GenericService<T extends Document> {
    constructor(protected readonly model: Model<T>) { }

    getQuery(filter: QueryFilter<T> = {}, options?: { populate?: string | string[] }) {
        let query = this.model.find(filter);
        if (options?.populate) query = query.populate(options.populate);
        return query;
    }

    async create(data: Partial<T>): Promise<T> {
        const doc = new this.model(data);
        return doc.save();
    }

    async getById(id: string, options?: { populate?: string | string[] }): Promise<T | null> {
        let query = this.model.findById(id);
        if (options?.populate) query = query.populate(options.populate);
        return query.exec();
    }

    async updateById(id: string, data: UpdateQuery<T>, options?: { populate?: string | string[] }): Promise<T | null> {
        let query = this.model.findByIdAndUpdate(id, data, { new: true });
        if (options?.populate) query = query.populate(options.populate);
        return query.exec();
    }

    async deleteById(id: string): Promise<T | null> {
        return this.model.findByIdAndDelete(id).exec();
    }
}