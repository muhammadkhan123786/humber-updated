import { Types } from "mongoose";

export interface IMarketplace {
  userId: Types.ObjectId | string;
type?: string;
  name: string;
  code: string;

  credentials: string;

  description?: string;
  icon?: Types.ObjectId | string;
  color?: Types.ObjectId | string;

  status: "connected" | "disconnected" | "error";

  isActive?: boolean;
  isDefault?: boolean;
  isDeleted?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
