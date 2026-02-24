// routes/marketplace.routes.ts

import { Router } from 'express';
import { MarketplaceController } from '../../controllers/marketplace-controllers/marketplace.controller';

const router = Router();
const controller = new MarketplaceController();

// Get marketplace types
router.get('/types', controller.getMarketplaceTypes.bind(controller));

// CRUD operations
router.post('/connections', controller.createConnection.bind(controller));
router.get('/connections', controller.getConnections.bind(controller));
router.get('/connections/:id', controller.getConnection.bind(controller));
router.put('/connections/:id', controller.updateConnection.bind(controller));
router.delete('/connections/:id', controller.deleteConnection.bind(controller));


// Connection operations
router.post('/connections/:id/connect', controller.connectMarketplace.bind(controller));
router.post('/connections/:id/test', controller.testConnection.bind(controller));
router.post('/connections/:id/sync', controller.syncData.bind(controller));
router.post('/connections/:id/exchange-code', controller.exchangeAuthCode.bind(controller));
router.get('/connections/:id/verify', controller.verifyEbayCredentials.bind(controller));
// OAuth callback
router.get('/callback/:type', controller.handleOAuthCallback.bind(controller));

export default router;