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
import customerRouter from './routes/customers.routes';

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
app.use(`${process.env.API_PREFIX}/vechilemodel`, modelRouter)
app.use(`${process.env.API_PREFIX}/customer`, customerRouter);

// Health check route
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK' });
});

export default app;
