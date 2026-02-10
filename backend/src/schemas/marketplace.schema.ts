import { SchemaDefinition, Types } from "mongoose";
import { z } from "zod";

export const MarketplaceSchema: SchemaDefinition = {
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },

  name: {
    type: String,
    required: true,
    trim: true,
  },

  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  credentials: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: "",
  },

  icon: {
    type: Types.ObjectId,
    ref: "Icon",
  },

  color: {
    type: Types.ObjectId,
    ref: "Color",
  },

  status: {
    type: String,
    enum: ["connected", "disconnected", "error"],
    default: "disconnected",
  },

  lastSync: {
    type: Date,
  },

  lastError: {
    type: String,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  stats: {
    totalSales: { type: Number, default: 0 },
    pendingOrders: { type: Number, default: 0 },
    activeListings: { type: Number, default: 0 },
    revenue24h: { type: Number, default: 0 },
    growth: { type: Number, default: 0 },
  },

  isDefault: {
    type: Boolean,
    default: false,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
};



export const marketplaceValidationSchema = z.object({
  userId: z.string().min(1, "userId is required"),

  name: z.string().min(1, "Name is required"),

  code: z.string().min(1, "Code is required"),

  credentials: z.string().min(1, "Credentials are required"),

  description: z.string().optional(),

  status: z
    .enum(["connected", "disconnected", "error"])
    .default("disconnected"),

  icon: z.string().optional(),   
  color: z.string().optional(),  
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  isDefault: z.boolean().optional(),
});

