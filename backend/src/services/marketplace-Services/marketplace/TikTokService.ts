// services/marketplace/TikTokService.ts

import { BaseMarketplaceService } from '../BaseMarketplaceService';
import axios from 'axios';
import crypto from 'crypto';

export class TikTokService extends BaseMarketplaceService {

    // ── Base URL ──────────────────────────────────────────────────────────────
    
    private getBaseUrl(): string {
        return 'https://open-api.tiktokglobalshop.com';
    }

    // ── Generate Signature (TikTok requires HMAC-SHA256 signature) ────────────
    
    private generateSignature(path: string, timestamp: number, params: any = {}): string {
        const clientSecret = this.credentials.clientSecret;
        
        // Sort parameters alphabetically
        const sortedParams = Object.keys(params)
            .sort()
            .map(key => `${key}${params[key]}`)
            .join('');
        
        // Build string to sign: path + sorted params + timestamp
        const stringToSign = `${path}${sortedParams}${timestamp}`;
        
        // Generate HMAC-SHA256 signature
        const signature = crypto
            .createHmac('sha256', clientSecret)
            .update(stringToSign)
            .digest('hex');
        
        return signature;
    }

    // ── Auth Headers for TikTok ───────────────────────────────────────────────
    
    protected getAuthHeaders(path: string = '', params: any = {}): Record<string, string> {
        const timestamp = Math.floor(Date.now() / 1000);
        
        const baseParams = {
            app_key: this.credentials.clientKey,
            timestamp: timestamp.toString(),
            access_token: this.credentials.accessToken || '',
            ...params
        };
        
        const signature = this.generateSignature(path, timestamp, baseParams);
        
        return {
            'Content-Type': 'application/json',
            'x-tts-access-token': this.credentials.accessToken || '',
        };
    }

    // ── Build Request URL with Signature ──────────────────────────────────────
    
    private buildUrl(path: string, additionalParams: any = {}): string {
        const timestamp = Math.floor(Date.now() / 1000);
        
        const params = {
            app_key: this.credentials.clientKey,
            timestamp: timestamp.toString(),
            access_token: this.credentials.accessToken || '',
            ...additionalParams
        };
        
        const signature = this.generateSignature(path, timestamp, params);
        params['sign'] = signature;
        
        const queryString = Object.keys(params)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');
        
        return `${this.getBaseUrl()}${path}?${queryString}`;
    }

    // ── OAuth Implementation ──────────────────────────────────────────────────
    
    getAuthorizationUrl(state: string): string {
        const params = new URLSearchParams({
            app_key: this.credentials.clientKey,
            state: state,
            // redirect_uri: 'YOUR_REDIRECT_URI', // Add your redirect URI
        });
        
       return `https://services.tiktokshop.com/open/authorize?${params.toString()}`;
    }

    async exchangeCodeForTokens(code: string): Promise<any> {
        try {
            const timestamp = Math.floor(Date.now() / 1000);
            const path = '/api/token/get';
            
            const params = {
                app_key: this.credentials.clientKey,
                app_secret: this.credentials.clientSecret,
                auth_code: code,
                grant_type: 'authorized_code'
            };
            
            const response = await axios.post(
                `${this.getBaseUrl()}${path}`,
                params,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            
            if (response.data.code === 0) {
                const tokenData = response.data.data;
                
                // Save tokens to credentials
                this.credentials.accessToken = tokenData.access_token;
                this.credentials.refreshToken = tokenData.refresh_token;
                this.credentials.accessTokenExpiry = Date.now() + (tokenData.access_token_expire_in * 1000);
                this.credentials.refreshTokenExpiry = Date.now() + (tokenData.refresh_token_expire_in * 1000);
                
                await this.connection.save();
                
                return tokenData;
            } else {
                throw new Error(`TikTok token exchange failed: ${response.data.message}`);
            }
        } catch (error: any) {
            console.error('❌ TikTok exchangeCodeForTokens failed:', error.response?.data ?? error.message);
            throw error;
        }
    }

    async refreshAccessToken(): Promise<any> {
        try {
            const path = '/api/token/refresh';
            
            const params = {
                app_key: this.credentials.clientKey,
                app_secret: this.credentials.clientSecret,
                refresh_token: this.credentials.refreshToken,
                grant_type: 'refresh_token'
            };
            
            const response = await axios.post(
                `${this.getBaseUrl()}${path}`,
                params,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            
            if (response.data.code === 0) {
                const tokenData = response.data.data;
                
                // Update tokens
                this.credentials.accessToken = tokenData.access_token;
                this.credentials.refreshToken = tokenData.refresh_token;
                this.credentials.accessTokenExpiry = Date.now() + (tokenData.access_token_expire_in * 1000);
                this.credentials.refreshTokenExpiry = Date.now() + (tokenData.refresh_token_expire_in * 1000);
                
                await this.connection.save();
                
                console.log('✅ TikTok access token refreshed');
                return tokenData;
            } else {
                throw new Error(`TikTok token refresh failed: ${response.data.message}`);
            }
        } catch (error: any) {
            console.error('❌ TikTok refreshAccessToken failed:', error.response?.data ?? error.message);
            throw error;
        }
    }

    // ── Auto-refresh token if expired ─────────────────────────────────────────
    
     async ensureValidToken(): Promise<void> {
        const now = Date.now();
        const expiryBuffer = 5 * 60 * 1000; // 5 minutes buffer
        
        if (this.credentials.accessTokenExpiry && now >= (this.credentials.accessTokenExpiry - expiryBuffer)) {
            console.log('🔄 TikTok access token expired, refreshing...');
            await this.refreshAccessToken();
        }
    }

    // ── Test Connection ───────────────────────────────────────────────────────
    
    async testConnection(): Promise<boolean> {
        try {
            await this.ensureValidToken();
            
            const path = '/api/shop/get_authorized_shop';
            const url = this.buildUrl(path);
            
            console.log(`🔗 TikTok test URL: ${url}`);
            
            const response = await axios.get(url, {
                headers: this.getAuthHeaders(path)
            });
            
            if (response.data.code === 0) {
                console.log('✅ TikTok connection successful');
                console.log('Shop Info:', response.data.data);
                return true;
            } else {
                console.error('❌ TikTok test failed:', response.data.message);
                return false;
            }
        } catch (error: any) {
            console.error('❌ TikTok test failed:', error.response?.data ?? error.message);
            return false;
        }
    }

    // ── Fetch Products ────────────────────────────────────────────────────────
    
    async fetchProducts(params: any = {}): Promise<any> {
        try {
            await this.ensureValidToken();
            
            const path = '/api/products/search';
            const pageSize = params.limit || 100;
            let page = 1;
            const allListings: any[] = [];
            
            while (true) {
                const requestParams = {
                    page_number: page,
                    page_size: pageSize,
                    search_status: 1, // 1 = live products
                };
                
                const url = this.buildUrl(path, requestParams);
                const response = await axios.post(
                    url,
                    {},
                    {
                        headers: this.getAuthHeaders(path, requestParams)
                    }
                );
                
                if (response.data.code !== 0) {
                    console.error('❌ TikTok fetchProducts failed:', response.data.message);
                    break;
                }
                
                const products = response.data.data?.products || [];
                
                if (!products.length) break;
                
                for (const product of products) {
                    // TikTok products have SKUs
                    const skus = product.skus || [];
                    
                    if (skus.length > 0) {
                        // Each SKU is a separate listing
                        for (const sku of skus) {
                            allListings.push({
                                externalId: `${product.id}-${sku.id}`,
                                sku: sku.seller_sku || '',
                                title: product.title,
                                price: parseFloat(sku.price?.amount || '0'),
                                quantity: sku.inventory?.quantity || 0,
                                status: product.status === 1 ? 'active' : 'inactive',
                                imageUrl: product.images?.[0]?.url,
                                viewUrl: product.product_url,
                                raw: { product, sku }
                            });
                        }
                    } else {
                        // Product without SKUs
                        allListings.push({
                            externalId: String(product.id),
                            sku: product.seller_sku || '',
                            title: product.title,
                            price: 0,
                            quantity: 0,
                            status: product.status === 1 ? 'active' : 'inactive',
                            imageUrl: product.images?.[0]?.url,
                            viewUrl: product.product_url,
                            raw: product
                        });
                    }
                }
                
                // Check if we've reached the last page
                const totalCount = response.data.data?.total || 0;
                if (page * pageSize >= totalCount) break;
                
                page++;
            }
            
            console.log(`✅ TikTok: fetched ${allListings.length} listings`);
            return { 
                success: true, 
                totalListings: allListings.length, 
                listings: allListings 
            };
            
        } catch (error: any) {
            console.error('❌ TikTok fetchProducts failed:', error.response?.data ?? error.message);
            return { success: false, totalListings: 0, listings: [] };
        }
    }

    // ── List (Create) Product ─────────────────────────────────────────────────
    
    async listProduct(productData: any): Promise<any> {
        try {
            await this.ensureValidToken();
            
            console.log("🛍️ TikTok: Creating product listing...");
            
            const path = '/api/products/create';
            
            // Build TikTok product payload
            const payload = {
                product: {
                    title: productData.title,
                    description: productData.description || '',
                    category_id: productData.categoryId || '', // Required by TikTok
                    brand: {
                        name: productData.brand || 'Generic'
                    },
                    images: productData.images?.map((url: string) => ({ url })) || [],
                    skus: [
                        {
                            seller_sku: productData.sku,
                            price: {
                                amount: String(productData.price),
                                currency: 'USD'
                            },
                            inventory: {
                                quantity: productData.quantity || 0
                            }
                        }
                    ],
                    package_dimensions: productData.weight ? {
                        weight: {
                            value: String(productData.weight),
                            unit: 'KILOGRAM'
                        }
                    } : undefined
                }
            };
            
            const url = this.buildUrl(path);
            const response = await axios.post(
                url,
                payload,
                {
                    headers: this.getAuthHeaders(path)
                }
            );
            
            if (response.data.code === 0) {
                const productId = response.data.data?.product_id;
                console.log(`✅ TikTok: product listed — ID ${productId}`);
                
                return {
                    success: true,
                    externalId: String(productId),
                    viewUrl: response.data.data?.product_url,
                };
            } else {
                throw new Error(`TikTok listing failed: ${response.data.message}`);
            }
            
        } catch (error: any) {
            console.error('❌ TikTok listProduct failed:', error.response?.data);
            throw new Error(
                `TikTok listing failed: ${JSON.stringify(error.response?.data ?? error.message)}`
            );
        }
    }

    // ── Update Stock ──────────────────────────────────────────────────────────
    
    async updateStock(externalId: string, quantity: number): Promise<boolean> {
        try {
            await this.ensureValidToken();
            
            // TikTok external ID format: "productId-skuId"
            const [productId, skuId] = externalId.split('-');
            
            const path = '/api/products/stocks/update';
            
            const payload = {
                product_id: productId,
                skus: [
                    {
                        id: skuId,
                        available_stock: quantity
                    }
                ]
            };
            
            const url = this.buildUrl(path);
            const response = await axios.post(
                url,
                payload,
                {
                    headers: this.getAuthHeaders(path)
                }
            );
            
            if (response.data.code === 0) {
                console.log(`✅ TikTok stock updated — ID ${externalId} → ${quantity}`);
                return true;
            } else {
                console.error('❌ TikTok updateStock failed:', response.data.message);
                return false;
            }
        } catch (error: any) {
            console.error('❌ TikTok updateStock failed:', error.response?.data);
            return false;
        }
    }

    // ── Fetch Orders ──────────────────────────────────────────────────────────
    
    async fetchOrders(params: any = {}): Promise<any> {
        try {
            await this.ensureValidToken();
            
            const path = '/api/orders/search';
            
            const requestParams = {
                page_size: params.limit || 100,
                create_time_from: params.createdAfter 
                    ? Math.floor(new Date(params.createdAfter).getTime() / 1000)
                    : Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000),
                create_time_to: Math.floor(Date.now() / 1000),
            };
            
            const url = this.buildUrl(path, requestParams);
            const response = await axios.post(
                url,
                {},
                {
                    headers: this.getAuthHeaders(path, requestParams)
                }
            );
            
            if (response.data.code === 0) {
                return { orders: response.data.data?.orders || [] };
            } else {
                console.error('❌ TikTok fetchOrders failed:', response.data.message);
                return { orders: [] };
            }
        } catch (error: any) {
            console.error('❌ TikTok fetchOrders failed:', error.response?.data);
            return { orders: [] };
        }
    }

    // ── Fetch Stats ───────────────────────────────────────────────────────────
    
    async fetchStats(): Promise<any> {
        try {
            const [ordersData, productsData] = await Promise.all([
                this.fetchOrders({ limit: 100 }),
                this.fetchProducts({ limit: 100 }),
            ]);
            
            const orders = ordersData.orders || [];
            const listings = productsData.listings || [];
            
            const stats = {
                totalSales: orders.length,
                pendingOrders: orders.filter((o: any) => o.status === 'AWAITING_SHIPMENT').length,
                activeListings: listings.filter((p: any) => p.status === 'active').length,
                totalRevenue: orders.reduce((sum: number, order: any) => {
                    return sum + parseFloat(order.payment?.total_amount || 0);
                }, 0),
                revenue24h: this.calcRevenue24h(orders),
                growth: this.calcGrowth(orders),
            };
            
            this.connection.stats = stats;
            this.connection.lastSync = new Date();
            await this.connection.save();
            
            return stats;
        } catch (error: any) {
            console.error('❌ TikTok fetchStats failed:', error.message);
            return { 
                totalSales: 0, 
                pendingOrders: 0, 
                activeListings: 0, 
                totalRevenue: 0 
            };
        }
    }

    // ── Helper: Calculate 24h Revenue ─────────────────────────────────────────
    
    private calcRevenue24h(orders: any[]): number {
        const cutoff = Date.now() - 24 * 60 * 60 * 1000;
        return orders
            .filter((o) => new Date(o.create_time * 1000).getTime() >= cutoff)
            .reduce((sum, o) => sum + parseFloat(o.payment?.total_amount || 0), 0);
    }

    // ── Helper: Calculate Growth ──────────────────────────────────────────────
    
    private calcGrowth(orders: any[]): number {
        const now = Date.now();
        const week = 7 * 24 * 60 * 60 * 1000;
        
        const thisWeek = orders
            .filter((o) => new Date(o.create_time * 1000).getTime() >= now - week)
            .reduce((sum, o) => sum + parseFloat(o.payment?.total_amount || 0), 0);
        
        const prevWeek = orders
            .filter((o) => {
                const t = new Date(o.create_time * 1000).getTime();
                return t >= now - 2 * week && t < now - week;
            })
            .reduce((sum, o) => sum + parseFloat(o.payment?.total_amount || 0), 0);
        
        return prevWeek > 0 ? ((thisWeek - prevWeek) / prevWeek) * 100 : 0;
    }
}