import mongoose from 'mongoose';

const analyticsSchema = mongoose.Schema(
    {
        pageUrl: { type: String, required: true },
        pageLoadTime: { type: Number, required: true },
        ctr: { type: Number, required: true },
        bounceRate: { type: Number, required: true },
        date: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
