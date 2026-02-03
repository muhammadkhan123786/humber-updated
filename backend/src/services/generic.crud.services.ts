import { Model,  Types, Document, UpdateQuery, QueryFilter,  PopulateOptions } from "mongoose";
import { z, ZodObject, ZodRawShape } from "zod";

export interface CRUDOptions<T extends Document> {
    populate?: string | string[];
    validationSchema?: ZodObject<ZodRawShape>;
}

function hasIsDefaultField(
    data: unknown
): data is { isDefault: boolean, userId: Types.ObjectId } {
    return (
        typeof data === "object" &&
        data !== null &&
        "isDefault" in data &&
        typeof (data as any).isDefault === "boolean"
    );
}


export class GenericService<T extends Document> {
    constructor(public readonly model: Model<T>) { }
    async getQuery(filter: QueryFilter<T> = {}, options?: { populate?: (string | PopulateOptions)[] }) {
        let query = this.model.find(filter);
        if (options?.populate) query = query.populate(options.populate);
        // Run counts in parallel
        const [total, activeCount, inactiveCount] = await Promise.all([
            this.model.countDocuments(filter),
            this.model.countDocuments({ ...filter, isActive: true }),
            this.model.countDocuments({ ...filter, isActive: false }),
        ]);
        return { query, total, activeCount, inactiveCount };
    }

    async create(data: Partial<T>): Promise<T> {

        // ✅ If model supports isDefault AND incoming record is default
        if (hasIsDefaultField(data) && data.isDefault === true) {
            await this.model.updateMany(
                { userId: data.userId },                         // ✅ filter: all documents
                { $set: { isDefault: false } }
            );
        }

        const doc = new this.model(data);
        return doc.save();
    }


    async getById(id: string, options?: { populate?: (string | PopulateOptions)[] }): Promise<T | null> {
        let query = this.model.findById(id);
        if (options?.populate) query = query.populate(options.populate);
        return query.exec();
    }

    async updateById(id: string, data: UpdateQuery<T>, options?: { populate?: (string | PopulateOptions)[] }): Promise<T | null> {
        // ✅ Check safely
        if (hasIsDefaultField(data) && data.isDefault === true) {
            await this.model.updateMany(
                {
                    _id: { $ne: id },
                    userId: data.userId
                },
                { $set: { isDefault: false } }
            );
        }

        let query = this.model.findByIdAndUpdate(id, data, { new: true });
        if (options?.populate) query = query.populate(options.populate);
        return query.exec();
    }

    async deleteById(id: string): Promise<T | null> {

        // 1️⃣ Fetch document first
        const doc = await this.model.findById(id).exec();

        if (!doc) return null;

        // 2️⃣ Prevent delete if default
        if (hasIsDefaultField(doc) && doc.isDefault === true) {
            throw new Error("Default record cannot be deleted");
        }

        // 3️⃣ Safe delete
        return this.model.findByIdAndUpdate(
            id,
            { $set: { isDeleted: true } }, // ✅ use $set
            { new: true }
        ).exec();
    }



      async getProductStats(filters = {}) {
        const baseFilter = { ...filters, isDeleted: false } ;
  console.log("🔍 getProductStats called with filters:", filters);
        const [
            total,
            activeCount,
            inactiveCount,
            inStockCount,
            lowStockCount,
            outOfStockCount,
            featuredCount
        ] = await Promise.all([
            // Total products
            this.model.countDocuments(baseFilter),

            // Active products
            this.model.countDocuments({ ...baseFilter, isActive: true } ),

            // Inactive products
            this.model.countDocuments({ ...baseFilter, isActive: false } ),

            // In stock (stockStatus = 'in-stock')
            this.model.countDocuments({
                ...baseFilter,
                'attributes.stock.stockStatus': 'in-stock'
            } ),

            // Low stock (stockStatus = 'low-stock')
            this.model.countDocuments({
                ...baseFilter,
                'attributes.stock.stockStatus': 'low-stock'
            } ),

            // Out of stock (stockQuantity = 0 or stockStatus = 'out-of-stock')
            this.model.countDocuments({
                ...baseFilter,
                $or: [
                    { 'attributes.stock.stockQuantity': 0 },
                    { 'attributes.stock.stockStatus': 'out-of-stock' }
                ]
            } ),

            // Featured products
            this.model.countDocuments({
                ...baseFilter,
                'attributes.stock.featured': true
            } )
        ]);

        console.log("Product Stats:", {
            total,
            activeCount,
            inactiveCount,
            inStockCount,
            lowStockCount,
            outOfStockCount,
            featuredCount
        });

        return {
            total,
            activeCount,
            inactiveCount,
            inStockCount,
            lowStockCount,
            outOfStockCount,
            featuredCount
        };
    }

}