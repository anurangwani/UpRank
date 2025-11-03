import express from "express";
const router = express.Router();
import {getSeoMetrics} from "../controllers/seoController.js" // Import your controller

// Define the route for fetching SEO data
router.get("/seo", getSeoMetrics);

export default router;
