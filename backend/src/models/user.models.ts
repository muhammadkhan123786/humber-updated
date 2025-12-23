import { Schema, model, Document } from 'mongoose';

export type Roles = 'Admin' | 'Technician' | 'Customer';


export interface IUser extends Document {
    email: string;
    password: string;
    role: Roles;
    isActive: boolean;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}



const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['Admin', 'Technician', 'Customer'],
            required: true,
            default: 'Admin', // optional default
        },
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
