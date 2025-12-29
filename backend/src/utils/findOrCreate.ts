import { ClientSession, Model, Document, QueryFilter } from "mongoose";

export class BaseRepo<T> {
    constructor(protected readonly model: Model<any>) { }

    async create(
        data: Partial<T>,
        session?: ClientSession
    ): Promise<Document> {
        const doc = new this.model(data);
        return session ? doc.save({ session }) : doc.save();
    }
}


export async function findOrCreate<T>(
    model: Model<any>,
    findQuery: QueryFilter<any>,
    createData: Partial<T>,
    session: ClientSession
): Promise<Document> {

    let doc = await model.findOne(findQuery).session(session);

    if (!doc) {
        doc = new model(createData);
        await doc.save({ session });
    }

    return doc;
}