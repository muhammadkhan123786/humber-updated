// src/routes/shopify.routes.ts

import { Router } from 'express';
import { ShopifyController } from '../../controllers/marketplace-controllers/shopfy.controller';

const router = Router();
const ctrl = new ShopifyController();

// ─── Connection CRUD ───────────────────────────────────────────
router.post('/connections', ctrl.createConnection.bind(ctrl));
router.get('/connections', ctrl.getConnections.bind(ctrl));
router.get('/connections/:id', ctrl.getConnection.bind(ctrl));
router.delete('/connections/:id', ctrl.deleteConnection.bind(ctrl));

// ─── Connection Actions ────────────────────────────────────────
router.post('/connections/:id/connect', ctrl.connectShopify.bind(ctrl));
router.post('/connections/:id/test', ctrl.testConnection.bind(ctrl));
router.post('/connections/:id/sync', ctrl.syncData.bind(ctrl));

// ─── Product Operations ────────────────────────────────────────
// router.post('/connections/:id/products', ctrl.listProduct.bind(ctrl));
router.get('/connections/:id/products', ctrl.getProducts.bind(ctrl));

export default router;