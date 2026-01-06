import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import 'dotenv/config'; // load env variables

// Import routes
import shopRouter from './routes/shop.routes';
import authRouter from './routes/auth.routes';
import { adminProtecter } from './middleware/auth.middleware';
import vehicleBrandRouter from './routes/vehicleBrand.routes';
import modelRouter from './routes/vehicleModel.routes';

import customerSourceRouter from './routes/customer.source.routes';
import repairStatusRouter from './routes/repair.status.routes';
import serviceTypeMasterRouter from './routes/services.types.master.routes';
import subServiceRouter from './routes/subServices.routes';
import cityRouter from './routes/city.routes';
import countryRouter from './routes/country.routes';
import addressRouter from './routes/addresses.routes';
import TechnicianRoleRouter from './routes/technician.roles.routes';
import ServiceZoneRouter from './routes/service.zones.routes';
import ServiceRequestPrioprityRouter from './routes/service.request.prioprity.routes';
import serviceRequestTypeRouter from './routes/service.request.types.routes';
import CustomerBaseRouter from './routes/customer.routes';
import technicianRouter from './routes/technician.routes';
import currecyRouter from './routes/currency.routes';
import paymentTermRouter from './routes/payment.terms.routes';
import orderStatusRouter from './routes/order.status.rotues';
import productChannelsRouter from './routes/product.channel.routes';
import productSourceRouter from './routes/product.source.routes';
import proposedActionsRouter from './routes/proposed.actions.routes';
import ItemsConditionsRouter from './routes/items.conditions.routes';
import taxRouter from './routes/tax.routes';
import categoryRouter from './routes/category.routes';
import venderRouter from './routes/vender.routes';
import unitRouter from './routes/units.routes';
import warehouseStatusRouter from './routes/warehouse.status.routes';
import warehouseRouter from './routes/warehouse.routes';
import colorRouter from './routes/color.routes';
import sizeRouter from './routes/size.routes';
import productBaseRouter from "./routes/product.base.routes"


// Create express app
const app: Application = express();

// Middlewares
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded
app.use(cors());

// Static files (for uploads/public folder)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// Routes
app.use(`${process.env.API_PREFIX}/auth`, authRouter);
app.use(`${process.env.API_PREFIX}/register`, shopRouter);
app.use(`${process.env.API_PREFIX}/vehiclebrand`, adminProtecter, vehicleBrandRouter);
app.use(`${process.env.API_PREFIX}/vechilemodel`, adminProtecter, modelRouter);
app.use(`${process.env.API_PREFIX}/repairstatus`, adminProtecter, repairStatusRouter);
app.use(`${process.env.API_PREFIX}/service-types-master`, adminProtecter, serviceTypeMasterRouter);
app.use(`${process.env.API_PREFIX}/sub-services`, adminProtecter, subServiceRouter);
app.use(`${process.env.API_PREFIX}/city`, adminProtecter, cityRouter);
app.use(`${process.env.API_PREFIX}/country`, adminProtecter, countryRouter);
app.use(`${process.env.API_PREFIX}/customer-source`, adminProtecter, customerSourceRouter);
app.use(`${process.env.API_PREFIX}/addresses`, adminProtecter, addressRouter);
app.use(`${process.env.API_PREFIX}/technician-roles`, adminProtecter, TechnicianRoleRouter);
app.use(`${process.env.API_PREFIX}/services-zones`, adminProtecter, ServiceZoneRouter);
app.use(`${process.env.API_PREFIX}/service-request-prioprity-level`, adminProtecter, ServiceRequestPrioprityRouter);
app.use(`${process.env.API_PREFIX}/service-request-type`, adminProtecter, serviceRequestTypeRouter);
app.use(`${process.env.API_PREFIX}/customers`, adminProtecter, CustomerBaseRouter);
app.use(`${process.env.API_PREFIX}/technicians`, adminProtecter, technicianRouter);
app.use(`${process.env.API_PREFIX}/currencies`, adminProtecter, currecyRouter);
app.use(`${process.env.API_PREFIX}/payment-terms`, adminProtecter, paymentTermRouter);
app.use(`${process.env.API_PREFIX}/order-status`, adminProtecter, orderStatusRouter);
app.use(`${process.env.API_PREFIX}/product-channels`, adminProtecter, productChannelsRouter);
app.use(`${process.env.API_PREFIX}/product-source`, adminProtecter, productSourceRouter);
app.use(`${process.env.API_PREFIX}/proposed-actions`, adminProtecter, proposedActionsRouter);
app.use(`${process.env.API_PREFIX}/items-conditions`, adminProtecter, ItemsConditionsRouter);
app.use(`${process.env.API_PREFIX}/tax`, adminProtecter, taxRouter);
app.use(`${process.env.API_PREFIX}/units`, adminProtecter, unitRouter);
app.use(`${process.env.API_PREFIX}/categories`, adminProtecter, categoryRouter);
app.use(`${process.env.API_PREFIX}/venders`, adminProtecter, venderRouter);
app.use(`${process.env.API_PREFIX}/warehouse-status`, adminProtecter, warehouseStatusRouter);
app.use(`${process.env.API_PREFIX}/warehouses`, adminProtecter, warehouseRouter);
app.use(`${process.env.API_PREFIX}/colors`, adminProtecter, colorRouter);
app.use(`${process.env.API_PREFIX}/sizes`, adminProtecter, sizeRouter);
app.use(`${process.env.API_PREFIX}/product-base`, adminProtecter, productBaseRouter);



// Health check route
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK' });
});

export default app;
