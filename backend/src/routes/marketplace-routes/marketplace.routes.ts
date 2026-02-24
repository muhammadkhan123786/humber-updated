// routes/marketplace.routes.ts

import { Router } from 'express';
import { MarketplaceController } from '../../controllers/marketplace-controllers/marketplace.controller';

const router = Router();
const controller = new MarketplaceController();

// Get marketplace types
router.get('/types', controller.getMarketplaceTypes.bind(controller));

// CRUD operations
router.post('/', controller.createConnection.bind(controller));
router.get('/', controller.getConnections.bind(controller));
router.get('/:id', controller.getConnection.bind(controller));
router.put('/:id', controller.updateConnection.bind(controller));
router.delete('/:id', controller.deleteConnection.bind(controller));


// Connection operations
router.post('/:id/connect', controller.connectMarketplace.bind(controller));
router.post('/:id/:userId/test', controller.testConnection.bind(controller));
router.post('/:id/:userId/sync', controller.syncData.bind(controller));
router.post('/:id/exchange-code', controller.exchangeAuthCode.bind(controller));
router.get('/:id/verify', controller.verifyEbayCredentials.bind(controller));
// OAuth callback
router.get('/callback/:type', controller.handleOAuthCallback.bind(controller));

export default router;