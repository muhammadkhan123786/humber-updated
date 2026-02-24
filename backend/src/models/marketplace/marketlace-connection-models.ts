// models/MarketplaceConnection.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IMarketplaceConnection extends Document {
    userId: string;
    name: string; // User-defined name like "My Main eBay Store"
    description?: string;
    type: 'ebay' | 'amazon' | 'shopify' | 'etsy' | 'walmart' | 'woocommerce' | 'tiktok';
    credentials: string; // Encrypted credentials (clientId, clientSecret, etc.)
    tokens?: string; // Encrypted OAuth tokens
    tokenExpiry?: Date;
    status: 'disconnected' | 'connected' | 'error' | 'expired';
    apiConfiguration: {
        authType: 'oauth2' | 'oauth2_user' | 'api_key';
        environment: 'sandbox' | 'production';
        baseUrl: string;
        tokenUrl?: string;
        authorizeUrl?: string;
        scopes?: string[];
        endpoints: Record<string, string>;
    };
    stats: {
        totalSales: number;
        pendingOrders: number;
        activeListings: number;
        revenue24h: number;
        totalRevenue: number;
        growth: number;
    };
    lastSync?: Date;
    errorMessage?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const marketplaceConnectionSchema = new Schema<IMarketplaceConnection>(
    {
        userId: {
            type: String,
            required: true,
            index: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        type: {
            type: String,
            required: true,
            enum: ['ebay', 'amazon', 'shopify', 'etsy', 'walmart', 'woocommerce', 'tiktok'],
            lowercase: true
        },
        credentials: {
            type: String,
            required: true
        },
        tokens: {
            type: String
        },
        tokenExpiry: {
            type: Date
        },
        status: {
            type: String,
            enum: ['disconnected', 'connected', 'error', 'expired'],
            default: 'disconnected'
        },
        apiConfiguration: {
            authType: {
                type: String,
                enum: ['oauth2', 'oauth2_user', 'api_key'],
                required: true
            },
            environment: {
                type: String,
                enum: ['sandbox', 'production'],
                default: 'production'
            },
            baseUrl: String,
            tokenUrl: String,
            authorizeUrl: String,
            scopes: [String],
            endpoints: {
                type: Map,
                of: String
            }
        },
        stats: {
            totalSales: { type: Number, default: 0 },
            pendingOrders: { type: Number, default: 0 },
            activeListings: { type: Number, default: 0 },
            revenue24h: { type: Number, default: 0 },
            totalRevenue: { type: Number, default: 0 },
            growth: { type: Number, default: 0 }
        },
        lastSync: Date,
        errorMessage: String,
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Indexes
marketplaceConnectionSchema.index({ userId: 1, type: 1 });
marketplaceConnectionSchema.index({ userId: 1, status: 1 });
marketplaceConnectionSchema.index({ tokenExpiry: 1 });

// Methods
marketplaceConnectionSchema.methods.isTokenExpired = function (): boolean {
    if (!this.tokenExpiry) return true;
    return new Date() >= this.tokenExpiry;
};

marketplaceConnectionSchema.methods.needsTokenRefresh = function (): boolean {
    if (!this.tokenExpiry) return true;
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    return this.tokenExpiry <= fiveMinutesFromNow;
};

export default mongoose.model<IMarketplaceConnection>('MarketplaceConnection', marketplaceConnectionSchema);