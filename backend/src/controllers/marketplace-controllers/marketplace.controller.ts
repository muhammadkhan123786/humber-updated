// controllers/MarketplaceController.ts
interface SingleDistribution {
  connectionId: string;   // MarketplaceConnection._id
  quantity: number;
}

interface DistributeRequestBody {
  productId: string;
  userId: string;
  distributions: SingleDistribution[];  // only marketplaces with qty > 0
  productData: ProductPayload;           // full product info from frontend
}

interface ProductPayload {
  name: string;
  sku: string;
  description?: string;
  price: number;
  costPrice?: number;
  imageUrl?: string;
  images?: string[];
  stockQuantity?: number;
  // marketplace-specific pricing comes from product.attributes[].pricing[]
  attributes?: Array<{
    pricing?: Array<{
      marketplaceName: string;
      marketplaceId: string;
      sellingPrice: number;
      retailPrice?: number;
      costPrice?: number;
    }>;
    stock?: {
      stockQuantity: number;
    };
  }>;
}

// ── Result shape returned per marketplace ─────────────────────────────────────

interface DistributionResult {
  connectionId: string;
  marketplaceName: string;
  quantity: number;
  success: boolean;
  listingId?: string;
  viewUrl?: string;
  error?: string;
}



import { Request, Response } from "express";
import MarketplaceConnection from "../../models/marketplace/marketlace-connection-models";
import { encryptCredentials, decryptCredentials } from "../../utils/encryption";
import { MARKETPLACE_CONFIGS } from "../../config/marketplaces.config";
import { MarketplaceServiceFactory } from "../../services/marketplace-Services/MarketplaceServiceFactory";
import axios from "axios";
// import { EbayService } from "../services/EbayService"

export class MarketplaceController {
    /**
     * Get all available marketplace types
     * GET /api/marketplace/types
     */
    async getMarketplaceTypes(req: Request, res: Response) {
        try {
            const types = Object.values(MARKETPLACE_CONFIGS).map((config) => ({
                type: config.type,
                name: config.name,
                authType: config.authType,
                requiresOAuth: config.requiresOAuth,
                credentialFields: config.credentialFields,
            }));

            res.json({
                success: true,
                data: types,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Create new marketplace connection (from modal)
     * POST /api/marketplace/connections
     */
    async createConnection(req: Request, res: Response) {
        try {
            const { name, description, type, environment, credentials, userId } =
                req.body;
            console.log("Is request is coming here !")
            console.log(req.body);
            // Validate marketplace type
            const marketplaceConfig = MARKETPLACE_CONFIGS[type];
            if (!marketplaceConfig) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid marketplace type: ${type}`,
                });
            }

            // Validate required credentials
            // for (const field of marketplaceConfig.credentialFields) {
            //     if (field.required && !credentials[field.key]) {
            //         return res.status(400).json({
            //             success: false,
            //             message: `Missing required field: ${field.label}`
            //         });
            //     }
            // }

            // Get environment config
            const env = environment || "production";
            const envConfig = marketplaceConfig.environments[env];

            if (!envConfig) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid environment: ${env}`,
                });
            }

            // Encrypt credentials
            const encryptedCredentials = encryptCredentials(credentials);

            // Create connection
            const connection = await MarketplaceConnection.create({
                userId,
                name,
                description,
                type,
                credentials: encryptedCredentials,
                apiConfiguration: {
                    authType: marketplaceConfig.authType,
                    environment: env,
                    baseUrl: envConfig.baseUrl,
                    tokenUrl: envConfig.tokenUrl,
                    authorizeUrl: envConfig.authorizeUrl,
                    scopes: envConfig.scopes,
                    endpoints: marketplaceConfig.endpoints,
                },
                status: "disconnected",
            });

            console.log(`✅ Connection created: ${connection._id} (${type})`);

            res.status(201).json({
                success: true,
                message: "Marketplace connection created",
                data: {
                    id: connection._id,
                    name: connection.name,
                    type: connection.type,
                    status: connection.status,
                    requiresOAuth: marketplaceConfig.requiresOAuth,
                },
            });
        } catch (error: any) {
            console.error("Error creating connection:", error);
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get all user's marketplace connections
     * GET /api/marketplace/connections
     */
    async getConnections(req: Request, res: Response) {
        try {
            const { userId } = req.query;

            const connections = await MarketplaceConnection.find({
                userId,
                isActive: true,
            })
                .select("-credentials -tokens")
                .sort({ createdAt: -1 }).populate({
                    path: "name",
                    select: "_id Icons Color",
                    populate: [
                        { path: 'icon', select: '_id  icon' },
                        { path: 'color', select: '_id colorCode' }
                    ]
                });

            res.json({
                success: true,
                data: connections,
                count: connections.length,
            });
        } catch (error: any) {
            console.error("Error fetching connections:", error);
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Get single connection details
     * GET /api/marketplace/connections/:id
     */
    async getConnection(req: Request, res: Response) {
        try {
            const { id, userId } = req.params;

            const connection = await MarketplaceConnection.findOne({
                _id: id,
                userId,
                isActive: true,
            }).select("-credentials -tokens")
                .populate({
                    path: "name",
                    select: "_id Icons Color",
                    populate: [
                        { path: 'icon', select: '_id  icon' },
                        { path: 'color', select: '_id colorCode' }
                    ]
                });

            if (!connection) {
                return res.status(404).json({
                    success: false,
                    message: "Connection not found",
                });
            }

            res.json({
                success: true,
                data: connection,
            });
        } catch (error: any) {
            console.error("Error fetching connection:", error);
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Initiate OAuth connection
     * POST /api/marketplace/connections/:id/connect
     */
    async connectMarketplace(req: Request, res: Response) {
        try {
            const { id, userId } = req.params;

            const connection = await MarketplaceConnection.findOne({
                _id: id,
                userId,
            });

            if (!connection) {
                return res.status(404).json({
                    success: false,
                    message: "Connection not found",
                });
            }

            const marketplaceConfig = MARKETPLACE_CONFIGS[connection.type];

            // If doesn't require OAuth (like WooCommerce with API keys)
            if (!marketplaceConfig.requiresOAuth) {
                // Test connection directly
                const service = MarketplaceServiceFactory.createService(connection);
                const isConnected = await service.testConnection();

                if (isConnected) {
                    connection.status = "connected";
                    await connection.save();

                    return res.json({
                        success: true,
                        message: "Connected successfully",
                        requiresOAuth: false,
                    });
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "Connection test failed. Please check your credentials.",
                    });
                }
            }

            // For OAuth marketplaces, generate authorization URL
            const service = MarketplaceServiceFactory.createService(connection);

            const state = Buffer.from(
                JSON.stringify({
                    connectionId: connection._id.toString(),
                    userId: userId,
                }),
            ).toString("base64");

            const authUrl = service.getAuthorizationUrl(state);

            res.json({
                success: true,
                requiresOAuth: true,
                authUrl: authUrl,
                message: "Redirect user to authUrl to complete authorization",
            });
        } catch (error: any) {
            console.error("Error connecting marketplace:", error);
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // controllers/MarketplaceController.ts

    /**
     * Manually exchange authorization code for tokens
     * POST /api/marketplace/connections/:id/exchange-code
     */
    async exchangeAuthCode(req: Request, res: Response) {
        try {
            const { id } = req.params;
            let { code , userId} = req.body;
            if (!code) {
                return res.status(400).json({
                    success: false,
                    message: "Authorization code is required",
                });
            }

            // Clean the code
            // 1. Remove everything after & (like &expires_in=299)
            if (code.includes("&")) {
                code = code.split("&")[0];
                console.log("🧹 Removed extra parameters from code");
            }

            // 2. URL-decode if needed
            if (code.includes("%")) {
                code = decodeURIComponent(code);
                console.log("🔓 URL-decoded the code");
            }

            console.log(`📥 Exchanging code for connection ${id}`);
            console.log("Code (first 50 chars):", code.substring(0, 50) + "...");

            // Get connection
            const connection = await MarketplaceConnection.findOne({
                _id: id,
                userId,
            });

            if (!connection) {
                return res.status(404).json({
                    success: false,
                    message: "Connection not found",
                });
            }

            // Create service and exchange code
            const service = MarketplaceServiceFactory.createService(connection);
            await service.exchangeCodeForTokens(code);

            // Update connection status
            connection.status = "connected";
            await connection.save();

            console.log(`✅ Connection ${id} is now connected!`);

            res.json({
                success: true,
                message: "Connection successful! Tokens saved.",
                data: {
                    connectionId: connection._id,
                    status: connection.status,
                    tokenExpiry: connection.tokenExpiry,
                },
            });
        } catch (error: any) {
            console.error("❌ Token exchange failed:", error.message);
            console.error("Error details:", error.response?.data || {});

            if (error.response?.data?.error === "invalid_grant") {
                return res.status(400).json({
                    success: false,
                    message:
                        "Authorization code expired or already used. Please reconnect and try again immediately (codes expire in 5 minutes).",
                    details: error.response.data,
                });
            }

            res.status(500).json({
                success: false,
                message: error.message,
                details: error.response?.data,
            });
        }
    }

    // controllers/MarketplaceController.ts

    /**
     * Verify eBay credentials and generate test auth URL
     * GET /api/marketplace/connections/:id/verify
     */
    async verifyEbayCredentials(req: Request, res: Response) {
        try {
            const { id, userId } = req.params;

            const connection = await MarketplaceConnection.findOne({
                _id: id,
                userId,
            });

            if (!connection) {
                return res.status(404).json({
                    success: false,
                    message: "Connection not found",
                });
            }

            if (connection.type !== "ebay") {
                return res.status(400).json({
                    success: false,
                    message: "This endpoint is only for eBay connections",
                });
            }

            // Decrypt credentials
            const credentials = decryptCredentials(connection.credentials);

            // Verify all required fields
            const issues = [];

            if (!credentials.clientId) {
                issues.push("Missing clientId");
            } else if (!credentials.clientId.includes("-")) {
                issues.push("ClientId format looks wrong (should contain dashes)");
            }

            if (!credentials.clientSecret) {
                issues.push("Missing clientSecret");
            } else if (
                !credentials.clientSecret.startsWith("SBX-") &&
                !credentials.clientSecret.startsWith("PRD-")
            ) {
                issues.push(
                    "ClientSecret format looks wrong (should start with SBX- or PRD-)",
                );
            }

            if (!credentials.ruName) {
                issues.push("Missing ruName");
            } else if (!credentials.ruName.includes("-")) {
                issues.push("RuName format looks wrong (should contain dashes)");
            }

            // Check environment match
            const env = connection.apiConfiguration.environment || "sandbox";
            const isSandbox = env === "sandbox";
            const secretMatchesEnv = isSandbox
                ? credentials.clientSecret?.startsWith("SBX-")
                : credentials.clientSecret?.startsWith("PRD-");

            if (!secretMatchesEnv) {
                issues.push(
                    `Environment is ${env} but clientSecret starts with ${credentials.clientSecret?.substring(0, 4)}`,
                );
            }

            res.json({
                success: issues.length === 0,
                message:
                    issues.length === 0 ? "Credentials look good!" : "Issues found",
                issues: issues,
                data: {
                    connectionId: connection._id,
                    environment: env,
                    credentials: {
                        clientId: credentials.clientId,
                        clientIdLength: credentials.clientId?.length || 0,
                        clientSecretPrefix: credentials.clientSecret?.substring(0, 4),
                        clientSecretLength: credentials.clientSecret?.length || 0,
                        ruName: credentials.ruName,
                        ruNameLength: credentials.ruName?.length || 0,
                    },
                    expectedFormat: {
                        clientId: "YourApp-YourName-SBX-xxxxxxxxx-xxxxxxxx (for sandbox)",
                        clientSecret:
                            "SBX-xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (for sandbox)",
                        ruName: "YourName-YourApp-SBX-xxxxxxx (for sandbox)",
                    },
                },
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Handle OAuth callback
     * GET /api/marketplace/callback/:type
     */
    async handleOAuthCallback(req: Request, res: Response) {
        try {
            const { type } = req.params;
            const { code, state, error } = req.query;

            if (error) {
                return res.redirect(`/dashboard?oauth_error=${error}`);
            }

            if (!code || !state) {
                return res.redirect("/dashboard?oauth_error=no_code");
            }

            // Decode state
            const stateData = JSON.parse(
                Buffer.from(state as string, "base64").toString(),
            );

            const { connectionId, userId } = stateData;

            // Get connection
            const connection = await MarketplaceConnection.findById(connectionId);

            if (!connection) {
                return res.redirect("/dashboard?oauth_error=connection_not_found");
            }

            // Exchange code for tokens
            const service = MarketplaceServiceFactory.createService(connection);
            await service.exchangeCodeForTokens(code as string);

            // Update connection status
            connection.status = "connected";
            await connection.save();

            console.log(`✅ OAuth completed for ${type} connection ${connectionId}`);

            res.redirect(
                `/dashboard?oauth_success=true&connection_id=${connectionId}`,
            );
        } catch (error: any) {
            console.error("OAuth callback error:", error);
            res.redirect(
                `/dashboard?oauth_error=${encodeURIComponent(error.message)}`,
            );
        }
    }

    /**
     * Test marketplace connection
     * POST /api/marketplace/connections/:id/test
     */
    // async testConnection(req: Request, res: Response) {
    //     try {
    //         const { id, userId } = req.params;

    //         const connection = await MarketplaceConnection.findOne({
    //             _id: id,
    //             userId,
    //         });

    //         if (!connection) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "Connection not found",
    //             });
    //         }

    //         if (connection.status !== "connected") {
    //             try {
    //                 const marketplaceConfig = MARKETPLACE_CONFIGS[connection.type];

    //                 // If doesn't require OAuth (like WooCommerce with API keys)
    //                 if (!marketplaceConfig.requiresOAuth) {
    //                     // Test connection directly
    //                     const service = MarketplaceServiceFactory.createService(connection);
    //                     const isConnected = await service.testConnection();

    //                     if (isConnected) {
    //                         connection.status = "connected";
    //                         await connection.save();

    //                         return res.json({
    //                             success: true,
    //                             message: "Connected successfully",
    //                             requiresOAuth: false,
    //                         });
    //                     } else {
    //                         return res.status(400).json({
    //                             success: false,
    //                             message:
    //                                 "Connection test failed. Please check your credentials.",
    //                         });
    //                     }
    //                 }

    //                 // For OAuth marketplaces, generate authorization URL
    //                 const service = MarketplaceServiceFactory.createService(connection);
    //                 console.log(service)

    //                 const state = Buffer.from(
    //                     JSON.stringify({
    //                         connectionId: connection._id.toString(),
    //                         userId: userId,
    //                     }),
    //                 ).toString("base64");

    //                 console.log("state", state)

    //                 const authUrl = service.getAuthorizationUrl(state);
    //                 console.log("authurl", authUrl)
    //                 res.json({
    //                     success: true,
    //                     requiresOAuth: true,
    //                     authUrl: authUrl,
    //                     message: "Redirect user to authUrl to complete authorization",
    //                 });
    //             } catch (error) {
    //                 console.error("Error is connection testing ", error);
    //             }
    //         }

    //         const service = MarketplaceServiceFactory.createService(connection);
    //         const isConnected = await service.testConnection();

    //         if (isConnected) {
    //             res.json({
    //                 success: true,
    //                 message: "Connection test successful",
    //             });
    //         } else {
    //             res.status(400).json({
    //                 success: false,
    //                 message: "Connection test failed",
    //             });
    //         }
    //     } catch (error: any) {
    //         console.error("Connection test error:", error);
    //         res.status(500).json({
    //             success: false,
    //             message: error.message,
    //         });
    //     }
    // }

    // src/controllers/marketplace-controllers/marketplace.controller.ts

    async testConnection(req: Request, res: Response) {
        try {
            const { id, userId } = req.params;
console.log("request is coming here")
console.log("id",id, "userId", userId)
            // ─── Find Connection ─────────────────────────────────
            const connection = await MarketplaceConnection.findOne({
                _id: id,
                userId,
            });

            if (!connection) {
                return res.status(404).json({
                    success: false,
                    message: "Connection not found",
                });
            }

            const marketplaceConfig = MARKETPLACE_CONFIGS[connection.type];
            if (!marketplaceConfig) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid marketplace type: ${connection.type}`
                });
            }

            console.log(`\n🧪 Testing ${connection.type} connection: ${id}`);
            console.log('Current status:', connection.status);
            console.log('Has tokens:', !!connection.tokens);

            // ─── CASE 1: Not Connected Yet ──────────────────────
            if (connection.status !== "connected" || !connection.tokens) {

                // Non-OAuth marketplaces (WooCommerce, Shopify with direct API)
                if (!marketplaceConfig.requiresOAuth) {
                    console.log('Testing non-OAuth connection...');

                    const service = MarketplaceServiceFactory.createService(connection);
                    const isConnected = await service.testConnection();

                    if (isConnected) {
                        connection.status = "connected";
                        await connection.save();

                        return res.json({  // ✅ RETURN!
                            success: true,
                            message: "Connected successfully",
                            requiresOAuth: false,
                            status: "connected"
                        });
                    } else {
                        return res.status(400).json({  // ✅ RETURN!
                            success: false,
                            message: "Connection test failed. Please check your credentials.",
                        });
                    }
                }

                // OAuth marketplaces (eBay, Amazon, TikTok, etc.)
                console.log('Generating OAuth URL...');

                const service = MarketplaceServiceFactory.createService(connection);

                const state = Buffer.from(
                    JSON.stringify({
                        connectionId: connection._id.toString(),
                        userId: userId,
                    }),
                ).toString("base64");

                const authUrl = service.getAuthorizationUrl(state);

                console.log('✅ OAuth URL generated');

                return res.json({  // ✅ RETURN!
                    success: true,
                    requiresOAuth: true,
                    authUrl: authUrl,
                    message: "Open authUrl in popup to complete authorization",
                });
            }

            // ─── CASE 2: Already Connected - Test It ────────────
            console.log('Connection already connected - testing...');

            const service = MarketplaceServiceFactory.createService(connection);
            const isConnected = await service.testConnection();

            if (isConnected) {
                return res.json({  // ✅ RETURN!
                    success: true,
                    message: "Connection test successful",
                    status: "connected",
                    type: connection.type
                });
            } else {
                // Test failed - maybe token expired
                connection.status = "error";
                await connection.save();

                return res.status(400).json({  // ✅ RETURN!
                    success: false,
                    message: "Connection test failed. Token may be expired. Please reconnect.",
                    status: "error"
                });
            }

        } catch (error: any) {
            console.error("❌ Connection test error:", error.message);

            // ✅ Check if response already sent
            if (res.headersSent) {
                console.error('⚠️ Response already sent, skipping error response');
                return;
            }

            return res.status(500).json({  // ✅ RETURN!
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Sync marketplace data and update stats
     * POST /api/marketplace/connections/:id/sync
     */
    // async syncData(req: Request, res: Response) {
    //   const startTime = Date.now();

    //   try {
    //     const { id } = req.params;
    //     const userId = req.user?.id || "65b1234567890abcdef1234";

    //     const connection = await MarketplaceConnection.findOne({
    //       _id: id,
    //       userId
    //     });

    //     if (!connection) {
    //       return res.status(404).json({
    //         success: false,
    //         message: 'Connection not found'
    //       });
    //     }

    //     if (connection.status !== 'connected') {
    //       return res.status(400).json({
    //         success: false,
    //         message: 'Connection is not active'
    //       });
    //     }

    //     console.log(`🔄 Syncing data for ${connection.type} connection ${id}`);

    //     // Fetch stats using marketplace-specific service
    //     const service = MarketplaceServiceFactory.createService(connection);
    //     const stats = await service.fetchStats();

    //     console.log(`✅ Sync completed for ${connection.type} in ${Date.now() - startTime}ms`);

    //     res.json({
    //       success: true,
    //       message: 'Data synced successfully',
    //       data: {
    //         stats: connection.stats,
    //         lastSync: connection.lastSync,
    //         duration: Date.now() - startTime
    //       }
    //     });

    //   } catch (error: any) {
    //     console.error('Sync error:', error);
    //     res.status(500).json({
    //       success: false,
    //       message: error.message
    //     });
    //   }
    // }

    // src/controllers/MarketplaceController.ts

    /**
     * Sync data
     * POST /api/marketplace/connections/:id/sync
     */
    async syncData(req: Request, res: Response) {
        const startTime = Date.now();

        try {
            const { id, userId } = req.params;
            console.log("id", id, "userId", userId);
            const connection = await MarketplaceConnection.findOne({
                _id: id,
                userId,
            });

            if (!connection) {
                return res.status(404).json({
                    success: false,
                    message: "Connection not found",
                });
            }

            if (connection.status !== "connected") {
                return res.status(400).json({
                    success: false,
                    message: "Connection is not active. Please connect first.",
                });
            }

            console.log(`🔄 Syncing data for ${connection.type}`);

            const service = MarketplaceServiceFactory.createService(connection);

            // Fetch stats
            const stats = await service.fetchStats();

            // Also fetch products/listings
            const products = await service.fetchProducts({ limit: 100 });

            console.log(
                `✅ Sync completed for ${connection.type} in ${Date.now() - startTime}ms`,
            );

            res.json({
                success: true,
                message: "Data synced successfully",
                data: {
                    stats: connection.stats,
                    listings: products.listings || [],
                    totalListings: products.totalListings || 0,
                    lastSync: connection.lastSync,
                    duration: Date.now() - startTime,
                },
            });
        } catch (error: any) {
            console.error("Sync error:", error);
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Update marketplace connection
     * PUT /api/marketplace/connections/:id
     */
    async updateConnection(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, description, credentials } = req.body;
            const connection = await MarketplaceConnection.findOne({
                _id: id,
            });

            if (!connection) {
                return res.status(404).json({
                    success: false,
                    message: "Connection not found",
                });
            }

            // Update fields
            if (name) connection.name = name;
            if (description !== undefined) connection.description = description;

            // If credentials updated, re-encrypt and require reconnection
            if (credentials) {
                connection.credentials = encryptCredentials(credentials);
                connection.status = "disconnected";
                connection.tokens = undefined;
                connection.tokenExpiry = undefined;
            }

            await connection.save();

            res.json({
                success: true,
                message: "Connection updated",
                data: {
                    id: connection._id,
                    name: connection.name,
                    status: connection.status,
                },
            });
        } catch (error: any) {
            console.error("Update error:", error);
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * Delete marketplace connection
     * DELETE /api/marketplace/connections/:id
     */
    async deleteConnection(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const connection = await MarketplaceConnection.findOne({
                _id: id,
            });

            if (!connection) {
                return res.status(404).json({
                    success: false,
                    message: "Connection not found",
                });
            }

            // Soft delete
            connection.isActive = false;
            connection.status = "disconnected";
            await connection.save();

            console.log(`✅ Connection deleted: ${id}`);

            res.json({
                success: true,
                message: "Connection deleted successfully",
            });
        } catch (error: any) {
            console.error("Delete error:", error);
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // src/controllers/MarketplaceController.ts

    /**
     * List product using Trading API (simpler, no policies required)
     * POST /api/marketplace/connections/:id/products/simple
     */
    async listProductSimple(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const productData = req.body;
            console.log("Product", productData)

            const connection = await MarketplaceConnection.findOne({
                _id: id,
                
            });

            if (!connection) {
                return res.status(404).json({
                    success: false,
                    message: "Connection not found",
                });
            }

            if (connection.status !== "connected") {
                return res.status(400).json({
                    success: false,
                    message: "Connection not active. Please connect first.",
                });
            }

            console.log(`📦 Listing product on ${connection.type} (Trading API)`);

            const service = MarketplaceServiceFactory.createService(connection);

            // if (connection.type !== "ebay") {
            //     return res.status(400).json({
            //         success: false,
            //         message: "Trading API only available for eBay",
            //     });
            // }

            const result = await (service as any).listProduct(productData);

            console.log(`✅ Product listed successfully`);

            res.json({
                success: true,
                message: "Product listed successfully using Trading API",
                data: result,
            });
        } catch (error: any) {
            console.error("List product error:", error);
            res.status(500).json({
                success: false,
                message: error.message,
                ebayError: error.response?.data,
            });
        }
    }

    async getProducts(req: Request, res: Response) {
        try {
            const { id, userId } = req.params;
            const { limit = 100 } = req.query;

            const connection = await MarketplaceConnection.findOne({
                _id: id,
                userId,
            });

            if (!connection) {
                return res.status(404).json({
                    success: false,
                    message: "Connection not found",
                });
            }

            if (connection.status !== "connected") {
                return res.status(400).json({
                    success: false,
                    message: "Connection is not active",
                });
            }

            const service = MarketplaceServiceFactory.createService(connection);
            const products = await service.fetchProducts({ limit });

            res.json({
                success: true,
                data: products,
            });
        } catch (error: any) {
            console.error("Get products error:", error);
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // src/controllers/MarketplaceController.ts

    /**
     * Get marketplace policies (fulfillment, payment, return)
     * GET /api/marketplace/connections/:id/policies
     */
    async getPolicies(req: Request, res: Response) {
        try {
            const { id, userId } = req.params;

            const connection = await MarketplaceConnection.findOne({
                _id: id,
                userId,
            });

            if (!connection) {
                return res.status(404).json({
                    success: false,
                    message: "Connection not found",
                });
            }

            const service = MarketplaceServiceFactory.createService(connection);

            // if (connection.type === 'ebay') {
            //     await (service as EbayService).ensureValidToken();

            //     const headers = {
            //         'Authorization': `Bearer ${(service as any).tokens.accessToken}`,
            //         'Content-Type': 'application/json',
            //         'X-EBAY-C-MARKETPLACE-ID': 'EBAY_GB'
            //     };

            //     // Define the marketplace string - ensure this matches your header
            //     const marketplaceId = 'EBAY_GB';

            //     const [fulfillment, payment, returnPolicies] = await Promise.all([
            //         axios.get(`${connection.apiConfiguration.baseUrl}/sell/account/v1/fulfillment_policy?marketplace_id=${marketplaceId}`, { headers }),
            //         axios.get(`${connection.apiConfiguration.baseUrl}/sell/account/v1/payment_policy?marketplace_id=${marketplaceId}`, { headers }),
            //         axios.get(`${connection.apiConfiguration.baseUrl}/sell/account/v1/return_policy?marketplace_id=${marketplaceId}`, { headers })
            //     ]);

            //     res.json({
            //         success: true,
            //         data: {
            //             fulfillmentPolicies: fulfillment.data.fulfillmentPolicies || [],
            //             paymentPolicies: payment.data.paymentPolicies || [],
            //             returnPolicies: returnPolicies.data.returnPolicies || []
            //         }
            //     });
            // }
        } catch (error: any) {
            if (error.response) {
                // This will tell you EXACTLY what is wrong (e.g., "Missing marketplace ID")
                console.log("eBay Error Data:", error.response.data);
                console.log("Status:", error.response.status);
            } else {
                console.log("Error Message:", error.message);
            }
        }
    }

    async createBusinessPolicies(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { paypalEmail } = req.body;

            if (!paypalEmail) {
                return res.status(400).json({
                    success: false,
                    message: "PayPal email is required",
                });
            }

            const connection = await MarketplaceConnection.findById(id);

            if (!connection || connection.status !== "connected") {
                return res.status(400).json({
                    success: false,
                    message: "Connection not active",
                });
            }

            const service = MarketplaceServiceFactory.createService(
                connection,
            ) as any;
            await service.ensureValidToken();

            const headers = {
                Authorization: `Bearer ${service.tokens.accessToken}`,
                "Content-Type": "application/json",
            };

            const baseUrl = connection.apiConfiguration.baseUrl;

            console.log("\n📋 Creating Business Policies...");

            // 1. Create Fulfillment Policy
            console.log("\n1️⃣ Creating Fulfillment Policy...");

            let fulfillmentPolicyId;
            try {
                const fulfillmentRes = await axios.post(
                    `${baseUrl}/sell/account/v1/fulfillment_policy`,
                    {
                        name: "Standard Shipping Policy",
                        description: "Standard shipping with tracking",
                        marketplaceId: "EBAY_US",
                        categoryTypes: [
                            {
                                name: "ALL_EXCLUDING_MOTORS_VEHICLES",
                                default: true,
                            },
                        ],
                        handlingTime: {
                            value: 1,
                            unit: "DAY",
                        },
                        shipToLocations: {
                            regionIncluded: [
                                {
                                    regionName: "United States",
                                    regionType: "COUNTRY",
                                },
                            ],
                        },
                        shippingOptions: [
                            {
                                costType: "FLAT_RATE",
                                optionType: "DOMESTIC",
                                shippingServices: [
                                    {
                                        buyerResponsibleForShipping: false,
                                        freeShipping: true,
                                        shippingCarrierCode: "USPS",
                                        shippingServiceCode: "USPSPriority",
                                        sortOrder: 1,
                                    },
                                ],
                            },
                        ],
                        globalShipping: false,
                    },
                    { headers },
                );

                fulfillmentPolicyId = fulfillmentRes.data.fulfillmentPolicyId;
                console.log("✅ Fulfillment Policy Created:", fulfillmentPolicyId);
            } catch (error: any) {
                if (error.response?.data?.errors?.[0]?.errorId === 20400) {
                    // Agar duplicate hai, toh error message se ID nikal lo
                    fulfillmentPolicyId = error.response.data.errors[0].parameters.find(
                        (p: any) => p.name === "DuplicateProfileId",
                    )?.value;
                    console.log(
                        "♻️ Using existing Fulfillment Policy:",
                        fulfillmentPolicyId,
                    );
                } else {
                    throw error; // Asli error hai toh stop karein
                }
            }

            // 2. Create Payment Policy
            console.log("\n2️⃣ Creating Payment Policy...");

            let paymentPolicyId;
            try {
                const paymentRes = await axios.post(
                    `${baseUrl}/sell/account/v1/payment_policy`,
                    // {
                    //   name: 'Immediate Payment Required',
                    //   description: 'Payment required at checkout',
                    //   marketplaceId: 'EBAY_US',
                    //   categoryTypes: [
                    //     {
                    //       name: 'ALL_EXCLUDING_MOTORS_VEHICLES',
                    //       default: true
                    //     }
                    //   ],
                    //   paymentMethods: [
                    //     {
                    //       paymentMethodType: [],
                    //       recipientAccountReference: {
                    //         referenceId: paypalEmail,
                    //         referenceType: 'PAYPAL_EMAIL'
                    //       }
                    //     }
                    //   ],
                    //   immediatePay: true
                    // },
                    {
                        name: "Immediate Payment Required",
                        description: "Payment managed by eBay",
                        marketplaceId: "EBAY_US",
                        categoryTypes: [
                            { name: "ALL_EXCLUDING_MOTORS_VEHICLES", default: true },
                        ],
                        paymentMethods: [],
                        immediatePay: true,
                    },
                    { headers },
                );

                paymentPolicyId = paymentRes.data.paymentPolicyId;
                console.log("✅ Payment Policy Created:", paymentPolicyId);
            } catch (error: any) {
                console.error("❌ Payment Policy Error:", error.response?.data);
                throw new Error(
                    `Failed to create payment policy: ${JSON.stringify(error.response?.data)}`,
                );
            }

            // 3. Create Return Policy
            console.log("\n3️⃣ Creating Return Policy...");

            let returnPolicyId;
            try {
                const returnRes = await axios.post(
                    `${baseUrl}/sell/account/v1/return_policy`,
                    {
                        name: "30 Day Returns",
                        description: "30 day return policy",
                        marketplaceId: "EBAY_US",
                        categoryTypes: [
                            {
                                name: "ALL_EXCLUDING_MOTORS_VEHICLES",
                                default: true,
                            },
                        ],
                        returnsAccepted: true,
                        returnPeriod: {
                            value: 30,
                            unit: "DAY",
                        },
                        returnShippingCostPayer: "BUYER",
                        refundMethod: "MONEY_BACK",
                    },
                    { headers },
                );

                returnPolicyId = returnRes.data.returnPolicyId;
                console.log("✅ Return Policy Created:", returnPolicyId);
            } catch (error: any) {
                console.error("❌ Return Policy Error:", error.response?.data);
                throw new Error(
                    `Failed to create return policy: ${JSON.stringify(error.response?.data)}`,
                );
            }

            console.log("\n✅ All policies created successfully!\n");

            // Save policy IDs to connection metadata
            connection.set("policyIds", {
                fulfillmentPolicyId,
                paymentPolicyId,
                returnPolicyId,
            });
            await connection.save();

            res.json({
                success: true,
                message: "Business policies created successfully",
                data: {
                    fulfillmentPolicyId,
                    paymentPolicyId,
                    returnPolicyId,
                },
            });
        } catch (error: any) {
            console.error("\n❌ Policy creation failed:", error.message);

            res.status(500).json({
                success: false,
                message: error.message,
                details: error.response?.data,
            });
        }
    }

    // src/controllers/MarketplaceController.ts

    /**
     * Opt-in to Business Policies program
     * POST /api/marketplace/connections/:id/opt-in-business-policies
     */
    async optInBusinessPolicies(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const connection = await MarketplaceConnection.findById(id);

            if (!connection || connection.status !== "connected") {
                return res.status(400).json({
                    success: false,
                    message: "Connection not active",
                });
            }

            const service = MarketplaceServiceFactory.createService(
                connection,
            ) as any;
            await service.ensureValidToken();

            const headers = {
                Authorization: `Bearer ${service.tokens.accessToken}`,
                "Content-Type": "application/json",
            };

            console.log("\n✅ Opting in to Business Policies...");

            // Opt-in to business policies
            try {
                const response = await axios.post(
                    `${connection.apiConfiguration.baseUrl}/sell/account/v1/program/opt_in`,
                    {
                        programType: "SELLING_POLICY_MANAGEMENT",
                    },
                    { headers },
                );

                console.log("✅ Successfully opted in to Business Policies!");
                console.log("Response:", response.data);

                res.json({
                    success: true,
                    message: "Successfully opted in to Business Policies program",
                    data: response.data,
                });
            } catch (error: any) {
                console.error("❌ Opt-in failed:", error.response?.data);

                // Check if already opted in
                if (error.response?.data?.errors?.[0]?.errorId === 20407) {
                    return res.json({
                        success: true,
                        message: "Already opted in to Business Policies",
                        alreadyOptedIn: true,
                    });
                }

                throw error;
            }
        } catch (error: any) {
            console.error("❌ Error:", error.message);

            res.status(500).json({
                success: false,
                message: error.message,
                details: error.response?.data,
            });
        }
    }





// ── Types ─────────────────────────────────────────────────────────────────────



// ─────────────────────────────────────────────────────────────────────────────
// Controller Method
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Distribute a product across one or more marketplaces
 * POST /api/marketplace/distribute
 *
 * Body: {
 *   productId,
 *   userId,
 *   distributions: [{ connectionId, quantity }],
 *   productData: { name, sku, price, ... }
 * }
 */
async distributeProducts(req: Request, res: Response) {
  try {
    const { productId, userId, distributions, productData }: DistributeRequestBody = req.body;

    // ── Validate input ────────────────────────────────────────────────────────

    if (!productId || !userId) {
      return res.status(400).json({
        success: false,
        message: "productId and userId are required",
      });
    }

    if (!distributions?.length) {
      return res.status(400).json({
        success: false,
        message: "At least one distribution entry is required",
      });
    }

    const validDistributions = distributions.filter((d) => d.quantity > 0);

    if (!validDistributions.length) {
      return res.status(400).json({
        success: false,
        message: "All quantities are zero — nothing to distribute",
      });
    }

    console.log(
      `\n🚀 Distributing product [${productData.name}] to ${validDistributions.length} marketplace(s)`
    );

    // ── Process each marketplace in parallel ─────────────────────────────────

    const results: DistributionResult[] = await Promise.allSettled(
      validDistributions.map(async ({ connectionId, quantity }) => {
        // 1. Find the connection
        const connection = await MarketplaceConnection.findOne({
          _id: connectionId,
          userId,
          isActive: true,
        });

        if (!connection) {
          throw new Error(`Connection [${connectionId}] not found or inactive`);
        }

        if (connection.status !== "connected") {
          throw new Error(
            `Connection [${connection.type}] is not connected. Please connect first.`
          );
        }

        // 2. Find marketplace-specific pricing from product attributes
        //    Product stores pricing per marketplace inside attributes[].pricing[]
        const marketplacePricing = productData.attributes
          ?.flatMap((attr) => attr.pricing ?? [])
          .find(
            (p) =>
              p.marketplaceName?.toLowerCase() === connection.type.toLowerCase() ||
              p.marketplaceId === connectionId
          );

        const sellingPrice =
          marketplacePricing?.sellingPrice ?? productData.price;

        // 3. Build the listing payload
        const listingPayload = {
          // Core product info
          title: productData.name,
          description: productData.description ?? productData.name,
          sku: productData.sku,

          // Pricing — use marketplace-specific price if available
          price: sellingPrice,
          comparePrice: marketplacePricing?.retailPrice,
          costPrice: marketplacePricing?.costPrice ?? productData.costPrice,

          // Stock — list exactly the quantity the user assigned
          quantity,

          // Media
          images: productData.images?.filter((img) => img && !img.startsWith("data:")) ?? [],
          imageUrl: productData.imageUrl?.startsWith("data:")
            ? undefined
            : productData.imageUrl,

          // Meta — services may use these
          marketplace: connection.type,
          connectionId,
        };

        console.log(
          `  📦 Listing on [${connection.type}] — qty: ${quantity}, price: £${sellingPrice}`
        );

        // 4. Call the marketplace service
        const service = MarketplaceServiceFactory.createService(connection);
        const result = await (service as any).listProduct(listingPayload);

        return {
          connectionId,
          marketplaceName: connection.type,
          quantity,
          success: true,
          listingId: result?.productId ?? result?.listingId,
          viewUrl: result?.viewUrl,
        } as DistributionResult;
      })
    ).then((settled) =>
      settled.map((outcome, i) => {
        if (outcome.status === "fulfilled") {
          return outcome.value;
        }
        // Rejected — return a structured failure instead of throwing
        console.error(
          `  ❌ Failed for connection [${validDistributions[i].connectionId}]:`,
          outcome.reason?.message
        );
        return {
          connectionId: validDistributions[i].connectionId,
          marketplaceName: "unknown",
          quantity: validDistributions[i].quantity,
          success: false,
          error: outcome.reason?.message ?? "Unknown error",
        } as DistributionResult;
      })
    );

    // ── Build summary ─────────────────────────────────────────────────────────

    const succeeded = results.filter((r) => r.success);
    const failed    = results.filter((r) => !r.success);

    console.log(
      `\n✅ Distribution complete — ${succeeded.length} succeeded, ${failed.length} failed\n`
    );

    // Return 207 Multi-Status when there's a mix of success and failure
    const statusCode = failed.length === 0 ? 200 : succeeded.length === 0 ? 500 : 207;

    return res.status(statusCode).json({
      success: failed.length === 0,
      message:
        failed.length === 0
          ? `Product listed on ${succeeded.length} marketplace(s) successfully`
          : `${succeeded.length} succeeded, ${failed.length} failed`,
      data: {
        productId,
        results,
        summary: {
          total:     results.length,
          succeeded: succeeded.length,
          failed:    failed.length,
        },
      },
    });
  } catch (error: any) {
    console.error("❌ Distribute error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ADD TO YOUR ROUTER (marketplace.routes.ts or wherever you register routes)
// ─────────────────────────────────────────────────────────────────────────────
//
//   import { MarketplaceController } from './controllers/MarketplaceController';
//   const ctrl = new MarketplaceController();
//
//   router.post('/distribute', ctrl.distributeProducts.bind(ctrl));
//
// ─────────────────────────────────────────────────────────────────────────────
}
