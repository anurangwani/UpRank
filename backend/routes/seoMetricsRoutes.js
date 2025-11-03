import express from 'express';
import SEOMetrics from '../models/SEOMetrics.js';  // Import your SEOMetrics model
import { protect } from '../middleware/protect.js';  // Protect route middleware

const router = express.Router();

// Create a new SEO metrics record
router.post('/seometrics', protect, async (req, res) => {
    try {
        const { keyword, position, searchVolume, backlinkCount, domainAuthority } = req.body;

        const newSEOMetrics = new SEOMetrics({
            keyword,
            position,
            searchVolume,
            backlinkCount,
            domainAuthority
        });
        
        await newSEOMetrics.save();
        
        res.status(201).json({ message: 'SEO Metrics data saved successfully!', data: newSEOMetrics });
    } catch (error) {
        res.status(500).json({ message: 'Error saving SEO Metrics data', error: error.message });
    }
});

// Get all SEO metrics records
router.get('/seometrics', protect, async (req, res) => {
    try {
        const seoMetricsData = await SEOMetrics.find();
        res.status(200).json(seoMetricsData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching SEO metrics data', error: error.message });
    }
});

export default router;
