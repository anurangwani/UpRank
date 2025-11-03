import PerformanceHistory from "../models/performanceHistoryModel.js";

// Save new SEO metrics to history
export const savePerformanceHistory = async (req, res) => {
    try {
        const { bounceRate, pageLoadTime, mobileFriendly, backlinks } = req.body;

        // Ensure you're getting all the required data
        if (!bounceRate || !pageLoadTime || !mobileFriendly || !backlinks) {
            return res.status(400).json({ error: "Missing required SEO metrics data" });
        }

        // Create a new entry in the performance history
        const newEntry = new PerformanceHistory({
            seoMetrics: { bounceRate, pageLoadTime, mobileFriendly, backlinks },
        });

       
        await newEntry.save();

        res.status(201).json({ message: "Performance history saved successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get all historical SEO performance data
export const getPerformanceHistory = async (req, res) => {
    try {
        const history = await PerformanceHistory.find().sort({ date: -1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
