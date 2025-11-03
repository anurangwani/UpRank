import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; // Ensure MongoDB connection
import analyticsRoutes from './routes/analyticsRoutes.js';
import seoMetricsRoutes from './routes/seoMetricsRoutes.js';
import userRoutes from './routes/UserRoutes.js'; // Import User Routes
import performanceHistoryRoutes from "./routes/performanceHistoryRoutes.js";
import seoRoutes from "./routes/seoRoutes.js";

dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors()); // Enable Cross-Origin requests (optional)
app.use(express.json()); // Parse JSON requests


// ✅ Connect to Database (Ensure this function is implemented)
connectDB();

// ✅ Use Routes
app.use('/api/users', userRoutes); // Prefix all user-related routes with /api/users
app.use('/api', analyticsRoutes);  
app.use('/api', seoMetricsRoutes);  
app.use("/api/performance", performanceHistoryRoutes);
app.use("/api", seoRoutes);

// ✅ Test Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
