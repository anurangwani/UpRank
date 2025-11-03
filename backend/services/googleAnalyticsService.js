import { google } from 'googleapis';
import PerformanceHistory from "../models/performanceHistoryModel.js";
import key from "../config/uprank-455118-4559af6f45f4.json";

// Function to fetch data from Google Analytics
const fetchAnalyticsData = async () => {
    try {
        // Set up OAuth2 client
        const auth = new google.auth.OAuth2(
            key.client_email,
            1054355767085-j5nh99587koqca3cekgjd3bd9k8985q0.apps.googleusercontent.com,
           "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",
            "http://localhost:5000/auth/google/callback"
        );
        auth.setCredentials({ access_token: YOUR_ACCESS_TOKEN });

        // Access the Analytics API
        const analytics = google.analytics('v3');
        const response = await analytics.data.ga.get({
            auth,
            ids: 'ga:YOUR_VIEW_ID',  // Replace with your Google Analytics view ID
            'start-date': '7daysAgo',
            'end-date': 'today',
            metrics: 'ga:bounceRate,ga:pageLoadTime',
        });

        // Extract relevant data
        const { bounceRate, pageLoadTime } = response.data.rows[0]; // Adjust based on response format

        // Save to PerformanceHistory collection
        const newEntry = new PerformanceHistory({
            seoMetrics: {
                bounceRate: parseFloat(bounceRate),
                pageLoadTime: parseFloat(pageLoadTime),
                mobileFriendly: true, // You may need to get this from another source
                backlinks: 120, // You can get this data from other sources like SEO tools
            }
        });
        
        await newEntry.save();
        console.log('Performance data saved to history!');
    } catch (error) {
        console.error('Error fetching Analytics data:', error);
    }
};

fetchAnalyticsData(); // Call the function to fetch and save data
