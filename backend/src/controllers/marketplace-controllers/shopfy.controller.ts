// src/controllers/ShopifyController.ts

import { Request, Response } from 'express';
import MarketplaceConnection from '../../models/marketplace/marketlace-connection-models';
import { MarketplaceServiceFactory } from '../../services/marketplace-Services/MarketplaceServiceFactory';
import { encryptCredentials, decryptCredentials } from '../../utils/encryption';

export class ShopifyController {


    // ============================================================
    // CREATE CONNECTION
    // POST /api/shopify/connections
    // ============================================================
    async createConnection(req: Request, res: Response) {
        try {
            const { name, description, credentials, userId } = req.body;

            // Validate required fields
            if (!credentials?.shopName) {
                return res.status(400).json({
                    success: false,
                    message: 'Shop name is required (e.g., your-store-name)'
                });
            }

            if (!credentials?.accessToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Admin API Access Token is required (shpat_...)'
                });
            }

            // Clean shop name (remove .myshopify.com if user added it)
            credentials.shopName = credentials.shopName
                .replace('.myshopify.com', '')
                .replace('https://', '')
                .replace('http://', '')
                .trim();

            // Encrypt credentials
            const encryptedCredentials = encryptCredentials(credentials);

            // Create connection in DB
            const connection = await MarketplaceConnection.create({
                userId,
                name: name || `${credentials.shopName} - Shopify`,
                description: description || `Shopify store: ${credentials.shopName}`,
                type: 'shopify',
                credentials: encryptedCredentials,
                apiConfiguration: {
                    authType: 'api_key',
                    environment: 'production',
                    baseUrl: `https://${credentials.shopName}.myshopify.com/admin/api/2024-01`,
                },
                status: 'disconnected'
            });

            console.log(`✅ Shopify connection created: ${connection._id}`);

            res.status(201).json({
                success: true,
                message: 'Shopify connection created successfully',
                data: {
                    id: connection._id,
                    name: connection.name,
                    type: 'shopify',
                    status: 'disconnected',
                    shopName: credentials.shopName
                }
            });

        } catch (error: any) {
            console.error('❌ Create Shopify connection error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }


    // ============================================================
    // CONNECT (Test credentials & mark as connected)
    // POST /api/shopify/connections/:id/connect
    // ============================================================
    async connectShopify(req: Request, res: Response) {
        try {
            const { id, userId } = req.params;


            const connection = await MarketplaceConnection.findOne({ _id: id, userId });

            if (!connection) {
                return res.status(404).json({
                    success: false,
                    message: 'Connection not found'
                });
            }

            console.log(`\n🔌 Testing Shopify connection: ${id}`);

            const service = MarketplaceServiceFactory.createService(connection) as any;
            const isConnected = await service.testConnection();

            if (!isConnected) {
                connection.status = 'error';
                await connection.save();

                return res.status(400).json({
                    success: false,
                    message: 'Connection failed. Please check your Admin API Access Token and Shop Name.'
                });
            }

            // Save token for future use
            const credentials = decryptCredentials(connection.credentials);
            await service.saveTokens({
                accessToken: credentials.accessToken,
                expiresIn: 999999999
            });

            // Update status to connected
            connection.status = 'connected';
            await connection.save();

            console.log(`✅ Shopify ${id} is now CONNECTED!`);

            res.json({
                success: true,
                requiresOAuth: false,
                status: 'connected',
                message: '✅ Shopify store connected successfully!'
            });

        } catch (error: any) {
            console.error('❌ Shopify connect error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // ============================================================
    // TEST CONNECTION
    // POST /api/shopify/connections/:id/test
    // ============================================================
    async testConnection(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const connection = await MarketplaceConnection.findById(id);

            if (!connection || connection.status !== 'connected') {
                return res.status(400).json({
                    success: false,
                    message: 'Connection not active. Please connect first.'
                });
            }

            const service = MarketplaceServiceFactory.createService(connection) as any;
            const isConnected = await service.testConnection();

            if (isConnected) {
                // Get store info
                const credentials = decryptCredentials(connection.credentials);
                const axios = (await import('axios')).default;

                const shopInfo = await axios.get(
                    `https://${credentials.shopName}.myshopify.com/admin/api/2024-01/shop.json`,
                    {
                        headers: {
                            'X-Shopify-Access-Token': credentials.accessToken,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                res.json({
                    success: true,
                    message: '✅ Shopify connection is active!',
                    data: {
                        storeName: shopInfo.data.shop.name,
                        domain: shopInfo.data.shop.domain,
                        email: shopInfo.data.shop.email,
                        currency: shopInfo.data.shop.currency,
                        country: shopInfo.data.shop.country_name,
                        plan: shopInfo.data.shop.plan_display_name
                    }
                });

            } else {
                res.status(400).json({
                    success: false,
                    message: '❌ Connection failed. Token may be invalid.'
                });
            }

        } catch (error: any) {
            console.error('❌ Test connection error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // ============================================================
    // LIST PRODUCT
    // POST /api/shopify/connections/:id/products
    // ============================================================
    // async listProduct(req: Request, res: Response) {
    //     try {
    //         const { id, userId } = req.params;
    //         const productData = req.body;

    //         // Validate required fields
    //         if (!productData.title) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: 'Product title is required'
    //             });
    //         }

    //         if (!productData.price) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: 'Product price is required'
    //             });
    //         }

    //         const connection = await MarketplaceConnection.findOne({ _id: id, userId });

    //         if (!connection) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: 'Connection not found'
    //             });
    //         }

    //         if (connection.status !== 'connected') {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: 'Please connect your Shopify store first'
    //             });
    //         }

    //         console.log(`\n📦 Listing product on Shopify: ${productData.title}`);

    //         const service = MarketplaceServiceFactory.createService(connection);
    //         const result = await service.listProduct(productData);

    //         console.log(`✅ Product listed on Shopify!`);

    //         res.json({
    //             success: true,
    //             message: 'Product listed successfully on Shopify!',
    //             data: result
    //         });

    //     } catch (error: any) {
    //         console.error('❌ List product error:', error);
    //         res.status(500).json({
    //             success: false,
    //             message: error.message
    //         });
    //     }
    // }

    // ============================================================
    // GET PRODUCTS (all listings)
    // GET /api/shopify/connections/:id/products
    // ============================================================
    async getProducts(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { limit = 50 } = req.query;

            const connection = await MarketplaceConnection.findById(id);

            if (!connection || connection.status !== 'connected') {
                return res.status(400).json({
                    success: false,
                    message: 'Connection not active'
                });
            }

            const service = MarketplaceServiceFactory.createService(connection);
            const result = await service.fetchProducts({ limit: Number(limit) });

            res.json({
                success: true,
                data: result
            });

        } catch (error: any) {
            console.error('❌ Get products error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // ============================================================
    // SYNC DATA (stats + listings)
    // POST /api/shopify/connections/:id/sync
    // ============================================================
    async syncData(req: Request, res: Response) {
        const startTime = Date.now();

        try {
            const { id, userId } = req.params;

            const connection = await MarketplaceConnection.findOne({ _id: id, userId });

            if (!connection) {
                return res.status(404).json({
                    success: false,
                    message: 'Connection not found'
                });
            }

            if (connection.status !== 'connected') {
                return res.status(400).json({
                    success: false,
                    message: 'Connection is not active. Please connect first.'
                });
            }

            console.log(`\n🔄 Syncing Shopify data for: ${connection.name}`);

            const service = MarketplaceServiceFactory.createService(connection);

            // Fetch stats and products in parallel
            const [stats, products] = await Promise.all([
                service.fetchStats(),
                service.fetchProducts({ limit: 100 })
            ]);

            const duration = Date.now() - startTime;
            console.log(`✅ Shopify sync completed in ${duration}ms`);

            res.json({
                success: true,
                message: 'Shopify data synced successfully',
                data: {
                    stats: connection.stats,
                    listings: products.listings || [],
                    totalListings: products.totalListings || 0,
                    lastSync: connection.lastSync,
                    duration
                }
            });

        } catch (error: any) {
            console.error('❌ Sync error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // ============================================================
    // GET CONNECTION INFO
    // GET /api/shopify/connections/:id
    // ============================================================
    async getConnection(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const connection = await MarketplaceConnection.findById(id).select('-credentials');

            if (!connection) {
                return res.status(404).json({
                    success: false,
                    message: 'Connection not found'
                });
            }

            res.json({
                success: true,
                data: connection
            });

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // ============================================================
    // GET ALL CONNECTIONS
    // GET /api/shopify/connections
    // ============================================================
    async getConnections(req: Request, res: Response) {
        try {
            const userId = req.userId?.id || '65b1234567890abcdef1234';

            const connections = await MarketplaceConnection
                .find({ userId, type: 'shopify' })
                .select('-credentials')
                .sort({ createdAt: -1 });

            res.json({
                success: true,
                data: connections
            });

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // ============================================================
    // DELETE CONNECTION
    // DELETE /api/shopify/connections/:id
    // ============================================================
    async deleteConnection(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.userId?.id || '65b1234567890abcdef1234';

            const connection = await MarketplaceConnection.findOneAndDelete({
                _id: id,
                userId
            });

            if (!connection) {
                return res.status(404).json({
                    success: false,
                    message: 'Connection not found'
                });
            }

            res.json({
                success: true,
                message: 'Shopify connection deleted successfully'
            });

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}