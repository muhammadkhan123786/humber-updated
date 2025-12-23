import { Schema, model, Document } from 'mongoose';

export interface ICountry extends Document {
    countryName: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const countrySchema = new Schema<ICountry>(
    {
        countryName: { type: String, required: true, unique: true },
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Country = model<ICountry>('Country', countrySchema);
