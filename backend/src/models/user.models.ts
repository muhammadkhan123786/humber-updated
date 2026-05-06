import { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcrypt";
export type Roles = "Admin" | "Technician" | "Customer" | "Driver";

export interface IUser extends Document {
  email: string;
  password?: string;
  role: Roles;
  isActive: boolean;
  isDeleted: boolean;
  emailToken?: string;
  emailTokenExpires?: Date;
  shopId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  fullName?: string;
  username?: string;
  phone?: string;
  department?: string;
  isLocked?: boolean;
}

const userSchema = new Schema<IUser>(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: false,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isLocked: { type: Boolean, default: false },
    fullName: { type: String },
    username: { type: String, unique: true, sparse: true },
    phone: { type: String },
    department: { type: String },
    password: { type: String },
    role: {
      type: String,
      enum: ["Admin", "Technician", "Customer", "Driver"],
      required: true,
      default: "Admin", // optional default
    },
    emailToken: { type: String },
    emailTokenExpires: { type: Date },
    isActive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const User = model<IUser>("User", userSchema);
