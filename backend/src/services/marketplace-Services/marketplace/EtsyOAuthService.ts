// services/marketplace-Services/marketplace/EtsyService.ts

import { BaseMarketplaceService } from '../BaseMarketplaceService';
import axios from 'axios';
import crypto from 'crypto';

export class EtsyService extends BaseMarketplaceService {

    // ─── Get Authorization URL (OAuth2 with PKCE) ──────────────
    getAuthorizationUrl(state: string): string {
        const clientId = this.credentials.clientId;
        const callbackUrl = this.connection.apiConfiguration.authorizeUrl || 
                           process.env.ETSY_OAUTH_CALLBACK_URL;

        if (!clientId || !callbackUrl) {
            throw new Error('Etsy clientId or callback URL not configured');
        }

        // Generate PKCE code verifier and challenge
        const codeVerifier = this.generateCodeVerifier();
        const codeChallenge = this.generateCodeChallenge(codeVerifier);

        // Save code verifier for later use in token exchange
        this.connection.set('codeVerifier', codeVerifier);
        this.connection.save();

        const scopes = this.connection.apiConfiguration.scopes?.join(' ') || 
                      'listings_r transactions_r shops_r listings_w';

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            redirect_uri: callbackUrl,
            scope: scopes,
            state: state,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256'
        });

        const authUrl = `https://www.etsy.com/oauth/connect?${params.toString()}`;

        console.log('🔗 Etsy OAuth URL generated');
        return authUrl;
    }

    // ─── Exchange Code for Tokens ──────────────────────────────
    async exchangeCodeForTokens(code: string): Promise<any> {
        try {
            console.log('\n🔄 Exchanging authorization code for Etsy tokens...');

            // Clean the code
            let cleanCode = code;
            if (code.includes('&')) {
                cleanCode = code.split('&')[0];
            }
            if (code.includes('%')) {
                cleanCode = decodeURIComponent(cleanCode);
            }

            const clientId = this.credentials.clientId;
            const clientSecret = this.credentials.clientSecret;
            const codeVerifier = this.connection.get('codeVerifier');
            const callbackUrl = this.connection.apiConfiguration.tokenUrl || 
                               process.env.ETSY_OAUTH_CALLBACK_URL;

            if (!codeVerifier) {
                throw new Error('Code verifier not found. Please restart OAuth flow.');
            }

            // Make token request
            const tokenResponse = await axios.post(
                'https://api.etsy.com/v3/public/oauth/token',
                new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: clientId,
                    code: cleanCode,
                    redirect_uri: callbackUrl,
                    code_verifier: codeVerifier
                }).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
                    }
                }
            );

            const { access_token, refresh_token, token_type, expires_in } = tokenResponse.data;

            const tokens = {
                accessToken: access_token,
                refreshToken: refresh_token,
                tokenType: token_type,
                expiresIn: expires_in
            };

            // Save tokens
            await this.saveTokens(tokens);
            this.tokens = tokens;

            // Fetch shop info and save it
            await this.fetchAndSaveShopInfo();

            console.log('✅ Etsy tokens exchanged and saved successfully');

            return tokens;

        } catch (error: any) {
            console.error('❌ Etsy token exchange failed:', error.response?.data || error.message);
            throw new Error(`Token exchange failed: ${error.response?.data?.error_description || error.message}`);
        }
    }

    // ─── Refresh Access Token ──────────────────────────────────
    async refreshAccessToken(): Promise<any> {
        try {
            console.log('\n🔄 Refreshing Etsy access token...');

            if (!this.tokens?.refreshToken) {
                throw new Error('No refresh token available');
            }

            const clientId = this.credentials.clientId;
            const clientSecret = this.credentials.clientSecret;

            const tokenResponse = await axios.post(
                'https://api.etsy.com/v3/public/oauth/token',
                new URLSearchParams({
                    grant_type: 'refresh_token',
                    client_id: clientId,
                    refresh_token: this.tokens.refreshToken
                }).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
                    }
                }
            );

            const { access_token, refresh_token, expires_in } = tokenResponse.data;

            const newTokens = {
                accessToken: access_token,
                refreshToken: refresh_token || this.tokens.refreshToken,
                tokenType: 'Bearer',
                expiresIn: expires_in
            };

            await this.saveTokens(newTokens);
            this.tokens = newTokens;

            console.log('✅ Etsy token refreshed successfully');

            return newTokens;

        } catch (error: any) {
            console.error('❌ Token refresh failed:', error.response?.data || error.message);
            throw new Error('Failed to refresh token');
        }
    }

    // ─── Test Connection ───────────────────────────────────────
    async testConnection(): Promise<boolean> {
        try {
            await this.ensureValidToken();

            const response = await axios.get(
                `${this.baseUrl}/application/users/me`,
                {
                    headers: this.getAuthHeaders()
                }
            );

            console.log('✅ Etsy connection test successful');
            console.log('User ID:', response.data.user_id);

            return true;

        } catch (error: any) {
            console.error('❌ Etsy connection test failed:', error.response?.data || error.message);
            return false;
        }
    }

    // ─── Get Auth Headers (Override) ───────────────────────────
    protected getAuthHeaders(): Record<string, string> {
        if (!this.tokens?.accessToken) {
            throw new Error('No Etsy access token available');
        }

        return {
            'Authorization': `Bearer ${this.tokens.accessToken}`,
            'x-api-key': this.credentials.clientId, // Etsy requires this
            'Content-Type': 'application/json'
        };
    }

    // ─── Fetch Shop Info ───────────────────────────────────────
    private async fetchAndSaveShopInfo(): Promise<void> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/application/users/me/shops`,
                {
                    headers: this.getAuthHeaders()
                }
            );

            const shops = response.data.results || [];

            if (shops.length > 0) {
                const shop = shops[0];
                this.connection.set('shopId', shop.shop_id.toString());
                this.connection.set('shopName', shop.shop_name);
                await this.connection.save();

                console.log(`✅ Shop info saved: ${shop.shop_name} (${shop.shop_id})`);
            }

        } catch (error: any) {
            console.error('⚠️ Could not fetch shop info:', error.message);
        }
    }

    // ─── Fetch Orders (Receipts) ───────────────────────────────
    async fetchOrders(params: any = {}): Promise<any> {
        await this.ensureValidToken();

        const shopId = this.connection.get('shopId');
        if (!shopId) {
            throw new Error('Shop ID not found. Please reconnect.');
        }

        try {
            const response = await axios.get(
                `${this.baseUrl}/application/shops/${shopId}/receipts`,
                {
                    headers: this.getAuthHeaders(),
                    params: {
                        limit: params.limit || 25,
                        offset: params.offset || 0,
                        was_paid: params.wasPaid,
                        was_shipped: params.wasShipped
                    }
                }
            );

            const receipts = response.data.results || [];

            console.log(`✅ Found ${receipts.length} Etsy receipts`);

            return {
                success: true,
                orders: receipts,
                count: response.data.count
            };

        } catch (error: any) {
            console.error('❌ fetchOrders failed:', error.response?.data);
            return { success: false, orders: [], count: 0 };
        }
    }

    // ─── Fetch Products (Listings) ─────────────────────────────
    async fetchProducts(params: any = {}): Promise<any> {
        await this.ensureValidToken();

        const shopId = this.connection.get('shopId');
        if (!shopId) {
            throw new Error('Shop ID not found. Please reconnect.');
        }

        try {
            const response = await axios.get(
                `${this.baseUrl}/application/shops/${shopId}/listings/active`,
                {
                    headers: this.getAuthHeaders(),
                    params: {
                        limit: params.limit || 25,
                        offset: params.offset || 0,
                        state: params.state || 'active'
                    }
                }
            );

            const listings = response.data.results || [];

            console.log(`✅ Found ${listings.length} Etsy listings`);

            return {
                success: true,
                totalListings: response.data.count,
                listings: listings.map((listing: any) => ({
                    productId: listing.listing_id,
                    title: listing.title,
                    price: listing.price?.amount ? `${listing.price.amount} ${listing.price.currency_code}` : 'N/A',
                    quantity: listing.quantity,
                    state: listing.state,
                    url: listing.url,
                    images: listing.images?.map((img: any) => img.url_fullxfull) || []
                }))
            };

        } catch (error: any) {
            console.error('❌ fetchProducts failed:', error.response?.data);
            return { success: false, totalListings: 0, listings: [] };
        }
    }

    // ─── List Product (Create Listing) ────────────────────────
    async listProduct(productData: any): Promise<any> {
        await this.ensureValidToken();

        const shopId = this.connection.get('shopId');
        if (!shopId) {
            throw new Error('Shop ID not found. Please reconnect.');
        }

        console.log('\n📦 Etsy - Listing Product');
        console.log('Title:', productData.title);

        // Etsy requires specific fields
        const payload = {
            quantity: productData.quantity || 1,
            title: productData.title.substring(0, 140), // Max 140 chars
            description: productData.description || productData.title,
            price: parseFloat(productData.price).toFixed(2),
            who_made: 'i_did', // Required: i_did, someone_else, collective
            when_made: '2020_2024', // Required: made_to_order, 2020_2024, etc.
            taxonomy_id: 1, // Category ID - you may need to get this from Etsy API
            shipping_profile_id: null, // Optional
            return_policy_id: null, // Optional
            shop_section_id: null, // Optional
            type: 'physical', // physical or download
            tags: productData.tags || ['handmade', 'unique'], // Array of tags
            materials: productData.materials || [], // Array of materials
            // If you have images as URLs
            // images: productData.images || []
        };

        try {
            const response = await axios.post(
                `${this.baseUrl}/application/shops/${shopId}/listings`,
                payload,
                { 
                    headers: this.getAuthHeaders() 
                }
            );

            const listing = response.data;

            console.log('✅ Product listed on Etsy!');
            console.log('Listing ID:', listing.listing_id);

            return {
                success: true,
                productId: listing.listing_id,
                title: listing.title,
                status: listing.state,
                viewUrl: listing.url,
                adminUrl: `https://www.etsy.com/your/shops/${shopId}/tools/listings/${listing.listing_id}`
            };

        } catch (error: any) {
            console.error('❌ Etsy listing failed:', error.response?.data);
            throw new Error(
                `Etsy listing failed: ${JSON.stringify(error.response?.data?.errors || error.message)}`
            );
        }
    }

    // ─── Fetch Stats ───────────────────────────────────────────
    async fetchStats(): Promise<any> {
        await this.ensureValidToken();

        console.log('\n📊 Fetching Etsy stats...');

        try {
            const [receiptsData, listingsData] = await Promise.all([
                this.fetchOrders({ limit: 100 }),
                this.fetchProducts({ limit: 100 })
            ]);

            const allReceipts = receiptsData.orders || [];
            const allListings = listingsData.listings || [];

            const stats = {
                totalSales: allReceipts.length,
                pendingOrders: allReceipts.filter((r: any) => 
                    !r.was_shipped
                ).length,
                activeListings: allListings.filter((l: any) => 
                    l.state === 'active'
                ).length,
                totalRevenue: allReceipts.reduce(
                    (sum: number, r: any) => sum + parseFloat(r.grandtotal || 0), 0
                ),
                revenue24h: this.calculateRevenue24h(allReceipts),
                growth: this.calculateGrowth(allReceipts)
            };

            this.connection.stats = stats;
            this.connection.lastSync = new Date();
            await this.connection.save();

            console.log('✅ Etsy stats updated:', stats);
            return stats;

        } catch (error: any) {
            console.error('❌ fetchStats failed:', error.message);
            return {
                totalSales: 0,
                pendingOrders: 0,
                activeListings: 0,
                totalRevenue: 0,
                revenue24h: 0,
                growth: 0
            };
        }
    }

    // ─── PKCE Helpers ──────────────────────────────────────────
    private generateCodeVerifier(): string {
        return crypto.randomBytes(32).toString('base64url');
    }

    private generateCodeChallenge(verifier: string): string {
        return crypto
            .createHash('sha256')
            .update(verifier)
            .digest('base64url');
    }

    // ─── Private Helpers ───────────────────────────────────────
    private calculateRevenue24h(receipts: any[]): number {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        return receipts
            .filter(r => new Date(r.create_timestamp * 1000) >= yesterday)
            .reduce((sum, r) => sum + parseFloat(r.grandtotal || 0), 0);
    }

    private calculateGrowth(receipts: any[]): number {
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        const last14Days = new Date();
        last14Days.setDate(last14Days.getDate() - 14);

        const revenueLastWeek = receipts
            .filter(r => new Date(r.create_timestamp * 1000) >= last7Days)
            .reduce((sum, r) => sum + parseFloat(r.grandtotal || 0), 0);

        const revenuePreviousWeek = receipts
            .filter(r => {
                const date = new Date(r.create_timestamp * 1000);
                return date >= last14Days && date < last7Days;
            })
            .reduce((sum, r) => sum + parseFloat(r.grandtotal || 0), 0);

        return revenuePreviousWeek > 0
            ? ((revenueLastWeek - revenuePreviousWeek) / revenuePreviousWeek) * 100
            : 0;
    }
}