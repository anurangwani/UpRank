import mongoose from "mongoose";

const PerformanceHistorySchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    SEOMetrics: {
        bounceRate: Number,
        pageLoadTime: Number,
        mobileFriendly: Boolean,
        backlinks: Number,
    },
});

const PerformanceHistory = mongoose.model("PerformanceHistory", PerformanceHistorySchema);
export default PerformanceHistory;
