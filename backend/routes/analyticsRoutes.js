import express from 'express';
import Analytics from '../models/Analytics.js';  // Import your Analytics model
import { protect } from '../middleware/protect.js';  // Protect route middleware

const router = express.Router();

// Create a new analytics record
router.post('/analytics', protect, async (req, res) => {
    try {
        const { pageUrl, pageLoadTime, ctr, bounceRate } = req.body;

        const newAnalytics = new Analytics({
            pageUrl,
            pageLoadTime,
            ctr,
            bounceRate
        });

        await newAnalytics.save();
        res.status(201).json({ message: 'Analytics data saved successfully!', data: newAnalytics });
    } catch (error) {
        res.status(500).json({ message: 'Error saving analytics data', error: error.message });
    }
});

// Get all analytics records
router.get('/analytics', protect, async (req, res) => {
    try {
        const analyticsData = await Analytics.find();
        res.status(200).json(analyticsData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics data', error: error.message });
    }
});

export default router;
