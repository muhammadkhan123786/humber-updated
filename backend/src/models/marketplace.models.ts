import { model, Document, Schema } from "mongoose";
import { IMarketplace } from "../../../common/IMarketplace";
import { MarketplaceSchema } from "../schemas/marketplace.schema";

export type MarketplaceDoc = IMarketplace & Document;

const marketplaceDBSchema = new Schema<MarketplaceDoc>(
  MarketplaceSchema,
  { timestamps: true }
);

export const marketplaceModel = model<MarketplaceDoc>(
  "Marketplace",
  marketplaceDBSchema
);
