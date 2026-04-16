import app from './app';
import 'dotenv/config';
import { connectDB } from './config/db';




const PORT = process.env.PORT || 3000;
// Start server
const startServer = async () => {
    await connectDB();
//   app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🌐 API Prefix: ${process.env.API_PREFIX}`);
    });
  
};

startServer();
