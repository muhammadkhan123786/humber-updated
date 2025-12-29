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
app.use(`${process.env.API_PREFIX}/vechilemodel`, modelRouter);
app.use(`${process.env.API_PREFIX}/repairstatus`, repairStatusRouter);
app.use(`${process.env.API_PREFIX}/service-types-master`, serviceTypeMasterRouter);
app.use(`${process.env.API_PREFIX}/sub-services`, subServiceRouter);
app.use(`${process.env.API_PREFIX}/city`, cityRouter);
app.use(`${process.env.API_PREFIX}/country`, countryRouter);
app.use(`${process.env.API_PREFIX}/customer-source`, customerSourceRouter);
app.use(`${process.env.API_PREFIX}/addresses`, addressRouter);




// Health check route
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK' });
});

export default app;
