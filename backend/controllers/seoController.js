import axios from "axios";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

// Load Google Service Account Key
const auth = new google.auth.GoogleAuth({
    keyFile: "D:/MERN/UpRank/backend/config/uprank-455118-4559af6f45f4.json",  // Change to your actual key file path
    scopes: [
        "https://www.googleapis.com/auth/webmasters.readonly",
        "https://www.googleapis.com/auth/analytics.readonly",
    ],
});

// 🔹 Fetch PageSpeed Insights
const getPageSpeedData = async (url) => {
    try {
        const response = await axios.get(
            `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${process.env.PAGESPEED_API_KEY}`
        );

        return {
            pageSpeedScore: response.data.lighthouseResult.categories.performance.score * 100,
            metrics: response.data.lighthouseResult.audits
        };
    } catch (error) {
        console.error("Error fetching PageSpeed data:", error.message);
        return { error: "Failed to fetch PageSpeed data" };
    }
};

// 🔹 Fetch CTR from Google Search Console
const getCTRFromGSC = async (url) => {
    try {
        const client = await auth.getClient();
        const searchConsole = google.searchconsole({ version: "v1", auth: client });

        const response = await searchConsole.searchanalytics.query({
            siteUrl: url,
            requestBody: {
                startDate: "2025-03-01",
                endDate: "2025-03-31",
                dimensions: ["query"],
            },
        });

        return response.data.rows?.[0]?.ctr || 0;  // Get CTR value
    } catch (error) {
        console.error("Error fetching CTR:", error.message);
        return null;
    }
};

// 🔹 Fetch Bounce Rate from Google Analytics
const getBounceRateFromGA = async (url) => {
    try {
        const client = await auth.getClient();
        const analytics = google.analyticsdata({ version: "v1beta", auth: client });

        const response = await analytics.properties.runReport({
            property: "properties/336890866",  // Change this to your GA Property ID
            requestBody: {
                dateRanges: [{ startDate: "2025-03-01", endDate: "2025-03-31" }],
                metrics: [{ name: "bounceRate" }],
            },
        });

        return response.data.rows?.[0]?.metricValues?.[0]?.value || "N/A";
    } catch (error) {
        console.error("Error fetching Bounce Rate:", error.message);
        return null;
    }
};

// 🔹 Main Controller Function
export const getSeoMetrics = async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ error: "URL is required" });

        const pageSpeedData = await getPageSpeedData(url);
        const ctr = await getCTRFromGSC(url);
        const bounceRate = await getBounceRateFromGA(url);

        res.json({
            url,
            pageSpeedScore: pageSpeedData.pageSpeedScore,
            ctr,
            bounceRate,
            performanceMetrics: pageSpeedData.metrics
        });
    } catch (error) {
        console.error("Error fetching SEO metrics:", error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
};
